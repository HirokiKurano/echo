"use client";

import { parsePastedInquiries } from "@/lib/parsePaste";
import { parseSnapshot } from "@/lib/session";
import type { Inquiry } from "@/lib/types";
import { useRef, useState } from "react";
import { useLocale } from "./LocaleProvider";

export function ImportPanel({
  defaultMinutes,
  onImport,
}: {
  defaultMinutes: number;
  onImport: (
    inquiries: Inquiry[],
    mode: "append" | "replace",
  ) => Promise<void>;
}) {
  const { t } = useLocale();
  const [draft, setDraft] = useState("");
  const [replace, setReplace] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function applyRaw(raw: string) {
    const snapshot = parseSnapshot(raw);
    const parsed = snapshot ?? parsePastedInquiries(raw).inquiries;
    if (parsed.length === 0) {
      setMessage(t("importNeedLines"));
      return;
    }
    setBusy(true);
    try {
      await onImport(parsed, replace ? "replace" : "append");
      setDraft("");
      setMessage(
        t(replace ? "importReplaced" : "importAppended", {
          count: parsed.length,
        }),
      );
    } catch {
      setMessage(t("importFail"));
    } finally {
      setBusy(false);
    }
  }

  function onFile(file: File | undefined) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const text = typeof reader.result === "string" ? reader.result : "";
      if (!file.name.endsWith(".json")) setDraft(text);
      void applyRaw(text);
    };
    reader.readAsText(file);
  }

  return (
    <section className="echo-panel">
      <h2 className="font-serif text-xl">{t("importTitle")}</h2>
      <p className="mt-1 text-xs text-muted">{t("importHelp")}</p>
      <textarea
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        rows={6}
        placeholder={t("importPlaceholder")}
        aria-label={t("importAria")}
        className="echo-field mt-4 min-h-[8rem] resize-y placeholder:text-muted/60"
      />
      <label className="mt-3 flex items-center gap-2 text-xs text-muted">
        <input
          type="checkbox"
          checked={replace}
          onChange={(event) => setReplace(event.target.checked)}
        />
        {t("importReplace")}
      </label>
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          disabled={busy}
          onClick={() => void applyRaw(draft)}
          className="echo-btn"
        >
          {replace ? t("importReplaceBtn") : t("importAppendBtn")}
        </button>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="echo-btn-ghost"
        >
          {t("chooseFile")}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept=".txt,.csv,.tsv,.json,text/plain,text/csv,application/json"
          className="hidden"
          onChange={(event) => {
            onFile(event.target.files?.[0]);
            event.target.value = "";
          }}
        />
      </div>
      <p className="mt-2 text-xs text-muted">
        {t("importMinutesNote", { minutes: defaultMinutes })}
      </p>
      {message ? <p className="mt-2 text-xs text-accent">{message}</p> : null}
    </section>
  );
}
