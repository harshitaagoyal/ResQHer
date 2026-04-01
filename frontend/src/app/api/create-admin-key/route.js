import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST(req) {
  try {
    const { owner } = await req.json();

    if (!owner) {
      return NextResponse.json({ error: "Owner name is required" }, { status: 400 });
    }

    const client = await clientPromise;
    // 🚨 IMPORTANT: Ensure this matches the database you used (SheBuilds)
    const db = client.db("SheBuilds"); 

    // Generate a secure, random 6-character code (e.g., "RESQ-A7B29F")
    const randomHex = Math.random().toString(36).substring(2, 8).toUpperCase();
    const newKey = `RESQ-${randomHex}`;

    // Save it directly to the admin_keys collection
    await db.collection("admin_keys").insertOne({
      key: newKey,
      owner: owner,
      active: true,
      createdAt: new Date()
    });

    return NextResponse.json({ success: true, key: newKey });

  } catch (error) {
    console.error("Error creating admin key:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}