import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { imagePrompt } = await req.json();
    const accessKey = process.env.UNSPLASH_ACCESS_KEY;

    const fetchImages = async (query) => {
      const res = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=3&orientation=squarish`,
        {
          headers: {
            Authorization: `Client-ID ${accessKey}`,
          },
        }
      );
      const data = await res.json();
      return data.results || [];
    };

    // First try with the user's prompt + context
    let results = await fetchImages(imagePrompt);

    // If no results, try just the user's prompt
    if (results.length === 0) {
      results = await fetchImages('nature scenery peaceful');
    }

    // If still no results, fall back to a default
    if (results.length === 0) {
      results = await fetchImages('sunrise morning light');
    }

    const imageUrls = results.map(photo => photo.urls.regular);

    return NextResponse.json({ images: imageUrls }, { status: 200 });

  } catch (error) {
    console.error('Image generation failed:', error);
    return NextResponse.json({ error: 'Failed to fetch images' }, { status: 500 });
  }
}