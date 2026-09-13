"use client";

import type { TopicDefinition } from "@/lib/types";
import type { WorkspaceSettings } from "@/lib/workspace-types";
import { useState } from "react";
import { useLocale } from "./LocaleProvider";

export function SettingsPanel({
  settings,
  topics,
  onSave,
}: {
  settings: WorkspaceSettings;
  topics: TopicDefinition[];
  onSave: (
    settings: WorkspaceSettings,
    topics: TopicDefinition[],
  ) => Promise<void>;
}) {
  const { t } = useLocale();
  const [draft, setDraft] = useState(settings);
  const [topicDraft, setTopicDraft] = useState(topics);
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function save() {
    setBusy(true);
    setMessage(null);
    try {
      await onSave(draft, topicDraft);
      setMessage(t("settingsSaved"));
    } catch {
      setMessage(t("settingsFail"));
    } finally {
      setBusy(false);
    }
  }

  function updateTopic(index: number, patch: Partial<TopicDefinition>) {
    setTopicDraft((current) =>
      current.map((topic, i) => (i === index ? { ...topic, ...patch } : topic)),
    );
  }

  return (
    <section className="flex flex-col gap-6">
      <div className="echo-panel">
        <h2 className="font-serif text-xl">{t("settingsNumbers")}</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <label className="text-xs text-muted">
            {t("companyName")}
            <input
              value={draft.companyName}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  companyName: event.target.value,
                }))
              }
              className="echo-field"
            />
          </label>
          <label className="text-xs text-muted">
            {t("hourlyYen")}
            <input
              type="number"
              min={1}
              value={draft.hourlyYen}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  hourlyYen: Number(event.target.value) || 0,
                }))
              }
              className="echo-field"
            />
          </label>
          <label className="text-xs text-muted">
            {t("periodDays")}
            <input
              type="number"
              min={0}
              value={draft.periodDays}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  periodDays: Number(event.target.value) || 0,
                }))
              }
              className="echo-field"
            />
          </label>
          <label className="text-xs text-muted">
            {t("deflection")}
            <input
              type="number"
              min={0.1}
              max={1}
              step={0.05}
              value={draft.deflectionRate}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  deflectionRate: Number(event.target.value) || 0,
                }))
              }
              className="echo-field"
            />
          </label>
          <label className="text-xs text-muted">
            {t("defaultMinutes")}
            <input
              type="number"
              min={1}
              value={draft.defaultHandleMinutes}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  defaultHandleMinutes: Number(event.target.value) || 1,
                }))
              }
              className="echo-field"
            />
          </label>
        </div>
      </div>

      <div className="echo-panel">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-serif text-xl">{t("settingsTopics")}</h2>
          <button
            type="button"
            onClick={() =>
              setTopicDraft((current) => [
                ...current,
                {
                  id: crypto.randomUUID(),
                  title: t("newTopicTitle"),
                  category: t("newTopicCategory"),
                  suggestedDoc: t("newTopicDoc"),
                  keywords: [t("newKeyword")],
                },
              ])
            }
            className="text-xs text-accent"
          >
            {t("addTopic")}
          </button>
        </div>
        <p className="mt-1 text-xs text-muted">{t("topicsHelp")}</p>
        <ul className="mt-3 flex flex-col gap-3">
          {topicDraft.map((topic, index) => (
            <li key={topic.id} className="border-t border-line py-4 first:border-t-0">
              <div className="grid gap-2 sm:grid-cols-2">
                <input
                  value={topic.title}
                  onChange={(event) =>
                    updateTopic(index, { title: event.target.value })
                  }
                  className="echo-field"
                  placeholder={t("topicTitle")}
                />
                <input
                  value={topic.suggestedDoc}
                  onChange={(event) =>
                    updateTopic(index, { suggestedDoc: event.target.value })
                  }
                  className="echo-field"
                  placeholder={t("topicDoc")}
                />
                <input
                  value={topic.category}
                  onChange={(event) =>
                    updateTopic(index, { category: event.target.value })
                  }
                  className="echo-field"
                  placeholder={t("topicCategory")}
                />
                <input
                  value={topic.keywords.join("、")}
                  onChange={(event) =>
                    updateTopic(index, {
                      keywords: event.target.value
                        .split(/[、,]/)
                        .map((word) => word.trim())
                        .filter(Boolean),
                    })
                  }
                  className="echo-field"
                  placeholder={t("topicKeywords")}
                />
              </div>
              <button
                type="button"
                onClick={() =>
                  setTopicDraft((current) =>
                    current.filter((_, i) => i !== index),
                  )
                }
                className="mt-2 text-xs text-muted hover:text-foreground"
              >
                {t("deleteTopic")}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <button
        type="button"
        disabled={busy}
        onClick={() => void save()}
        className="echo-btn self-start"
      >
        {busy ? t("saving") : t("saveSettings")}
      </button>
      {message ? <p className="text-xs text-accent">{message}</p> : null}
    </section>
  );
}
