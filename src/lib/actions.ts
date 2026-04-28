"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import {
  applicationSchema,
  type ApplicationInput,
  STATUSES,
} from "@/lib/validation";

export type ActionResult<T = void> =
  | { ok: true; data?: T }
  | { ok: false; error: string };

async function requireUserId(): Promise<string> {
  const session = await auth();
  if (!session?.user?.id) throw new Error("UNAUTHORIZED");
  return session.user.id;
}

export async function createApplication(
  input: ApplicationInput
): Promise<ActionResult<{ id: string }>> {
  let id: string;
  try {
    const userId = await requireUserId();
    const parsed = applicationSchema.safeParse(input);
    if (!parsed.success) {
      const first = parsed.error.issues[0];
      return { ok: false, error: first?.message ?? "Invalid input" };
    }
    const created = await prisma.application.create({
      data: { ...parsed.data, userId },
      select: { id: true },
    });
    id = created.id;
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to create";
    return { ok: false, error: msg === "UNAUTHORIZED" ? "Not signed in" : msg };
  }
  revalidatePath("/dashboard");
  redirect(`/applications/${id}`);
}

export async function updateApplication(
  id: string,
  input: ApplicationInput
): Promise<ActionResult> {
  try {
    const userId = await requireUserId();
    const parsed = applicationSchema.safeParse(input);
    if (!parsed.success) {
      const first = parsed.error.issues[0];
      return { ok: false, error: first?.message ?? "Invalid input" };
    }
    const result = await prisma.application.updateMany({
      where: { id, userId },
      data: parsed.data,
    });
    if (result.count === 0) {
      return { ok: false, error: "Not found" };
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to update";
    return { ok: false, error: msg === "UNAUTHORIZED" ? "Not signed in" : msg };
  }
  revalidatePath("/dashboard");
  revalidatePath(`/applications/${id}`);
  return { ok: true };
}

export async function deleteApplication(
  id: string
): Promise<ActionResult> {
  try {
    const userId = await requireUserId();
    const result = await prisma.application.deleteMany({
      where: { id, userId },
    });
    if (result.count === 0) {
      return { ok: false, error: "Not found" };
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to delete";
    return { ok: false, error: msg === "UNAUTHORIZED" ? "Not signed in" : msg };
  }
  revalidatePath("/dashboard");
  return { ok: true };
}

export async function updateApplicationStatus(
  id: string,
  status: (typeof STATUSES)[number]
): Promise<ActionResult> {
  if (!STATUSES.includes(status)) {
    return { ok: false, error: "Invalid status" };
  }
  try {
    const userId = await requireUserId();
    const result = await prisma.application.updateMany({
      where: { id, userId },
      data: { status },
    });
    if (result.count === 0) return { ok: false, error: "Not found" };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to update";
    return { ok: false, error: msg === "UNAUTHORIZED" ? "Not signed in" : msg };
  }
  revalidatePath("/dashboard");
  return { ok: true };
}
