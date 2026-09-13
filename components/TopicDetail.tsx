"use client";

import {
  formatHoursValue,
  formatTimestamp,
  formatYen,
  localizedTopicField,
} from "@/lib/format";
import type { TopicStat } from "@/lib/types";
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
    <aside className="rounded-2xl border border-line bg-surface p-5">
      <p className="text-xs text-muted">{category}</p>
      <h3 className="mt-1 text-lg font-medium">{title}</h3>
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
        <p className="mt-3 rounded-xl border border-line px-3 py-2 text-sm">
          {t("detailWrite", { doc })}
        </p>
      ) : null}

      <h4 className="mt-5 text-xs font-medium tracking-wide text-muted">
        {t("originalMessages")}
      </h4>
      <ul className="mt-3 flex max-h-[28rem] flex-col gap-2 overflow-y-auto pr-1">
        {topic.inquiries.map((inquiry) => (
          <li
            key={inquiry.id}
            className="rounded-xl border border-line bg-background px-3 py-2.5"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2 text-xs text-muted">
              <span>
                {inquiry.author} · {inquiry.channel}
              </span>
              <span>{formatTimestamp(inquiry.createdAt)}</span>
            </div>
            <p className="mt-1.5 text-sm leading-relaxed">{inquiry.text}</p>
            <div className="mt-1.5 flex items-center justify-between gap-2 text-xs text-muted">
              <span>
                {inquiry.responder
                  ? t("replied", {
                      name: inquiry.responder,
                      minutes: inquiry.handleMinutes,
                    })
                  : t("unanswered", { minutes: inquiry.handleMinutes })}
              </span>
              {onDelete ? (
                <button
                  type="button"
                  onClick={() => onDelete(inquiry.id)}
                  className="text-muted hover:text-foreground"
                >
                  {t("delete")}
                </button>
              ) : null}
            </div>
          </li>
        ))}
      </ul>
    </aside>
  );
}
