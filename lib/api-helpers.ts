import { isAuthorized } from "@/lib/auth";
import type { Inquiry } from "./types";

export async function requireAuth(): Promise<Response | null> {
  if (await isAuthorized()) return null;
  return Response.json({ error: "pin_required" }, { status: 401 });
}

export function asInquiry(raw: unknown, fallbackMinutes: number): Inquiry | null {
  if (!raw || typeof raw !== "object") return null;
  const value = raw as Partial<Inquiry>;
  const text = typeof value.text === "string" ? value.text.trim() : "";
  if (!text) return null;

  const minutes =
    typeof value.handleMinutes === "number" && value.handleMinutes > 0
      ? Math.min(value.handleMinutes, 480)
      : fallbackMinutes;

  return {
    id:
      typeof value.id === "string" && value.id
        ? value.id
        : crypto.randomUUID(),
    channel:
      typeof value.channel === "string" && value.channel.trim()
        ? value.channel.trim()
        : "#社内",
    author:
      typeof value.author === "string" && value.author.trim()
        ? value.author.trim()
        : "社員",
    text,
    createdAt:
      typeof value.createdAt === "string" && value.createdAt
        ? value.createdAt
        : new Date().toISOString(),
    responder:
      typeof value.responder === "string" && value.responder.trim()
        ? value.responder.trim()
        : null,
    handleMinutes: minutes,
  };
}
