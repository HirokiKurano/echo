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
      <div className="mb-10 flex justify-end">
        <LanguageSwitch />
      </div>
      <p className="font-display text-sm tracking-[0.42em]">ECHO</p>
      <h1 className="mt-4 font-serif text-3xl font-medium">{t("pinHelp")}</h1>
      <input
        type="password"
        value={pin}
        onChange={(event) => setPin(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") void submit();
        }}
        className="echo-field mt-8"
        placeholder="PIN"
        autoFocus
      />
      {error ? <p className="mt-2 text-xs text-accent">{error}</p> : null}
      <button
        type="button"
        onClick={() => void submit()}
        className="echo-btn mt-8 self-start"
      >
        {t("pinEnter")}
      </button>
    </div>
  );
}
