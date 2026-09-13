import type { Locale } from "./messages";
import { TOPIC_LABELS } from "./messages";

export function localeTag(locale: Locale): string {
  return locale === "en" ? "en-US" : "ja-JP";
}

export function formatYen(value: number, locale: Locale = "ja"): string {
  return `¥${Math.round(value).toLocaleString(localeTag(locale))}`;
}

export function formatNumber(value: number, locale: Locale = "ja"): string {
  return value.toLocaleString(localeTag(locale));
}

export function formatHoursValue(value: number, locale: Locale = "ja"): string {
  const rounded = Math.round(value * 10) / 10;
  return rounded.toLocaleString(localeTag(locale));
}

export function formatPercent(value: number): string {
  return `${Math.round(value * 100)}%`;
}

export function formatTimestamp(iso: string): string {
  const date = new Date(iso);
  const jst = new Date(date.getTime() + 9 * 60 * 60 * 1000);
  const month = String(jst.getUTCMonth() + 1).padStart(2, "0");
  const day = String(jst.getUTCDate()).padStart(2, "0");
  const hour = String(jst.getUTCHours()).padStart(2, "0");
  const minute = String(jst.getUTCMinutes()).padStart(2, "0");
  return `${month}/${day} ${hour}:${minute}`;
}

export function localizedTopicField(
  id: string,
  field: "title" | "category" | "doc",
  stored: string,
  locale: Locale,
): string {
  const labels = TOPIC_LABELS[id];
  if (!labels) return stored;
  const mapped = field === "doc" ? labels.doc : labels[field];
  const text = mapped[locale];
  return text || stored;
}
