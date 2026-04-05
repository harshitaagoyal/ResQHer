import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { auth } from '@clerk/nextjs/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export async function POST(req) {
  try {
    const body = await req.json();

    const message = body.userInput || body.message;
    const history = body.history || [];
    const mode = body.mode || 'general';
    const chatId = body.chatId;

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    if (mode === 'lawbot') {
      const { userId } = await auth();
      if (!userId) {
        return NextResponse.json({ error: 'Unauthorized. Please log in.' }, { status: 401 });
      }

      const client = await clientPromise;
      const db = client.db('SheBuilds');
      const chatsCollection = db.collection('lawbotChats');

      let geminiHistory = [];
      let chatDoc = null;

      if (chatId) {
        try {
          chatDoc = await chatsCollection.findOne({
            _id: new ObjectId(chatId),
            userId,
          });
          if (chatDoc && chatDoc.messages) {
            geminiHistory = chatDoc.messages.map((msg) => ({
              role: msg.isUser ? 'user' : 'model',
              parts: [{ text: msg.text }],
            }));
          }
        } catch (err) {
          console.error('Invalid chatId or chat not found:', err);
        }
      }

      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({
        model: 'gemini-2.5-flash',
        systemInstruction: `You are ResQHer Legal, an expert AI legal assistant. 
        Focus on women's rights, the Indian Penal Code (IPC), and domestic safety laws. 
        Provide clear, empathetic, and factual legal information. 
        Format your answers beautifully using Markdown. 
        Always end with a brief disclaimer that this is legal information, not official legal counsel.`,
      });

      const chatSession = model.startChat({ history: geminiHistory });
      const result = await chatSession.sendMessage(message);
      const aiReply = result.response.text();

      const userMessageObj = { text: message, isUser: true, timestamp: new Date() };
      const aiMessageObj = { text: aiReply, isUser: false, timestamp: new Date() };

      if (chatId && chatDoc) {
        await chatsCollection.updateOne(
          { _id: new ObjectId(chatId) },
          {
            $push: { messages: { $each: [userMessageObj, aiMessageObj] } },
            $set: { updatedAt: new Date() },
          }
        );
        return NextResponse.json({ reply: aiReply });
      } else {
        // Create new chat
        const newTitle = message.substring(0, 30) + (message.length > 30 ? '...' : '');
        const newChat = {
          userId,
          title: newTitle,
          messages: [userMessageObj, aiMessageObj],
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        const insertResult = await chatsCollection.insertOne(newChat);

        return NextResponse.json({
          reply: aiReply,
          newChatId: insertResult.insertedId.toString(),
        });
      }
    }
    const payload = { message, history, mode };

    const backendResponse = await fetch(`${BACKEND_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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
      { error: 'There was an issue processing your request.' },
      { status: 500 }
    );
  }
}