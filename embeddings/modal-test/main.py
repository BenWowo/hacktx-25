from pathlib import Path
from typing import Optional
from urllib.request import urlopen
from uuid import uuid4

import modal

MINUTES = 60  # seconds

app = modal.App("example-chat-with-pdf-vision")

CACHE_DIR = "/hf-cache"

model_image = (
    modal.Image.debian_slim(python_version="3.12")
    .apt_install("git")
    .pip_install(
        [
            "colpali-engine==0.3.5",
            "transformers>=4.45.0",
            "torch>=2.0.0",
            "hf_transfer==0.1.8",
            "qwen-vl-utils==0.0.8",
            "torchvision==0.19.1",
        ]
    )
    .env({"HF_HUB_ENABLE_HF_TRANSFER": "1", "HF_HUB_CACHE": CACHE_DIR})
)

with model_image.imports():
    import torch
    from colpali_engine.models import ColQwen2, ColQwen2Processor
    from qwen_vl_utils import process_vision_info
    from transformers import AutoProcessor, Qwen2VLForConditionalGeneration

MODEL_NAME = "Qwen/Qwen2-VL-2B-Instruct"
MODEL_REVISION = "aca78372505e6cb469c4fa6a35c60265b00ff5a4"

sessions = modal.Dict.from_name("colqwen-chat-sessions", create_if_missing=True)

class Session:
    def __init__(self):
        self.images = None
        self.messages = []
        self.pdf_embeddings = None

pdf_volume = modal.Volume.from_name("colqwen-chat-pdfs", create_if_missing=True)
PDF_ROOT = Path("/vol/pdfs/")

cache_volume = modal.Volume.from_name("hf-hub-cache", create_if_missing=True)

@app.function(
    image=model_image, volumes={CACHE_DIR: cache_volume}, timeout=20 * MINUTES
)
def download_model():
    from huggingface_hub import snapshot_download

    result = snapshot_download(
        MODEL_NAME,
        revision=MODEL_REVISION,
        ignore_patterns=["*.pt", "*.bin"],  # using safetensors
    )
    print(f"Downloaded model weights to {result}")

@app.cls(
    image=model_image,
    gpu="A100-80GB",
    scaledown_window=10 * MINUTES,  # spin down when inactive
    volumes={"/vol/pdfs/": pdf_volume, CACHE_DIR: cache_volume},
)
class Model:
    @modal.enter()
    def load_models(self):
        self.colqwen2_model = ColQwen2.from_pretrained(
            "vidore/colqwen2-v0.1",
            torch_dtype=torch.bfloat16,
            device_map="cuda:0",
        )
        self.colqwen2_processor = ColQwen2Processor.from_pretrained(
            "vidore/colqwen2-v0.1"
        )
        self.qwen2_vl_model = Qwen2VLForConditionalGeneration.from_pretrained(
            MODEL_NAME,
            revision=MODEL_REVISION,
            torch_dtype=torch.bfloat16,
        )
        self.qwen2_vl_model.to("cuda:0")
        self.qwen2_vl_processor = AutoProcessor.from_pretrained(
            "Qwen/Qwen2-VL-2B-Instruct", trust_remote_code=True
        )

    @modal.method()
    def index_pdf(self, session_id, target: bytes | list):
        # We store concurrent user chat sessions in a modal.Dict

        # For simplicity, we assume that each user only runs one session at a time

        session = sessions.get(session_id)
        if session is None:
            session = Session()

        if isinstance(target, bytes):
            images = convert_pdf_to_images.remote(target)
        else:
            images = target

        # Store images on a Volume for later retrieval
        session_dir = PDF_ROOT / f"{session_id}"
        session_dir.mkdir(exist_ok=True, parents=True)
        for ii, image in enumerate(images):
            filename = session_dir / f"{str(ii).zfill(3)}.jpg"
            image.save(filename)

        # Generated embeddings from the image(s)
        BATCH_SZ = 4
        pdf_embeddings = []
        batches = [images[i : i + BATCH_SZ] for i in range(0, len(images), BATCH_SZ)]
        for batch in batches:
            batch_images = self.colqwen2_processor.process_images(batch).to(
                self.colqwen2_model.device
            )
            pdf_embeddings += list(self.colqwen2_model(**batch_images).to("cpu"))

        # Store the image embeddings in the session, for later retrieval
        session.pdf_embeddings = pdf_embeddings

        # Write embeddings back to the modal.Dict
        sessions[session_id] = session

    @modal.method()
    def respond_to_message(self, session_id, message):
        session = sessions.get(session_id)
        if session is None:
            session = Session()

        pdf_volume.reload()  # make sure we have the latest data

        images = (PDF_ROOT / str(session_id)).glob("*.jpg")
        images = list(sorted(images, key=lambda p: int(p.stem)))

        # Nothing to chat about without a PDF!
        if not images:
            return "Please upload a PDF first"
        elif session.pdf_embeddings is None:
            return "Indexing PDF..."

        # RAG, Retrieval-Augmented Generation, is two steps:

        # _Retrieval_ of the most relevant data to answer the user's query
        relevant_image = self.get_relevant_image(message, session, images)

        # _Generation_ based on the retrieved data
        output_text = self.generate_response(message, session, relevant_image)

        # Update session state for future chats
        append_to_messages(message, session, user_type="user")
        append_to_messages(output_text, session, user_type="assistant")
        sessions[session_id] = session

        return output_text

    # Retrieve the most relevant image from the PDF for the input query
    def get_relevant_image(self, message, session, images):
        import PIL

        batch_queries = self.colqwen2_processor.process_queries([message]).to(
            self.colqwen2_model.device
        )
        query_embeddings = self.colqwen2_model(**batch_queries)

        # This scores our query embedding against the image embeddings from index_pdf
        scores = self.colqwen2_processor.score_multi_vector(
            query_embeddings, session.pdf_embeddings
        )[0]

        # Select the best matching image
        max_index = max(range(len(scores)), key=lambda index: scores[index])
        return PIL.Image.open(images[max_index])

    # Pass the query and retrieved image along with conversation history into the VLM for a response
    def generate_response(self, message, session, image):
        chatbot_message = get_chatbot_message_with_image(message, image)
        query = self.qwen2_vl_processor.apply_chat_template(
            [*session.messages, chatbot_message],
            tokenize=False,
            add_generation_prompt=True,
        )
        image_inputs, _ = process_vision_info([chatbot_message])
        inputs = self.qwen2_vl_processor(
            text=[query],
            images=image_inputs,
            padding=True,
            return_tensors="pt",
        )
        inputs = inputs.to("cuda:0")

        generated_ids = self.qwen2_vl_model.generate(**inputs, max_new_tokens=512)
        generated_ids_trimmed = [
            out_ids[len(in_ids) :]
            for in_ids, out_ids in zip(inputs.input_ids, generated_ids)
        ]
        output_text = self.qwen2_vl_processor.batch_decode(
            generated_ids_trimmed,
            skip_special_tokens=True,
            clean_up_tokenization_spaces=False,
        )[0]
        return output_text

