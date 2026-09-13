"use client";

import type { Inquiry } from "@/lib/types";
import type { WorkspaceSettings } from "@/lib/workspace-types";
import { useState } from "react";
import { useLocale } from "./LocaleProvider";

export function LogForm({
  settings,
  onCreate,
}: {
  settings: WorkspaceSettings;
  onCreate: (inquiry: Inquiry) => Promise<void>;
}) {
  const { t } = useLocale();
  const [text, setText] = useState("");
  const [channel, setChannel] = useState(t("defaultChannel"));
  const [author, setAuthor] = useState("");
  const [responder, setResponder] = useState("");
  const [minutes, setMinutes] = useState(String(settings.defaultHandleMinutes));
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function submit() {
    const nextText = text.trim();
    if (!nextText) {
      setMessage(t("logNeedText"));
      return;
    }
    setBusy(true);
    setMessage(null);
    try {
      await onCreate({
        id: crypto.randomUUID(),
        text: nextText,
        channel: channel.trim() || t("defaultChannel"),
        author: author.trim() || t("defaultAuthor"),
        responder: responder.trim() || null,
        handleMinutes: Number(minutes) || settings.defaultHandleMinutes,
        createdAt: new Date().toISOString(),
      });
      setText("");
      setMessage(t("logSaved"));
    } catch {
      setMessage(t("logSaveFail"));
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="rounded-2xl border border-line bg-surface p-5">
      <h2 className="text-sm font-medium">{t("logTitle")}</h2>
      <p className="mt-1 text-xs text-muted">{t("logHelp")}</p>
      <textarea
        value={text}
        onChange={(event) => setText(event.target.value)}
        rows={3}
        placeholder={t("logPlaceholder")}
        className="mt-3 w-full resize-y rounded-xl border border-line bg-background px-3 py-2.5 text-sm outline-none focus:border-accent/50"
      />
      <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        <label className="text-xs text-muted">
          {t("channel")}
          <input
            value={channel}
            onChange={(event) => setChannel(event.target.value)}
            className="mt-1 w-full rounded-lg border border-line bg-background px-2 py-1.5 text-sm text-foreground"
          />
        </label>
        <label className="text-xs text-muted">
          {t("asker")}
          <input
            value={author}
            onChange={(event) => setAuthor(event.target.value)}
            placeholder={t("askerPlaceholder")}
            className="mt-1 w-full rounded-lg border border-line bg-background px-2 py-1.5 text-sm text-foreground"
          />
        </label>
        <label className="text-xs text-muted">
          {t("answerer")}
          <input
            value={responder}
            onChange={(event) => setResponder(event.target.value)}
            placeholder={t("answererPlaceholder")}
            className="mt-1 w-full rounded-lg border border-line bg-background px-2 py-1.5 text-sm text-foreground"
          />
        </label>
        <label className="text-xs text-muted">
          {t("handleMinutes")}
          <input
            type="number"
            min={1}
            value={minutes}
            onChange={(event) => setMinutes(event.target.value)}
            className="mt-1 w-full rounded-lg border border-line bg-background px-2 py-1.5 text-sm text-foreground"
          />
        </label>
      </div>
      <button
        type="button"
        disabled={busy}
        onClick={() => void submit()}
        className="mt-4 rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background disabled:opacity-50"
      >
        {busy ? t("saving") : t("logSubmit")}
      </button>
      {message ? <p className="mt-2 text-xs text-accent">{message}</p> : null}
    </section>
  );
}
