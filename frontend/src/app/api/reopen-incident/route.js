import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function PATCH(req) {
  try {
    const { id } = await req.json();

    if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

    const client = await clientPromise;
    const db = client.db("SheBuilds");

    const result = await db.collection("complains2").updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          status: "Pending",
          reopenedAt: new Date() 
        } 
      }
    );

    if (result.modifiedCount === 1) {
      return NextResponse.json({ success: true, message: "Incident reopened" });
    }
    return NextResponse.json({ error: "Incident not found" }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to reopen" }, { status: 500 });
  }
}