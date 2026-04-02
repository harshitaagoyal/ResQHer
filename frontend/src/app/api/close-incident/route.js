import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function PATCH(req) {
  try {
    // 🚨 CHANGED: Using formData instead of json to handle the image file
    const data = await req.formData();
    
    const id = data.get('id');
    const culpritName = data.get('culpritName');
    const culpritInfo = data.get('culpritInfo');
    const culpritCaughtAt = data.get('culpritCaughtAt'); // 🚨 NEW Field
    const pictureFile = data.get('culpritPicture');     // 🚨 NEW Field (File object)

    if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

    // 🚨 NEW: Convert Image File to Base64 String for MongoDB storage
    let base64Picture = null;
    if (pictureFile && pictureFile.size > 0) {
      const bytes = await pictureFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      base64Picture = `data:${pictureFile.type};base64,${buffer.toString('base64')}`;
    }

    const client = await clientPromise;
    const db = client.db("SheBuilds");

    // Update the document with new fields
    const result = await db.collection("complains2").updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          status: "Closed",
          finalCulpritName: culpritName,
          finalCulpritInfo: culpritInfo,
          finalCulpritCaughtAt: culpritCaughtAt ? new Date(culpritCaughtAt) : null, // 🚨 NEW
          finalCulpritPicture: base64Picture, // 🚨 NEW (Stored as Base64)
          closedAt: new Date()
        } 
      }
    );

    if (result.modifiedCount === 1) {
      return NextResponse.json({ 
        success: true, 
        message: "Incident closed successfully",
        finalCulpritPicture: base64Picture // Return it so frontend can update locally
      });
    } else {
      return NextResponse.json({ error: "Incident not found" }, { status: 404 });
    }

  } catch (error) {
    console.error("Error closing incident:", error);
    return NextResponse.json({ error: "Failed to close incident" }, { status: 500 });
  }
}