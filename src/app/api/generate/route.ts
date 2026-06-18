import { initialContent } from "@/lib/initialContent";
import { parseGeneratedContent } from "@/lib/generate/validateContent";
import { createClient } from "@/lib/supabase/server";
import OpenAI from "openai";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const DEFAULT_MODEL = "gpt-3.5-turbo-16k";

function getOpenAiModel() {
  return process.env.OPENAI_MODEL?.trim() || DEFAULT_MODEL;
}

function openAiErrorMessage(error: unknown): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    "message" in error &&
    typeof (error as { message: unknown }).message === "string"
  ) {
    const status = (error as { status: number }).status;
    const message = (error as { message: string }).message;

    if (status === 401) {
      return "Invalid OpenAI API key. Check OPENAI_API_KEY in your environment.";
    }
    if (status === 403) {
      return `Your OpenAI project cannot use model "${getOpenAiModel()}". Set OPENAI_MODEL to an allowed model (e.g. gpt-3.5-turbo-16k or gpt-5).`;
    }
    if (status === 429) {
      return "OpenAI quota exceeded. Add billing or credits at platform.openai.com.";
    }

    return message;
  }

  return "Failed to generate presentation";
}

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

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "OpenAI API key is not configured" },
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

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  try {
    const completion = await openai.chat.completions.create({
      model: getOpenAiModel(),
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: `Write a 10-slide presentation about: ${topic}`,
        },
      ],
      temperature: 0.7,
    });

    const raw = completion.choices[0]?.message?.content;
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
    console.error("OpenAI generation failed:", error);
    return NextResponse.json(
      { error: openAiErrorMessage(error) },
      { status: 502 }
    );
  }
}
