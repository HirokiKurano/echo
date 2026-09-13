"use client";

import { channelLabel, DEFAULT_CHANNELS, normalizeChannel } from "@/lib/channels";
import {
  applySuggestion,
  topicSuggestions,
  typingQuery,
} from "@/lib/suggest";
import type { Inquiry, TopicDefinition } from "@/lib/types";
import type { WorkspaceSettings } from "@/lib/workspace-types";
import { useMemo, useState } from "react";
import { useLocale } from "./LocaleProvider";

export function LogForm({
  settings,
  channels,
  topics,
  onCreate,
}: {
  settings: WorkspaceSettings;
  channels: string[];
  topics: TopicDefinition[];
  onCreate: (inquiry: Inquiry) => Promise<void>;
}) {
  const { locale, t } = useLocale();
  const options = [...new Set([...DEFAULT_CHANNELS, ...channels])];
  const [text, setText] = useState("");
  const [channel, setChannel] = useState<string>(DEFAULT_CHANNELS[0]);
  const [author, setAuthor] = useState("");
  const [responder, setResponder] = useState("");
  const [minutes, setMinutes] = useState(String(settings.defaultHandleMinutes));
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);

  const query = typingQuery(text);
  const suggestions = useMemo(
    () => topicSuggestions(topics, query, locale),
    [topics, query, locale],
  );
  const showSuggest = open && suggestions.length > 0;

  function pick(insert: string) {
    setText(applySuggestion(text, query, insert));
    setOpen(false);
    setActive(0);
  }

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
        channel: normalizeChannel(channel),
        author: author.trim() || t("defaultAuthor"),
        responder: responder.trim() || null,
        handleMinutes: Number(minutes) || settings.defaultHandleMinutes,
        createdAt: new Date().toISOString(),
      });
      setText("");
      setOpen(false);
      setMessage(t("logSaved"));
    } catch {
      setMessage(t("logSaveFail"));
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="echo-panel">
      <h2 className="font-serif text-xl">{t("logTitle")}</h2>
      <p className="mt-1 text-xs text-muted">{t("logHelp")}</p>
      <div className="relative">
        <textarea
          value={text}
          onChange={(event) => {
            setText(event.target.value);
            setOpen(true);
            setActive(0);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => {
            window.setTimeout(() => setOpen(false), 120);
          }}
          onKeyDown={(event) => {
            if (!showSuggest) return;
            if (event.key === "ArrowDown") {
              event.preventDefault();
              setActive((index) => (index + 1) % suggestions.length);
            } else if (event.key === "ArrowUp") {
              event.preventDefault();
              setActive(
                (index) =>
                  (index - 1 + suggestions.length) % suggestions.length,
              );
            } else if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              pick(suggestions[active]?.insert ?? suggestions[0].insert);
            } else if (event.key === "Escape") {
              setOpen(false);
            }
          }}
          rows={3}
          placeholder={t("logPlaceholder")}
          className="echo-field mt-4 min-h-[5.5rem] resize-y"
          aria-autocomplete="list"
          aria-expanded={showSuggest}
        />
        {showSuggest ? (
          <ul
            className="absolute z-10 mt-1 w-full border border-line bg-white/95 py-1 shadow-sm backdrop-blur-sm"
            role="listbox"
          >
            {suggestions.map((item, index) => (
              <li key={item.key} role="option" aria-selected={index === active}>
                <button
                  type="button"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => pick(item.insert)}
                  className={`w-full px-3 py-2 text-left text-sm ${
                    index === active ? "bg-accent-soft" : "hover:bg-white"
                  }`}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
      <div className="mt-4">
        <p className="text-xs text-muted">{t("channel")}</p>
        <div className="mt-2 flex flex-wrap gap-4 text-[11px] tracking-[0.12em] text-muted">
          {options.map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => setChannel(name)}
              className={
                channel === name
                  ? "text-foreground underline decoration-accent decoration-2 underline-offset-8"
                  : "hover:text-foreground"
              }
            >
              {channelLabel(name, locale)}
            </button>
          ))}
        </div>
        <input
          value={channelLabel(channel, locale)}
          onChange={(event) => setChannel(normalizeChannel(event.target.value))}
          className="echo-field"
          aria-label={t("channel")}
        />
      </div>
      <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        <label className="text-xs text-muted">
          {t("asker")}
          <input
            value={author}
            onChange={(event) => setAuthor(event.target.value)}
            placeholder={t("askerPlaceholder")}
            className="echo-field"
          />
        </label>
        <label className="text-xs text-muted">
          {t("answerer")}
          <input
            value={responder}
            onChange={(event) => setResponder(event.target.value)}
            placeholder={t("answererPlaceholder")}
            className="echo-field"
          />
        </label>
        <label className="text-xs text-muted">
          {t("handleMinutes")}
          <input
            type="number"
            min={1}
            value={minutes}
            onChange={(event) => setMinutes(event.target.value)}
            className="echo-field"
          />
        </label>
      </div>
      <button
        type="button"
        disabled={busy}
        onClick={() => void submit()}
        className="echo-btn mt-5"
      >
        {busy ? t("saving") : t("logSubmit")}
      </button>
      {message ? <p className="mt-2 text-xs text-accent">{message}</p> : null}
    </section>
  );
}
