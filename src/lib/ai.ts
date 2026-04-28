"use server";

import { generateObject } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { auth } from "@/lib/auth";
import { aiExtractSchema, type AiExtractResult } from "@/lib/validation";

export type ExtractResult =
  | { ok: true; data: AiExtractResult }
  | { ok: false; error: string };

const MAX_INPUT_CHARS = 12_000;

export async function extractFromJobDescription(
  text: string
): Promise<ExtractResult> {
  const session = await auth();
  if (!session?.user?.id) return { ok: false, error: "Not signed in" };

  if (!process.env.ANTHROPIC_API_KEY) {
    return {
      ok: false,
      error: "AI is not configured. Set ANTHROPIC_API_KEY in your environment.",
    };
  }

  const trimmed = text?.trim();
  if (!trimmed || trimmed.length < 30) {
    return {
      ok: false,
      error: "Please paste a job description with at least a few sentences.",
    };
  }
  const input = trimmed.slice(0, MAX_INPUT_CHARS);

  try {
    const { object } = await generateObject({
      model: anthropic("claude-sonnet-4-6"),
      schema: aiExtractSchema,
      system:
        "You extract structured fields from job postings. Be concise. " +
        "If a field is not clearly stated, omit it rather than guessing. " +
        "For 'notes', produce 3-5 short bullet points (each on its own line, " +
        "starting with '- ') summarising key responsibilities and required skills.",
      prompt: `Extract the fields from this job posting:\n\n${input}`,
    });
    return { ok: true, data: object };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "AI extraction failed";
    return { ok: false, error: msg };
  }
}
