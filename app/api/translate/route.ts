import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { text, targetLanguage, sourceLanguage = "en" } = body;

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }
    if (text.length > 500) {
      return NextResponse.json({ error: "Text too long" }, { status: 400 });
    }
    if (!targetLanguage) {
      return NextResponse.json({ error: "Target language is required" }, { status: 400 });
    }

    const langpair = `${sourceLanguage}|${targetLanguage}`;
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${langpair}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`MyMemory API returned status: ${response.status}`);
    }

    const data = await response.json();
    if (data.responseStatus !== 200) {
      throw new Error(data.responseDetails || "Translation failed");
    }

    return NextResponse.json({ translatedText: data.responseData.translatedText });
  } catch (error: any) {
    console.error("Translation API Error:", error);
    return NextResponse.json({ error: error.message || "Failed to translate" }, { status: 500 });
  }
}
