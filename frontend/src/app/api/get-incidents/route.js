import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("SheBuilds");
    
    const incidents = await db
      .collection("complains2")
      .find({})
      .sort({ _id: -1 })
      .toArray();

    return NextResponse.json(incidents);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to fetch incidents" }, { status: 500 });
  }
}