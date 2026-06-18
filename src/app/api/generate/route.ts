import { parseGeneratedContent } from "@/lib/generate/validateContent";
import {
  aiConfigError,
  aiErrorMessage,
  generatePresentationJson,
  resolveAiProvider,
} from "@/lib/generate/aiProvider";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const provider = resolveAiProvider();
  const configError = aiConfigError(provider);
  if (configError || !provider) {
    return NextResponse.json({ error: configError }, { status: 500 });
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

  try {
    const raw = await generatePresentationJson(provider, topic);
    const content = parseGeneratedContent(raw);
    if (!content) {
      return NextResponse.json(
        { error: "AI response did not match expected shape" },
        { status: 502 }
      );
    }

    return NextResponse.json(content);
  } catch (error) {
    console.error(`${provider} generation failed:`, error);
    return NextResponse.json(
      { error: aiErrorMessage(provider, error) },
      { status: 502 }
    );
  }
}
