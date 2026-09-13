"use client";

import { formatHoursValue, formatNumber, formatYen } from "@/lib/format";
import type { Inquiry } from "@/lib/types";
import { InquiryList } from "./InquiryList";
import { useLocale } from "./LocaleProvider";

export function ChannelDetail({
  name,
  inquiries,
  hours,
  yen,
  onDelete,
}: {
  name: string;
  inquiries: Inquiry[];
  hours: number;
  yen: number;
  onDelete?: (id: string) => void;
}) {
  const { locale, t } = useLocale();

  return (
    <aside className="echo-panel">
      <p className="label-kicker">{t("channel")}</p>
      <h3 className="mt-2 font-serif text-2xl font-medium leading-snug">{name}</h3>
      <p className="mt-3 text-sm text-muted">
        {formatNumber(inquiries.length, locale)} /{" "}
        {t("hours", { n: formatHoursValue(hours, locale) })} / {formatYen(yen, locale)}
      </p>
      <h4 className="mt-6 label-kicker">{t("originalMessages")}</h4>
      <InquiryList inquiries={inquiries} onDelete={onDelete} />
    </aside>
  );
}
