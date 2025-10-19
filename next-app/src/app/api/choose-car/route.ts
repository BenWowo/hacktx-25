import { NextResponse } from 'next/server';

export type FormDataPayload = {
  creditScore?: string;
  annualIncome?: string;
  downPayment?: string;
  carPrice?: string;
  employmentStatus?: string;
  monthlyBudget?: string;
  lifestyle?: string;
  jobDescription?: string;
};

const CARS = [
  { id: 'corolla', name: 'Toyota Corolla', price: 27500 },
  { id: 'camry', name: 'Toyota Camry', price: 32500 },
  { id: 'rav4', name: 'Toyota RAV4', price: 37500 },
];

async function callGemini(payload: FormDataPayload) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  try {
    const prompt = `Given the following user profile, pick the most applicable Toyota from the list with a short justification:\n\nUser:\n${JSON.stringify(
      payload,
      null,
      2
    )}\n\nCars:\n${JSON.stringify(CARS, null, 2)}`;

    const res = await fetch('https://api.openai.com/v1/engines/gemini-mini/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ prompt, max_tokens: 300 }),
    });

    if (!res.ok) return null;
    const json = await res.json();
    const text = (json.choices && json.choices[0] && json.choices[0].text) || json.result || null;
    return text;
  } catch (err) {
    console.error('Gemini call failed', err);
    return null;
  }
}

function heuristicPick(payload: FormDataPayload) {
  // Basic heuristic: use monthlyBudget to assign a tier
  const monthly = parseFloat(payload.monthlyBudget || '0');
  if (!isNaN(monthly)) {
    if (monthly < 400) return CARS[0];
    if (monthly < 600) return CARS[1];
    return CARS[2];
  }

  // fallback to carPrice
  const price = parseFloat(payload.carPrice || '0');
  if (!isNaN(price)) {
    if (price < 30000) return CARS[0];
    if (price < 35000) return CARS[1];
    return CARS[2];
  }

  return CARS[1];
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as FormDataPayload;

    // Try Gemini (optional) — if not configured or fails, fallback to heuristic
    const g = await callGemini(body);

    if (g) {
      // Attempt to parse the model response for a car id
      const lowered = g.toLowerCase();
      for (const c of CARS) {
        if (lowered.includes(c.id) || lowered.includes(c.name.toLowerCase())) {
          return NextResponse.json({ car: c, explanation: g });
        }
      }
      // if not found, return full text as explanation and heuristically pick
      const pick = heuristicPick(body);
      return NextResponse.json({ car: pick, explanation: g });
    }

    const car = heuristicPick(body);
    return NextResponse.json({ car, explanation: 'Heuristic fallback' });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to choose car' }, { status: 500 });
  }
}
