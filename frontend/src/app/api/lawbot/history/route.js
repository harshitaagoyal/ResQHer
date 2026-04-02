import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { auth } from '@clerk/nextjs/server';

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const client = await clientPromise;
    const db = client.db('SheBuilds');

    const chats = await db
      .collection('lawbotChats')
      .find({ userId })
      .project({ title: 1, updatedAt: 1 })
      .sort({ updatedAt: -1 })
      .toArray();

    // FIX: convert _id ObjectId to plain string so it works correctly in URLs
    const serialized = chats.map((c) => ({
      ...c,
      _id: c._id.toString(),
    }));

    return NextResponse.json({ chats: serialized });
  } catch (error) {
    console.error('Error fetching chats:', error);
    return NextResponse.json({ error: 'Failed to fetch history' }, { status: 500 });
  }
}