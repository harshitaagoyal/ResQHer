import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST(request) {
  try {
    const formData = await request.formData();

    const name = formData.get('name');
    const email = formData.get('email');
    const phone = formData.get('phone');
    const locationLat = parseFloat(formData.get('locationLat')) || 0;
    const locationLng = parseFloat(formData.get('locationLng')) || 0;
    const occurrenceDuration = formData.get('occurrenceDuration');
    const currentSituation = formData.get('currentSituation');
    const culprit = formData.get('culprit');
    const severity = formData.get('severity');
    const status = formData.get('status') || 'Pending';

    let preferredContact = [];
    try {
      const rawContact = formData.get('preferredContact');
      if (rawContact) preferredContact = JSON.parse(rawContact);
    } catch (e) {
      console.log("Failed to parse preferredContact");
    }

    const attachmentsData = [];
    
    for (const [key, value] of formData.entries()) {
      
      if (key === 'attachments' && value && typeof value === 'object' && typeof value.arrayBuffer === 'function') {
        try {
          const bytes = await value.arrayBuffer();
          if (bytes.byteLength > 0) {
            const buffer = Buffer.from(bytes);
            const base64String = buffer.toString('base64');
            const mimeType = value.type || 'image/jpeg';
            
            attachmentsData.push({
              name: value.name || 'evidence-file',
              url: `data:${mimeType};base64,${base64String}` 
            });
          }
        } catch (fileErr) {
          console.error("Error processing an individual file:", fileErr);
        }
      }
    }

    const client = await clientPromise;
    const db = client.db("SheBuilds");

    const newIncident = {
      name,
      email,
      phone,
      location: { lat: locationLat, lng: locationLng },
      occurrenceDuration,
      preferredContact,
      currentSituation,
      culprit,
      severity,
      status,
      attachments: attachmentsData, 
      createdAt: new Date(),
    };

    const result = await db.collection("complains2").insertOne(newIncident);

    return NextResponse.json(
      { success: true, message: "Report saved!", id: result.insertedId },
      { status: 201 }
    );

  } catch (error) {
    console.error("BACKEND CRASH:", error);
    return NextResponse.json(
      { error: "Server crashed", details: error.message },
      { status: 500 }
    );
  }
}