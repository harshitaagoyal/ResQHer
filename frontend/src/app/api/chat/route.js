import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Point this to your newly running ResQHer Express backend
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export async function POST(req) {
  try {
    const body = await req.json();

    // 1. Extract the core variables
    const message = body.userInput || body.message;
    const history = body.history || [];
    const mode = body.mode || 'general';

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // ==========================================
    // PATH A: LAW BOT (Native Next.js + Gemini)
    // ==========================================
    if (mode === 'lawbot') {
      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
      
      const model = genAI.getGenerativeModel({ 
        model: 'gemini-2.5-flash',
        systemInstruction: `You are ResQHer Legal, an expert AI legal assistant. 
        Focus on women's rights, the Indian Penal Code (IPC), and domestic safety laws. 
        Provide clear, empathetic, and factual legal information. 
        Format your answers beautifully using Markdown (bullet points and bold text). 
        Always end with a brief disclaimer that this is legal information, not official legal counsel.`
      });

      const result = await model.generateContent(message);
      return NextResponse.json({ reply: result.response.text() });
    }

    // ==========================================
    // PATH B: EXISTING FEATURES (Proxy to Express)
    // ==========================================
    const payload = {
      message: message, 
      history: history,            
      mode: mode            
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