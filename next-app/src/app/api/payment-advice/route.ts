import { NextResponse } from 'next/server';

export type AdviceRequest = {
  formData: any;
  selectedCar?: any;
  selectedOption: string;
};

const callGemini = async (payload: AdviceRequest) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  try {
    const prompt = `You are a financial advisor for car purchases. Given the user profile and selected financing option, provide a concise list of recommended financial actions (3-6 bullet points) the user should take. Include why each action matters and an estimated dollar impact if applicable.\n\nUser Profile: ${JSON.stringify(
      payload.formData,
      null,
      2
    )}\n\nSelected Car: ${JSON.stringify(payload.selectedCar, null, 2)}\n\nSelected Option: ${payload.selectedOption}`;

    const res = await fetch('https://api.openai.com/v1/engines/gemini-mini/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ prompt, max_tokens: 400 }),
    });

    if (!res.ok) return null;
    const json = await res.json();
    const text = (json.choices && json.choices[0] && json.choices[0].text) || json.result || null;
    return text;
  } catch (err) {
    console.error('Gemini payment advice call failed', err);
    return null;
  }
};

const heuristicAdvice = (req: AdviceRequest) => {
  const { formData, selectedCar, selectedOption } = req;
  const credit = parseInt(formData.creditScore || '0');
  const down = parseFloat(formData.downPayment || '0');
  const price = selectedCar ? selectedCar.price : parseFloat(formData.carPrice || '0');
  const monthly = parseFloat(formData.monthlyBudget || '0');
  const advice: string[] = [];

  if (selectedOption === 'finance') {
    advice.push(`Consider increasing your down payment by $${Math.max(0, Math.round(price * 0.1 - down))} to reduce monthly payments and interest paid.`);
    if (credit < 670) advice.push('Work on improving your credit score to reduce your APR; even a 30-50 point increase can lower rates by ~1-2%');
    if (monthly < (price*0.02)) advice.push('Re-evaluate term length: extending term lowers payments but increases total interest.');
    advice.push('Shop around for financing offers from multiple lenders to get the best APR.');
  } else if (selectedOption === 'lease') {
    advice.push('Negotiate capitalized cost and residual value; a lower cap cost reduces monthly payments.');
    if (down > 0) advice.push('Consider reducing upfront payment on lease and retaining it as savings for unexpected costs.');
    advice.push('Check mileage limits to avoid excess fees; choose a higher mileage cap if you drive more.');
  } else {
    advice.push('If paying cash, confirm you still maintain an emergency fund (3-6 months expenses) after purchase.');
    if (price > 50000) advice.push('Negotiate price and check certified pre-owned options for potential savings.');
  }

  // Add a small summary
  advice.push('Final note: review insurance implications and total cost of ownership (maintenance, fuel, insurance) before committing.');

  return advice.join('\n\n');
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as AdviceRequest;

    const g = await callGemini(body);
    if (g) return NextResponse.json({ advice: g });

    const fallback = heuristicAdvice(body);
    return NextResponse.json({ advice: fallback });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to generate advice' }, { status: 500 });
  }
}
