"use client";

import {
  formatHoursValue,
  formatYen,
  localizedTopicField,
} from "@/lib/format";
import type { TopicStat } from "@/lib/types";
import { useLocale } from "./LocaleProvider";

export function RankingTable({
  topics,
  selectedId,
  onSelect,
}: {
  topics: TopicStat[];
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  const { locale, t } = useLocale();

  return (
    <div className="overflow-hidden rounded-2xl border border-line">
      <div className="grid grid-cols-[minmax(0,1.6fr)_4.5rem_5.5rem_6.5rem] gap-2 bg-surface px-4 py-3 text-xs text-muted">
        <span>{t("colInquiry")}</span>
        <span>{t("colCount")}</span>
        <span>{t("colTime")}</span>
        <span>{t("colLoss")}</span>
      </div>
      <ul>
        {topics.map((topic) => {
          const selected = topic.id === selectedId;
          return (
            <li key={topic.id} className="border-t border-line">
              <button
                type="button"
                onClick={() => onSelect(topic.id)}
                className={`grid w-full grid-cols-[minmax(0,1.6fr)_4.5rem_5.5rem_6.5rem] items-center gap-2 px-4 py-3 text-left text-sm transition ${
                  selected ? "bg-accent-soft" : "hover:bg-foreground/5"
                }`}
              >
                <span className="min-w-0">
                  <span className="block truncate font-medium">
                    {localizedTopicField(topic.id, "title", topic.title, locale)}
                  </span>
                  <span className="block truncate text-xs text-muted">
                    {localizedTopicField(
                      topic.id,
                      "category",
                      topic.category,
                      locale,
                    )}
                  </span>
                </span>
                <span>{topic.count}</span>
                <span>
                  {t("hours", { n: formatHoursValue(topic.hours, locale) })}
                </span>
                <span>
                  {formatYen(topic.yen, locale)}
                  <span className="mt-0.5 block text-xs text-muted">
                    {t("minutes", { n: Math.round(topic.handleMinutes) })}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
