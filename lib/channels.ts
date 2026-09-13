import type { Inquiry } from "./types";
import type { Locale } from "./messages";

export const DEFAULT_CHANNELS = ["#社内", "#社外"] as const;

const CHANNEL_LABELS: Record<string, Record<Locale, string>> = {
  "#社内": { ja: "#社内", en: "#internal" },
  "#社外": { ja: "#社外", en: "#external" },
};

const CHANNEL_ALIASES: Record<string, string> = {
  "#社内": "#社内",
  "#社外": "#社外",
  "#internal": "#社内",
  "#internal-questions": "#社内",
  "#external": "#社外",
  "#external-questions": "#社外",
};

export function normalizeChannel(raw: string): string {
  const trimmed = raw.trim().replace(/^＃/, "#");
  if (!trimmed) return DEFAULT_CHANNELS[0];
  const withHash = trimmed.startsWith("#") ? trimmed : `#${trimmed}`;
  return (
    CHANNEL_ALIASES[withHash] ??
    CHANNEL_ALIASES[withHash.toLowerCase()] ??
    withHash
  );
}

export function channelLabel(id: string, locale: Locale): string {
  return CHANNEL_LABELS[normalizeChannel(id)]?.[locale] ?? id;
}

export function listChannels(inquiries: Inquiry[]): string[] {
  const names = new Set<string>();
  for (const item of inquiries) {
    const name = normalizeChannel(item.channel);
    if (name) names.add(name);
  }
  return [...names].sort((a, b) => a.localeCompare(b, "ja"));
}

export function listBoardChannels(inquiries: Inquiry[]): string[] {
  const seen = new Set<string>(DEFAULT_CHANNELS);
  const extra = listChannels(inquiries).filter((name) => !seen.has(name));
  extra.sort((a, b) => a.localeCompare(b, "ja"));
  return [...DEFAULT_CHANNELS, ...extra];
}
