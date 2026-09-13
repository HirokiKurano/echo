"use client";

import { apiLogin } from "@/lib/client";
import { useState } from "react";
import { LanguageSwitch } from "./LanguageSwitch";
import { useLocale } from "./LocaleProvider";

export function PinGate({ onUnlocked }: { onUnlocked: () => void }) {
  const { t } = useLocale();
  const [pin, setPin] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    const ok = await apiLogin(pin);
    if (!ok) {
      setError(t("pinWrong"));
      return;
    }
    onUnlocked();
  }

  return (
    <div className="mx-auto flex min-h-full max-w-md flex-col justify-center px-5 py-16">
      <div className="mb-8 flex justify-end">
        <LanguageSwitch />
      </div>
      <h1 className="font-display text-2xl font-semibold">ECHO</h1>
      <p className="mt-2 text-sm text-muted">{t("pinHelp")}</p>
      <input
        type="password"
        value={pin}
        onChange={(event) => setPin(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") void submit();
        }}
        className="mt-6 rounded-xl border border-line bg-surface px-3 py-2 text-sm outline-none focus:border-accent/50"
        placeholder="PIN"
        autoFocus
      />
      {error ? <p className="mt-2 text-xs text-accent">{error}</p> : null}
      <button
        type="button"
        onClick={() => void submit()}
        className="mt-4 rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background"
      >
        {t("pinEnter")}
      </button>
    </div>
  );
}
