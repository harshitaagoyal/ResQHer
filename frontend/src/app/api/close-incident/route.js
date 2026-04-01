import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function PATCH(req) {
  try {
    const body = await req.json();
    const { id, culpritName, culpritInfo } = body;

    if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

    const client = await clientPromise;
    const db = client.db("SheBuilds");

    // Update the document to be "Closed" and store the final culprit details
    const result = await db.collection("complains2").updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          status: "Closed",
          finalCulpritName: culpritName,
          finalCulpritInfo: culpritInfo,
          closedAt: new Date()
        } 
      }
    );

    if (result.modifiedCount === 1) {
      return NextResponse.json({ success: true, message: "Incident closed successfully" });
    } else {
      return NextResponse.json({ error: "Incident not found" }, { status: 404 });
    }

  } catch (error) {
    console.error("Error closing incident:", error);
    return NextResponse.json({ error: "Failed to close incident" }, { status: 500 });
  }
}