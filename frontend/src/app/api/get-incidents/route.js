import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("SheBuilds");
    
    // Fetching from your original collection name "complains2"
    const incidents = await db
      .collection("complains2")
      .find({})
      .sort({ _id: -1 }) // Get newest first
      .toArray();

    return NextResponse.json(incidents);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to fetch incidents" }, { status: 500 });
  }
}