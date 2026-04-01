import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST(request) {
  try {
    // 1. Unpack the incoming FormData
    const formData = await request.formData();

    // 2. Extract and format the text fields
    const name = formData.get('name');
    const email = formData.get('email');
    const phone = formData.get('phone');
    const locationLat = parseFloat(formData.get('locationLat')) || 0;
    const locationLng = parseFloat(formData.get('locationLng')) || 0;
    const occurrenceDuration = formData.get('occurrenceDuration');
    const preferredContact = JSON.parse(formData.get('preferredContact') || '[]');
    const currentSituation = formData.get('currentSituation');
    const culprit = formData.get('culprit');
    const severity = formData.get('severity');
    const status = formData.get('status') || 'Pending';

    // (Note: To handle the image 'attachments', you would typically upload them 
    // to a service like Cloudinary or AWS S3 here and save their URLs to the DB. 
    // For this step, we are focusing on getting your core data to the dashboard!)

    // 3. Connect to MongoDB
    const client = await clientPromise;
    const db = client.db("SheBuilds"); // Matches your get-incidents database

    // 4. Construct the exact document structure your Admin Dashboard expects
    const newIncident = {
      name,
      email,
      phone,
      location: {
        lat: locationLat,
        lng: locationLng
      },
      occurrenceDuration,
      preferredContact,
      currentSituation,
      culprit,
      severity,
      status,
      createdAt: new Date(), // Good practice to timestamp reports!
    };

    // 5. Save it to the collection
    const result = await db.collection("complains2").insertOne(newIncident);

    // 6. Tell the frontend it was a success!
    return NextResponse.json(
      { success: true, message: "Report saved successfully!", id: result.insertedId },
      { status: 201 }
    );

  } catch (error) {
    console.error("Error saving report to MongoDB:", error);
    return NextResponse.json(
      { error: "Failed to save the report to the database." },
      { status: 500 }
    );
  }
}