pdf_image = (
    modal.Image.debian_slim(python_version="3.12")
    .apt_install("poppler-utils")
    .pip_install("pdf2image==1.17.0", "pillow==10.4.0")
)


@app.function(image=pdf_image)
def convert_pdf_to_images(pdf_bytes):
    from pdf2image import convert_from_bytes

    images = convert_from_bytes(pdf_bytes, fmt="jpeg")
    return images

@app.local_entrypoint()
def main(
    question: Optional[str] = None,
    pdf_path: Optional[str] = None,
    session_id: Optional[str] = None,
):
    model = Model()
    if session_id is None:
        session_id = str(uuid4())
        print("Starting a new session with id", session_id)

        if pdf_path is None:
            pdf_path = "https://arxiv.org/pdf/1706.03762"  # all you need

        if pdf_path.startswith("http"):
            pdf_bytes = urlopen(pdf_path).read()
        else:
            pdf_bytes = Path(pdf_path).read_bytes()

        print("Indexing PDF from", pdf_path)
        model.index_pdf.remote(session_id, pdf_bytes)
    else:
        if pdf_path is not None:
            raise ValueError("Start a new session to chat with a new PDF")
        print("Resuming session with id", session_id)

    if question is None:
        question = "What is this document about?"

    print("QUESTION:", question)
    print(model.respond_to_message.remote(session_id, question))

def get_chatbot_message_with_image(message, image):
    return {
        "role": "user",
        "content": [
            {"type": "image", "image": image},
            {"type": "text", "text": message},
        ],
    }


def append_to_messages(message, session, user_type="user"):
    session.messages.append(
        {
            "role": user_type,
            "content": {"type": "text", "text": message},
        }
    )

web_image = pdf_image.pip_install(
    "fastapi[standard]==0.115.4",
    "pydantic==2.9.2",
    "starlette==0.41.2",
    "gradio==4.44.1",
    "pillow==10.4.0",
    "gradio-pdf==0.0.15",
    "pdf2image==1.17.0",
)


@app.function(
    image=web_image,
    # gradio requires sticky sessions
    # so we limit the number of concurrent containers to 1
    # and allow it to scale to 1000 concurrent inputs
    max_containers=1,
)
@modal.concurrent(max_inputs=1000)
@modal.asgi_app()
def ui():
    import uuid

    import gradio as gr
    from fastapi import FastAPI
    from gradio.routes import mount_gradio_app
    from gradio_pdf import PDF
    from pdf2image import convert_from_path

    web_app = FastAPI()

    # Since this Gradio app is running from its own container,
    # allowing us to run the inference service via .remote() methods.
    model = Model()

    def upload_pdf(path, session_id):
        if session_id == "" or session_id is None:
            # Generate session id if new client
            session_id = str(uuid.uuid4())

        images = convert_from_path(path)
        # Call to our remote inference service to index the PDF
        model.index_pdf.remote(session_id, images)

        return session_id

    def respond_to_message(message, _, session_id):
        # Call to our remote inference service to run RAG
        return model.respond_to_message.remote(session_id, message)

    with gr.Blocks(theme="soft") as demo:
        session_id = gr.State("")

        gr.Markdown("# Chat with PDF")
        with gr.Row():
            with gr.Column(scale=1):
                gr.ChatInterface(
                    fn=respond_to_message,
                    additional_inputs=[session_id],
                    retry_btn=None,
                    undo_btn=None,
                    clear_btn=None,
                )
            with gr.Column(scale=1):
                pdf = PDF(
                    label="Upload a PDF",
                )
                pdf.upload(upload_pdf, [pdf, session_id], session_id)

    return mount_gradio_app(app=web_app, blocks=demo, path="/")