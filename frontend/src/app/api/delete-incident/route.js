import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: "Missing ID" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("SheBuilds");

    const result = await db.collection("complains2").deleteOne({ 
      _id: new ObjectId(id) 
    });

    if (result.deletedCount === 1) {
      return NextResponse.json({ success: true, message: "Incident deleted successfully" });
    } else {
      return NextResponse.json({ error: "Incident not found" }, { status: 404 });
    }

  } catch (error) {
    console.error("Error deleting incident:", error);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}