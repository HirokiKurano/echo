"use client";

import { channelLabel } from "@/lib/channels";
import { formatTimestamp } from "@/lib/format";
import type { Inquiry } from "@/lib/types";
import { useLocale } from "./LocaleProvider";

export function InquiryList({
  inquiries,
  onDelete,
}: {
  inquiries: Inquiry[];
  onDelete?: (id: string) => void;
}) {
  const { locale, t } = useLocale();

  if (inquiries.length === 0) {
    return <p className="mt-3 text-sm text-muted">{t("emptyChannel")}</p>;
  }

  return (
    <ul className="mt-3 flex max-h-[28rem] flex-col gap-2 overflow-y-auto pr-1">
      {inquiries.map((inquiry) => (
        <li
          key={inquiry.id}
          className="border-t border-line py-3 first:border-t-0"
        >
          <div className="flex flex-wrap items-baseline justify-between gap-2 text-xs text-muted">
            <span>
              {inquiry.author} · {channelLabel(inquiry.channel, locale)}
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
  );
}
