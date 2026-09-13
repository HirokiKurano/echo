import { ASSUMPTIONS } from "./assumptions";
import type { Inquiry } from "./types";

const HEADER = /^(本文|問い合わせ|text|message|内容)([,	|]|$)/i;
const PREFIX = /^(?:(#[^\s]+)\s+)?(?:([^:：\n]{1,24})[:：]\s+)?(.+)$/;

export type PasteParseResult = {
  inquiries: Inquiry[];
  skipped: number;
};

function todayStamp(now: Date, offsetMinutes: number): string {
  const date = new Date(now.getTime() - offsetMinutes * 60_000);
  return date.toISOString();
}

function parseMinutes(value: string | undefined): number {
  if (!value) return ASSUMPTIONS.defaultHandleMinutes;
  const digits = value.replace(/[^\d.]/g, "");
  const parsed = Number(digits);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return ASSUMPTIONS.defaultHandleMinutes;
  }
  return Math.min(parsed, 240);
}

function fromFields(
  text: string,
  extras: {
    channel?: string;
    author?: string;
    minutes?: string;
    index: number;
    now: Date;
  },
): Inquiry | null {
  const cleaned = text.trim();
  if (!cleaned) return null;

  return {
    id: `paste-${extras.index}-${cleaned.slice(0, 12)}`,
    channel: extras.channel?.trim() || "#paste",
    author: extras.author?.trim() || "貼り付け",
    text: cleaned,
    createdAt: todayStamp(extras.now, extras.index),
    responder: null,
    handleMinutes: parseMinutes(extras.minutes),
  };
}

function parseDelimited(line: string): Inquiry | null {
  const cells = line.includes("\t")
    ? line.split("\t")
    : line.includes("|")
      ? line.split("|")
      : line.split(",");
  if (cells.length < 2) return null;

  const trimmed = cells.map((cell) => cell.trim().replace(/^"|"$/g, ""));
  const text =
    trimmed.find((cell) => cell.length > 8) ?? trimmed[trimmed.length - 1];
  const channel = trimmed.find((cell) => cell.startsWith("#"));
  const minutes = trimmed.find((cell) => /^\d{1,3}$/.test(cell));
  const author = trimmed.find(
    (cell) =>
      cell !== text &&
      cell !== channel &&
      cell !== minutes &&
      cell.length > 0 &&
      cell.length <= 24,
  );

  return fromFields(text, {
    channel,
    author,
    minutes,
    index: 0,
    now: new Date(),
  });
}

export function parsePastedInquiries(
  raw: string,
  now = new Date(),
): PasteParseResult {
  const lines = raw.replace(/\r\n/g, "\n").split("\n");
  const inquiries: Inquiry[] = [];
  let skipped = 0;

  for (const [index, line] of lines.entries()) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    if (index === 0 && HEADER.test(trimmed)) {
      skipped += 1;
      continue;
    }

    let inquiry: Inquiry | null = null;
    if (/[,|\t]/.test(trimmed) && trimmed.split(/[,|\t]/).length >= 2) {
      inquiry = parseDelimited(trimmed);
    }

    const match = trimmed.match(PREFIX);
    if (!inquiry) {
      inquiry = fromFields(match?.[3] ?? trimmed, {
        channel: match?.[1],
        author: match?.[2],
        index,
        now,
      });
    } else {
      inquiry = {
        ...inquiry,
        id: `paste-${index}-${inquiry.text.slice(0, 12)}`,
        createdAt: todayStamp(now, index),
      };
    }

    if (!inquiry) {
      skipped += 1;
      continue;
    }
    inquiries.push(inquiry);
  }

  return { inquiries, skipped };
}
