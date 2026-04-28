import { z } from "zod";

export const STATUSES = [
  "WISHLIST",
  "APPLIED",
  "INTERVIEWING",
  "OFFER",
  "REJECTED",
] as const;

export const STATUS_LABELS: Record<(typeof STATUSES)[number], string> = {
  WISHLIST: "Wishlist",
  APPLIED: "Applied",
  INTERVIEWING: "Interviewing",
  OFFER: "Offer",
  REJECTED: "Rejected",
};

export const STATUS_COLORS: Record<(typeof STATUSES)[number], string> = {
  WISHLIST: "bg-slate-100 text-slate-700 border-slate-200",
  APPLIED: "bg-blue-100 text-blue-700 border-blue-200",
  INTERVIEWING: "bg-amber-100 text-amber-800 border-amber-200",
  OFFER: "bg-emerald-100 text-emerald-700 border-emerald-200",
  REJECTED: "bg-rose-100 text-rose-700 border-rose-200",
};

export const applicationSchema = z.object({
  company: z
    .string()
    .trim()
    .min(1, "Company is required")
    .max(120, "Too long"),
  role: z.string().trim().min(1, "Role is required").max(160, "Too long"),
  status: z.enum(STATUSES),
  jobUrl: z
    .string()
    .trim()
    .url("Must be a valid URL")
    .max(500)
    .optional()
    .or(z.literal("").transform(() => undefined)),
  location: z.string().trim().max(120).optional().or(z.literal("").transform(() => undefined)),
  salary: z.string().trim().max(80).optional().or(z.literal("").transform(() => undefined)),
  notes: z.string().trim().max(5000).optional().or(z.literal("").transform(() => undefined)),
});

export type ApplicationInput = z.infer<typeof applicationSchema>;

export const aiExtractSchema = z.object({
  company: z.string().describe("Company / employer name"),
  role: z.string().describe("Job title or role"),
  location: z.string().optional().describe("Location, city, or 'Remote'"),
  salary: z.string().optional().describe("Salary range if explicitly mentioned"),
  notes: z
    .string()
    .optional()
    .describe("3-5 bullet summary of key responsibilities and required skills"),
});

export type AiExtractResult = z.infer<typeof aiExtractSchema>;
