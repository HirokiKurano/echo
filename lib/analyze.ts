import { OTHER_TOPIC } from "./topics";
import type { Analysis, Inquiry, TopicDefinition, TopicStat } from "./types";
import type { WorkspaceSettings } from "./workspace-types";

export function clusterInquiry(
  text: string,
  topics: TopicDefinition[],
): string {
  let best: { id: string; score: number; maxLen: number } | null = null;

  for (const topic of topics) {
    const hits = topic.keywords.filter((keyword) => keyword && text.includes(keyword));
    if (hits.length === 0) continue;

    const score = hits.length;
    const maxLen = Math.max(...hits.map((keyword) => keyword.length));
    if (
      !best ||
      score > best.score ||
      (score === best.score && maxLen > best.maxLen)
    ) {
      best = { id: topic.id, score, maxLen };
    }
  }

  return best?.id ?? OTHER_TOPIC.id;
}

function definitionFor(
  id: string,
  topics: TopicDefinition[],
): TopicDefinition {
  if (id === OTHER_TOPIC.id) return OTHER_TOPIC;
  return topics.find((topic) => topic.id === id) ?? OTHER_TOPIC;
}

function toHours(minutes: number): number {
  return minutes / 60;
}

export function inquiriesInPeriod(
  inquiries: Inquiry[],
  periodDays: number,
  now = new Date(),
): Inquiry[] {
  if (!periodDays || periodDays <= 0) return inquiries;
  const cut = now.getTime() - periodDays * 24 * 60 * 60 * 1000;
  return inquiries.filter((item) => new Date(item.createdAt).getTime() >= cut);
}

function toStat(
  definition: TopicDefinition,
  inquiries: Inquiry[],
  settings: WorkspaceSettings,
  yearFactor: number,
): TopicStat {
  const handleMinutes = inquiries.reduce(
    (sum, item) => sum + item.handleMinutes,
    0,
  );
  const hours = toHours(handleMinutes);
  const yen = hours * settings.hourlyYen;
  const annualHours = hours * yearFactor;
  const annualYen = yen * yearFactor;
  const isActionable = definition.id !== OTHER_TOPIC.id;

  return {
    id: definition.id,
    title: definition.title,
    category: definition.category,
    suggestedDoc: definition.suggestedDoc,
    count: inquiries.length,
    handleMinutes,
    hours,
    yen,
    annualHours,
    annualYen,
    saveableHours: isActionable
      ? annualHours * settings.deflectionRate
      : 0,
    saveableYen: isActionable ? annualYen * settings.deflectionRate : 0,
    inquiries: [...inquiries].sort((a, b) =>
      a.createdAt < b.createdAt ? 1 : -1,
    ),
  };
}

export function analyzeInquiries(
  inquiries: Inquiry[],
  topics: TopicDefinition[],
  settings: WorkspaceSettings,
): Analysis {
  const scoped = inquiriesInPeriod(inquiries, settings.periodDays);
  const grouped = new Map<string, Inquiry[]>();

  for (const inquiry of scoped) {
    const topicId = clusterInquiry(inquiry.text, topics);
    const bucket = grouped.get(topicId);
    if (bucket) bucket.push(inquiry);
    else grouped.set(topicId, [inquiry]);
  }

  const yearFactor =
    settings.periodDays > 0 ? 365 / settings.periodDays : 12;

  const stats = [...grouped.entries()]
    .map(([id, items]) =>
      toStat(definitionFor(id, topics), items, settings, yearFactor),
    )
    .sort((a, b) => b.count - a.count || b.hours - a.hours);

  const totalMinutes = scoped.reduce(
    (sum, item) => sum + item.handleMinutes,
    0,
  );
  const totalHours = toHours(totalMinutes);
  const totalYen = totalHours * settings.hourlyYen;
  const otherCount = grouped.get(OTHER_TOPIC.id)?.length ?? 0;
  const asOf = new Date(Date.now() + 9 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);

  return {
    periodLabel:
      settings.periodDays > 0
        ? `直近${settings.periodDays}日`
        : "全期間",
    asOf,
    totalCount: scoped.length,
    storedCount: inquiries.length,
    totalHours,
    totalYen,
    annualHours: totalHours * yearFactor,
    annualYen: totalYen * yearFactor,
    clusteredCount: scoped.length - otherCount,
    otherCount,
    periodDays: settings.periodDays,
    topics: stats,
    proposals: stats
      .filter((topic) => topic.id !== OTHER_TOPIC.id)
      .slice(0, 3),
  };
}
