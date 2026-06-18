import { initialContent } from "@/lib/initialContent";
import OpenAI from "openai";

export type AiProvider = "openai" | "gemini";

const DEFAULT_OPENAI_MODEL = "gpt-3.5-turbo-16k";
const DEFAULT_GEMINI_MODEL = "gemini-2.5-flash";

export function buildSystemPrompt(): string {
  return `You are a presentation writer. Given a topic, produce slide deck content as JSON.

Return ONLY valid JSON matching this exact shape (same keys, nested structure, and array lengths). Replace placeholder text with real, specific content about the user's topic. Keep strings concise and presentation-ready.

Required JSON shape:
${JSON.stringify(initialContent, null, 2)}

Rules:
- Return ONLY the JSON object, no markdown fences or commentary
- Keep all top-level keys: cover, agenda, problem, solution, howItWorks, features, testimonials, pricing, team, cta
- Preserve array lengths (e.g. 3 solution cards, 3 steps, 6 features, 2 testimonials, 3 pricing plans, 4 team members)
- Use realistic but fictional names for testimonials and team unless the topic implies real entities
- Cover date should be a plausible month and year string`;
}

export function resolveAiProvider(): AiProvider | null {
  const explicit = process.env.AI_PROVIDER?.trim().toLowerCase();
  if (explicit === "gemini" || explicit === "openai") {
    return explicit;
  }
  if (process.env.GEMINI_API_KEY?.trim()) {
    return "gemini";
  }
  if (process.env.OPENAI_API_KEY?.trim()) {
    return "openai";
  }
  return null;
}

function getOpenAiModel() {
  return process.env.OPENAI_MODEL?.trim() || DEFAULT_OPENAI_MODEL;
}

function getGeminiModel() {
  return process.env.GEMINI_MODEL?.trim() || DEFAULT_GEMINI_MODEL;
}

export function aiConfigError(provider: AiProvider | null): string | null {
  if (!provider) {
    return "No AI provider configured. Set GEMINI_API_KEY or OPENAI_API_KEY.";
  }
  if (provider === "gemini" && !process.env.GEMINI_API_KEY?.trim()) {
    return "Gemini API key is not configured. Set GEMINI_API_KEY.";
  }
  if (provider === "openai" && !process.env.OPENAI_API_KEY?.trim()) {
    return "OpenAI API key is not configured. Set OPENAI_API_KEY.";
  }
  return null;
}

export function aiErrorMessage(provider: AiProvider, error: unknown): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    "message" in error &&
    typeof (error as { message: unknown }).message === "string"
  ) {
    const status = (error as { status: number }).status;
    const message = (error as { message: string }).message;

    if (provider === "openai") {
      if (status === 401) {
        return "Invalid OpenAI API key. Check OPENAI_API_KEY in your environment.";
      }
      if (status === 403) {
        return `Your OpenAI project cannot use model "${getOpenAiModel()}". Set OPENAI_MODEL to an allowed model.`;
      }
      if (status === 429) {
        return "OpenAI quota exceeded. Add billing at platform.openai.com or set AI_PROVIDER=gemini with GEMINI_API_KEY.";
      }
    }

    if (provider === "gemini") {
      if (status === 400 || status === 401 || status === 403) {
        return "Invalid Gemini API key. Get one at aistudio.google.com/apikey and set GEMINI_API_KEY.";
      }
      if (status === 429) {
        return "Gemini quota exceeded. Try again later or switch AI_PROVIDER=openai.";
      }
    }

    return message;
  }

  return "Failed to generate presentation";
}

async function generateWithOpenAi(topic: string): Promise<string> {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const completion = await openai.chat.completions.create({
    model: getOpenAiModel(),
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: buildSystemPrompt() },
      {
        role: "user",
        content: `Write a 10-slide presentation about: ${topic}`,
      },
    ],
    temperature: 0.7,
  });

  const raw = completion.choices[0]?.message?.content;
  if (!raw) {
    throw { status: 502, message: "Empty response from OpenAI" };
  }
  return raw;
}

async function generateWithGemini(topic: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  const model = getGeminiModel();
  const systemPrompt = buildSystemPrompt();

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: systemPrompt }],
        },
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `Write a 10-slide presentation about: ${topic}`,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          responseMimeType: "application/json",
        },
      }),
    }
  );

  const data = (await response.json()) as {
    error?: { message?: string; code?: number; status?: string };
    candidates?: Array<{
      content?: { parts?: Array<{ text?: string }> };
    }>;
  };

  if (!response.ok) {
    throw {
      status: response.status,
      message:
        data.error?.message ??
        `Gemini request failed (${response.status})`,
    };
  }

  const raw = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!raw) {
    throw { status: 502, message: "Empty response from Gemini" };
  }
  return raw;
}

export async function generatePresentationJson(
  provider: AiProvider,
  topic: string
): Promise<string> {
  if (provider === "gemini") {
    return generateWithGemini(topic);
  }
  return generateWithOpenAi(topic);
}
