import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST(req) {
  try {
    const { key } = await req.json();

    if (!key) {
      return NextResponse.json({ error: "Key is required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("SheBuilds");

    // Check if the typed key exists in a new collection called "admin_keys"
    const validKey = await db.collection("admin_keys").findOne({ key: key, active: true });

    if (validKey) {
      // Key found!
      return NextResponse.json({ success: true, message: "Key verified" });
    } else {
      // Key not found or inactive
      return NextResponse.json({ error: "Invalid or inactive key" }, { status: 401 });
    }

  } catch (error) {
    console.error("Error verifying admin key:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}