import { agent, tool } from "@21st-sdk/agent";
import { z } from "zod";

export default agent({
  model: "claude-sonnet-4-6",
  systemPrompt: `You are a presentation assistant for Presentation Builder.
Help users plan slide decks, refine slide copy, suggest structure, and brainstorm topics.
Keep answers concise and presentation-ready. When suggesting slide content, use clear headings and bullet points.`,
  tools: {
    add: tool({
      description: "Add two numbers",
      inputSchema: z.object({ a: z.number(), b: z.number() }),
      execute: async ({ a, b }) => ({
        content: [{ type: "text", text: `${a + b}` }],
      }),
    }),
  },
});
