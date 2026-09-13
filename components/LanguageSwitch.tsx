"use client";

import { useLocale } from "./LocaleProvider";

export function LanguageSwitch() {
  const { locale, setLocale, t } = useLocale();

  return (
    <div
      className="flex rounded-full border border-line p-0.5 text-xs"
      role="group"
      aria-label={t("language")}
    >
      <button
        type="button"
        aria-pressed={locale === "ja"}
        onClick={() => setLocale("ja")}
        className={`rounded-full px-2.5 py-1 ${
          locale === "ja" ? "bg-foreground text-background" : "text-muted"
        }`}
      >
        日本語
      </button>
      <button
        type="button"
        aria-pressed={locale === "en"}
        onClick={() => setLocale("en")}
        className={`rounded-full px-2.5 py-1 ${
          locale === "en" ? "bg-foreground text-background" : "text-muted"
        }`}
      >
        English
      </button>
    </div>
  );
}
