import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req) {
  try {
    const body = await req.json();
    const { contacts, latitude, longitude, userName } = body;

    console.log("🚨 Alert triggered for:", userName);
    console.log("📍 Location:", latitude, longitude);

    // 1. Setup Transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // 2. Verify connection (Very Important!)
    try {
      await transporter.verify();
      console.log("Server is ready to take our messages");
    } catch (err) {
      console.error("Transporter Verify Error:", err);
      return NextResponse.json({ error: "Auth failed", details: err.message }, { status: 500 });
    }

    const locationLink = `https://www.google.com/maps?q=${latitude},${longitude}`;
    const emailList = contacts.map(c => c.email).filter(Boolean).join(', ');

    if (!emailList) {
      return NextResponse.json({ error: "No emails found" }, { status: 400 });
    }

    // 3. Send Mail (Use AWAIT here)
    const info = await transporter.sendMail({
      from: `"ResQHer Safety" <${process.env.EMAIL_USER}>`,
      to: emailList,
      subject: `🚨 EMERGENCY ALERT: ${userName}`,
      html: `
        <div style="padding: 20px; border: 3px solid red;">
          <h1 style="color: red;">Emergency SOS</h1>
          <p><strong>${userName}</strong> is in danger and needs help.</p>
          <a href="${locationLink}" style="background: red; color: white; padding: 10px; text-decoration: none;">View Live Location</a>
        </div>
      `,
    });

    console.log("Message sent: %s", info.messageId);
    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error) {
    console.error("Final Catch Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}