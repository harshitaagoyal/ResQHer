// TODO: Add component logic
import { NextResponse } from 'next/server';
import { Jimp } from 'jimp';

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get('image');

    if (!file) {
      return NextResponse.json({ error: "No image provided for decomposition" }, { status: 400 });
    }

    // 1. Convert the file into a buffer Jimp can process
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const image = await Jimp.read(buffer);

    let binaryText = "";
    const { width, height } = image.bitmap;

    // 2. Loop through pixels to extract LSB from Red Channel
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const pixelColor = image.getPixelColor(x, y);
        
        // Extract Red channel (8 bits) from the 32-bit integer
        const r = (pixelColor >> 24) & 0xFF; 

        // Extract the Least Significant Bit (LSB)
        binaryText += (r & 1).toString();

        // 3. Check for the Haven Python End Marker: "1111111111111110"
        if (binaryText.length >= 16 && binaryText.endsWith("1111111111111110")) {
          const cleanBinary = binaryText.slice(0, -16);
          
          // 4. Convert binary chunks (8-bits) back to ASCII characters
          let decodedText = "";
          for (let i = 0; i < cleanBinary.length; i += 8) {
            const charCode = parseInt(cleanBinary.slice(i, i + 8), 2);
            decodedText += String.fromCharCode(charCode);
          }
          
          return NextResponse.json({ 
            success: true, 
            hiddenMessage: decodedText 
          });
        }
      }
    }

    return NextResponse.json({ error: "No hidden data found in this image" }, { status: 404 });
  } catch (error) {
    console.error("Decomposition Error:", error);
    return NextResponse.json({ error: "Failed to decompose image" }, { status: 500 });
  }
}