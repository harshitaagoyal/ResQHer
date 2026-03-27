import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req) {
  let data = {};

  try {
    data = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "No API Key found" }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel(
      { model: "gemini-2.5-flash" },
    //   { apiVersion: "v1" }
    );

    // Build contact info dynamically based on her preference
    const contactInfo = data.preferredContact?.map(method => {
      if (method === 'Phone') return `phone at ${data.phone}`;
      if (method === 'Email') return `email at ${data.email}`;
      if (method === 'WhatsApp') return `WhatsApp at ${data.phone}`;
      if (method === 'In-person') return `an in-person visit`;
      return method;
    }).join(' or ');

    const prompt = `A woman is in danger and needs urgent help. Write an urgent first-person plea for help in exactly 3 short paragraphs, like an official distress statement.

Her details:
- Name: ${data.name}
- Location coordinates: ${data.location?.lat}, ${data.location?.lng}
- What is happening: ${data.currentSituation}
- Duration: ${data.occurrenceDuration} months
- How often: ${data.frequency}
- Who is doing this: ${data.culprit}
- Visible injuries: ${data.visibleInjuries}
- Preferred contact: ${contactInfo}

Write exactly in this structure:
Paragraph 1: "This is an urgent plea for help. My name is [name], and I am in desperate need of immediate assistance. I am currently located at [coordinates]."
Paragraph 2: Describe the abuse — how long, how often, who the perpetrator is and what they are doing to her.
Paragraph 3: Express her fear and urgency. End with "Please contact me immediately via ${contactInfo}. Every moment counts."

Rules:
- First person only ("I am", "I have been", "I need")
- No bullet points, no headings, no labels
- Keep each paragraph to 2-3 sentences maximum
- Sound urgent, genuine and human — not robotic or formal
- Write ONLY the 3 paragraphs, nothing else`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return NextResponse.json({
      gemini_response: text,
      gemma_response: "Incident: " + data.currentSituation + ". Reported duration: " + data.occurrenceDuration + " days.",
    }, { status: 200 });

  } catch (error) {
    console.error('FULL ERROR:', JSON.stringify(error, null, 2));
    console.error('ERROR MESSAGE:', error.message);

    return NextResponse.json({
      error: error.message,
      gemini_response: `This is an urgent plea for help. My name is ${data.name || "a woman in need"}, and I am in desperate need of immediate assistance. I am currently experiencing ${data.currentSituation || "abuse"} and need help right away. Please contact me immediately. Every moment counts.`,
      gemma_response: "Reported: " + (data.currentSituation || "situation on file")
    }, { status: 200 });
  }
}