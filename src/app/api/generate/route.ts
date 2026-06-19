import { initialContent } from "@/lib/initialContent";
import { parseGeneratedContent } from "@/lib/generate/validateContent";
import { createClient } from "@/lib/supabase/server";
import { ApiError, GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const GEMINI_MODEL = "gemini-2.5-flash";

const SYSTEM_PROMPT = `You are a presentation writer. Given a topic, produce slide deck content as JSON.

Return ONLY valid JSON matching this exact shape (same keys, nested structure, and array lengths). Replace placeholder text with real, specific content about the user's topic. Keep strings concise and presentation-ready.

Required JSON shape:
${JSON.stringify(initialContent, null, 2)}

Rules:
- Return ONLY the JSON object, no markdown fences or commentary
- Keep all top-level keys: cover, agenda, problem, solution, howItWorks, features, testimonials, pricing, team, cta
- Preserve array lengths (e.g. 3 solution cards, 3 steps, 6 features, 2 testimonials, 3 pricing plans, 4 team members)
- Use realistic but fictional names for testimonials and team unless the topic implies real entities
- Cover date should be a plausible month and year string`;

function geminiErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.status === 401 || error.status === 403) {
      return "Invalid Gemini API key. Get one at aistudio.google.com/apikey and set GEMINI_API_KEY.";
    }
    if (error.status === 429) {
      return "Gemini quota exceeded. Try again later.";
    }
    return error.message;
  }

  return "Failed to generate presentation";
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json(
      { error: "Gemini API key is not configured" },
      { status: 500 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const topic =
    typeof body === "object" &&
    body !== null &&
    "topic" in body &&
    typeof (body as { topic: unknown }).topic === "string"
      ? (body as { topic: string }).topic.trim()
      : "";

  if (!topic) {
    return NextResponse.json({ error: "Topic is required" }, { status: 400 });
  }

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  try {
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: `Write a 10-slide presentation about: ${topic}`,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.7,
        responseMimeType: "application/json",
      },
    });

    const raw = response.text;
    if (!raw) {
      return NextResponse.json(
        { error: "Empty response from AI" },
        { status: 502 }
      );
    }

    const content = parseGeneratedContent(raw);
    if (!content) {
      return NextResponse.json(
        { error: "AI response did not match expected shape" },
        { status: 502 }
      );
    }

    return NextResponse.json(content);
  } catch (error) {
    console.error("Gemini generation failed:", error);
    return NextResponse.json(
      { error: geminiErrorMessage(error) },
      { status: 502 }
    );
  }
}
