import { GoogleGenAI } from "@google/genai";
import { readFileSync } from "node:fs";

for (const line of readFileSync(".env.local", "utf8").split("\n")) {
  const match = line.match(/^GEMINI_API_KEY=(.+)$/);
  if (match) process.env.GEMINI_API_KEY = match[1];
}

const SLIDE_KEYS = [
  "cover",
  "agenda",
  "problem",
  "solution",
  "howItWorks",
  "features",
  "testimonials",
  "pricing",
  "team",
  "cta",
];

const topic = "sustainable farming";
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const response = await ai.models.generateContent({
  model: "gemini-2.5-flash",
  contents: `Write a 10-slide presentation about: ${topic}`,
  config: {
    systemInstruction:
      "Return JSON with exactly these top-level keys: cover, agenda, problem, solution, howItWorks, features, testimonials, pricing, team, cta. Each slide needs realistic content about sustainable farming. Preserve typical array lengths from a pitch deck.",
    temperature: 0.7,
    responseMimeType: "application/json",
  },
});

const raw = response.text;
if (!raw) {
  console.error("FAIL: empty response");
  process.exit(1);
}

const content = JSON.parse(raw);
const missing = SLIDE_KEYS.filter((key) => !(key in content));
if (missing.length > 0) {
  console.error("FAIL: missing slide keys:", missing.join(", "));
  process.exit(1);
}

console.log(`OK: all ${SLIDE_KEYS.length} slides present`);
console.log(`cover.title: ${content.cover?.title ?? "(none)"}`);
