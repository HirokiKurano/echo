import type { Inquiry } from "./types";

const STORAGE_KEY = "echo.session.v1";

export type EchoSession = {
  version: 1;
  source: "demo" | "own";
  inquiries: Inquiry[];
};

export type EchoSnapshot = {
  app: "echo";
  version: 1;
  exportedAt: string;
  inquiries: Inquiry[];
};

function isInquiry(value: unknown): value is Inquiry {
  if (!value || typeof value !== "object") return false;
  const item = value as Inquiry;
  return (
    typeof item.id === "string" &&
    typeof item.channel === "string" &&
    typeof item.author === "string" &&
    typeof item.text === "string" &&
    typeof item.createdAt === "string" &&
    typeof item.handleMinutes === "number"
  );
}

export function loadSession(): EchoSession | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as EchoSession;
    if (parsed.version !== 1 || !Array.isArray(parsed.inquiries)) return null;
    if (parsed.source !== "demo" && parsed.source !== "own") return null;
    const inquiries = parsed.inquiries.filter(isInquiry);
    if (inquiries.length === 0) return null;
    return { version: 1, source: parsed.source, inquiries };
  } catch {
    return null;
  }
}

export function saveSession(
  session: Omit<EchoSession, "version"> | { source: "empty" },
): void {
  if (session.source === "empty") {
    localStorage.removeItem(STORAGE_KEY);
    return;
  }
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      version: 1,
      source: session.source,
      inquiries: session.inquiries,
    } satisfies EchoSession),
  );
}

export function parseSnapshot(raw: string): Inquiry[] | null {
  try {
    const parsed = JSON.parse(raw) as EchoSnapshot | { inquiries?: unknown };
    if (!Array.isArray(parsed.inquiries)) return null;
    const inquiries = parsed.inquiries.filter(isInquiry);
    return inquiries.length > 0 ? inquiries : null;
  } catch {
    return null;
  }
}

export function downloadSnapshot(inquiries: Inquiry[]): void {
  const snapshot: EchoSnapshot = {
    app: "echo",
    version: 1,
    exportedAt: new Date().toISOString(),
    inquiries,
  };
  const blob = new Blob([`${JSON.stringify(snapshot, null, 2)}\n`], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "echo-inquiries.json";
  link.click();
  URL.revokeObjectURL(url);
}
