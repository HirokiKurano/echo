import { localizedTopicField } from "./format";
import type { Locale } from "./messages";
import type { TopicDefinition } from "./types";

export type TopicSuggestion = {
  key: string;
  label: string;
  insert: string;
};

export function typingQuery(text: string): string {
  const line = text.split("\n").pop() ?? "";
  const token = line.split(/\s+/).pop() ?? "";
  return token.trim();
}

export function topicSuggestions(
  topics: TopicDefinition[],
  query: string,
  locale: Locale,
): TopicSuggestion[] {
  const needle = query.trim().toLowerCase();
  if (needle.length < 1) return [];

  const seen = new Set<string>();
  const hits: Array<TopicSuggestion & { rank: number }> = [];

  function add(key: string, label: string, insert: string, rank: number) {
    const id = insert.toLowerCase();
    if (!insert || seen.has(id)) return;
    seen.add(id);
    hits.push({ key, label, insert, rank });
  }

  for (const topic of topics) {
    const title = localizedTopicField(topic.id, "title", topic.title, locale);
    const titleLower = title.toLowerCase();
    if (titleLower.startsWith(needle)) add(`${topic.id}-title`, title, title, 0);
    else if (titleLower.includes(needle)) add(`${topic.id}-title`, title, title, 2);

    for (const keyword of topic.keywords) {
      const word = keyword.trim();
      if (word.length < 1) continue;
      const lower = word.toLowerCase();
      if (lower === "キーワード" || lower === "keyword") continue;
      if (lower.startsWith(needle)) {
        add(`${topic.id}-${word}`, title === word ? word : `${word} · ${title}`, word, 1);
      } else if (needle.startsWith(lower) || lower.includes(needle)) {
        add(`${topic.id}-${word}`, title === word ? word : `${word} · ${title}`, word, 3);
      }
    }
  }

  return hits
    .sort((a, b) => a.rank - b.rank || a.insert.length - b.insert.length)
    .slice(0, 8)
    .map(({ key, label, insert }) => ({ key, label, insert }));
}

export function applySuggestion(text: string, query: string, insert: string): string {
  if (!query) return insert;
  if (text.endsWith(query)) return `${text.slice(0, -query.length)}${insert}`;
  return `${text}${insert}`;
}
