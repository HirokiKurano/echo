"use client";

import {
  formatHoursValue,
  formatYen,
  localizedTopicField,
} from "@/lib/format";
import type { TopicStat } from "@/lib/types";
import { InquiryList } from "./InquiryList";
import { useLocale } from "./LocaleProvider";

export function TopicDetail({
  topic,
  onDelete,
}: {
  topic: TopicStat;
  onDelete?: (id: string) => void;
}) {
  const { locale, t } = useLocale();
  const title = localizedTopicField(topic.id, "title", topic.title, locale);
  const category = localizedTopicField(
    topic.id,
    "category",
    topic.category,
    locale,
  );
  const doc = localizedTopicField(
    topic.id,
    "doc",
    topic.suggestedDoc,
    locale,
  );

  return (
    <aside className="echo-panel">
      <p className="label-kicker">{category}</p>
      <h3 className="mt-2 font-serif text-2xl font-medium leading-snug">{title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-muted">
        {topic.count} / {t("hours", { n: formatHoursValue(topic.hours, locale) })}{" "}
        / {formatYen(topic.yen, locale)}.
        {topic.id === "other"
          ? t("detailOther")
          : t("detailManual", {
              hours: t("hours", {
                n: formatHoursValue(topic.saveableHours, locale),
              }),
            })}
      </p>
      {topic.id !== "other" ? (
        <p className="mt-3 border-l-2 border-accent pl-3 text-sm">
          {t("detailWrite", { doc })}
        </p>
      ) : null}

      <h4 className="mt-6 label-kicker">{t("originalMessages")}</h4>
      <InquiryList inquiries={topic.inquiries} onDelete={onDelete} />
    </aside>
  );
}
