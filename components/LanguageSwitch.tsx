"use client";

import { useLocale } from "./LocaleProvider";

export function LanguageSwitch() {
  const { locale, setLocale, t } = useLocale();

  return (
    <div
      className="flex items-center gap-2 font-display text-[11px] tracking-[0.22em]"
      role="group"
      aria-label={t("language")}
    >
      <button
        type="button"
        aria-pressed={locale === "ja"}
        onClick={() => setLocale("ja")}
        className={
          locale === "ja"
            ? "text-foreground underline decoration-accent decoration-2 underline-offset-6"
            : "text-muted"
        }
      >
        JA
      </button>
      <span className="text-line">/</span>
      <button
        type="button"
        aria-pressed={locale === "en"}
        onClick={() => setLocale("en")}
        className={
          locale === "en"
            ? "text-foreground underline decoration-accent decoration-2 underline-offset-6"
            : "text-muted"
        }
      >
        EN
      </button>
    </div>
  );
}
