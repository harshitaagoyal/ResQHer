import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function PATCH(req) {
  try {
    const body = await req.json();
    const { id, finalCulpritName, finalCulpritInfo } = body;

    if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

    const client = await clientPromise;
    const db = client.db("SheBuilds");

    // Update the document with new final culprit details
    const result = await db.collection("complains2").updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          finalCulpritName: finalCulpritName,
          finalCulpritInfo: finalCulpritInfo,
          lastEditedCulpritAt: new Date() // Tracks when details were updated
        } 
      }
    );

    if (result.matchedCount === 0) {
        return NextResponse.json({ error: "Incident not found" }, { status: 404 });
    }

    // Success response, even if no fields were actually changed
    return NextResponse.json({ success: true, message: "Culprit details updated securely" });

  } catch (error) {
    console.error("Error updating culprit details:", error);
    return NextResponse.json({ error: "Failed to update details" }, { status: 500 });
  }
}