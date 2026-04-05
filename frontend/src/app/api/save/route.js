import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST(req) {
  try {
    const data = await req.json();
    const client = await clientPromise;
    const db = client.db("SheBuilds");
    const document = {
      name: data.name || "Anonymous",
      location: data.location || "Unknown",
      phone: data.phone || "",
      email: data.email || "", 
      
      preferredContact: data.preferredContact || [], 
      frequency: data.frequency || "Not specified",
      occurrenceDuration: data.occurrenceDuration || "",
      currentSituation: data.currentSituation || "", 
      ai_summary: data.current_situation || "",
      culprit: data.culprit || "",
      
      severity: data.severity || "High",
      status: "Pending",
      createdAt: new Date(),
    };

    const result = await db.collection("complains2").insertOne(document);

    return NextResponse.json({ 
      success: true, 
      message: "Report securely submitted",
      id: result.insertedId 
    });

  } catch (error) {
    console.error("Error saving report to database:", error);
    return NextResponse.json({ error: "Failed to save report" }, { status: 500 });
  }
}