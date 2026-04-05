import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function PATCH(req) {
  try {
    const data = await req.formData();
    
    const id = data.get('id');
    const culpritName = data.get('culpritName');
    const culpritInfo = data.get('culpritInfo');
    const culpritCaughtAt = data.get('culpritCaughtAt'); 
    const pictureFile = data.get('culpritPicture');    

    if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

    let base64Picture = null;
    if (pictureFile && pictureFile.size > 0) {
      const bytes = await pictureFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      base64Picture = `data:${pictureFile.type};base64,${buffer.toString('base64')}`;
    }

    const client = await clientPromise;
    const db = client.db("SheBuilds");

    const result = await db.collection("complains2").updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          status: "Closed",
          finalCulpritName: culpritName,
          finalCulpritInfo: culpritInfo,
          finalCulpritCaughtAt: culpritCaughtAt ? new Date(culpritCaughtAt) : null, 
          finalCulpritPicture: base64Picture,
          closedAt: new Date()
        } 
      }
    );

    if (result.modifiedCount === 1) {
      return NextResponse.json({ 
        success: true, 
        message: "Incident closed successfully",
        finalCulpritPicture: base64Picture 
      });
    } else {
      return NextResponse.json({ error: "Incident not found" }, { status: 404 });
    }

  } catch (error) {
    console.error("Error closing incident:", error);
    return NextResponse.json({ error: "Failed to close incident" }, { status: 500 });
  }
}