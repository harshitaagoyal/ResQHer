import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get('image');
    if (!file) {
      return NextResponse.json({ error: "No image provided for decomposition" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Parse PNG manually to extract pixel data
    // PNG signature is 8 bytes, then chunks follow
    // We'll use a simple approach - extract raw pixel bits from buffer
    let binaryText = "";
    
    // Skip PNG header and look for IDAT chunks with pixel data
    // Simple LSB extraction from buffer bytes
    for (let i = 8; i < buffer.length; i++) {
      binaryText += (buffer[i] & 1).toString();
      
      if (binaryText.length >= 16 && binaryText.endsWith("1111111111111110")) {
        const cleanBinary = binaryText.slice(0, -16);
        let decodedText = "";
        for (let j = 0; j < cleanBinary.length; j += 8) {
          const charCode = parseInt(cleanBinary.slice(j, j + 8), 2);
          decodedText += String.fromCharCode(charCode);
        }
        return NextResponse.json({
          success: true,
          hiddenMessage: decodedText
        });
      }
    }

    return NextResponse.json({ error: "No hidden data found in this image" }, { status: 404 });
  } catch (error) {
    console.error("Decomposition Error:", error);
    return NextResponse.json({ error: "Failed to decompose image" }, { status: 500 });
  }
}