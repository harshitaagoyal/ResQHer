import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { auth } from '@clerk/nextjs/server';

function toObjectId(id) {
  try {
    if (!id || !ObjectId.isValid(id)) return null;
    return new ObjectId(id);
  } catch {
    return null;
  }
}

export async function GET(req, props) {
  try {
    // 🚨 FIX: Await params before using them!
    const params = await props.params; 
    const id = params.id;

    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    const objectId = toObjectId(id);
    if (!objectId) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    
    const client = await clientPromise;
    const db = client.db('SheBuilds');
    
    const chat = await db.collection('lawbotChats').findOne({ _id: objectId, userId });
    
    if (!chat) return NextResponse.json({ error: 'Chat not found' }, { status: 404 });
    return NextResponse.json({ messages: chat.messages || [] });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function PATCH(req, props) {
  try {
    // 🚨 FIX: Await params
    const params = await props.params;
    const id = params.id;

    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    const objectId = toObjectId(id);
    if (!objectId) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    
    const { title } = await req.json();
    const client = await clientPromise;
    const db = client.db('SheBuilds');
    
    await db.collection('lawbotChats').updateOne(
      { _id: objectId, userId },
      { $set: { title, updatedAt: new Date() } }
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function DELETE(req, props) {
  try {
    // 🚨 FIX: Await params
    const params = await props.params;
    const id = params.id;

    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    const objectId = toObjectId(id);
    if (!objectId) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    
    const client = await clientPromise;
    const db = client.db('SheBuilds');
    
    await db.collection('lawbotChats').deleteOne({ _id: objectId, userId });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}