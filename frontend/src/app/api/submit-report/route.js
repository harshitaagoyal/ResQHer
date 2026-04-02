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

    // Safely parse the contact array
    let preferredContact = [];
    try {
      const rawContact = formData.get('preferredContact');
      if (rawContact) preferredContact = JSON.parse(rawContact);
    } catch (e) {
      console.log("Failed to parse preferredContact");
    }

    // 🚨 UPGRADED: BULLETPROOF FILE EXTRACTOR 🚨
    const attachmentsData = [];
    
    // We loop through EVERY item in the formData manually
    for (const [key, value] of formData.entries()) {
      
      // If it's named 'attachments' and it's a file (has an arrayBuffer function)
      if (key === 'attachments' && value && typeof value === 'object' && typeof value.arrayBuffer === 'function') {
        try {
          const bytes = await value.arrayBuffer();
          
          // Make sure the file actually contains data
          if (bytes.byteLength > 0) {
            const buffer = Buffer.from(bytes);
            const base64String = buffer.toString('base64');
            const mimeType = value.type || 'image/jpeg';
            
            attachmentsData.push({
              name: value.name || 'evidence-file',
              // This is the magic string that lets the browser render the image
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
      attachments: attachmentsData, // 🚨 Now safely contains your encoded images!
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