import { NextResponse } from 'next/server';

// Point this to your newly running ResQHer Express backend
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

export async function POST(req) {
  try {
    const body = await req.json();

    const payload = {
      message: body.userInput || body.message, 
      history: body.history || [],             
      mode: body.mode || 'general'             
    };

    const backendResponse = await fetch(`${BACKEND_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await backendResponse.json();

    if (!backendResponse.ok) {
      throw new Error(data.error || 'Backend failed to respond');
    }

    return NextResponse.json({ reply: data.reply });

  } catch (error) {
    console.error('Frontend API Proxy Error:', error);
    return NextResponse.json(
      { error: 'There was an issue processing your request. Ensure the ResQHer backend is running.' },
      { status: 500 }
    );
  }
}