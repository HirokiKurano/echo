"use client";

import { analyzeInquiries } from "@/lib/analyze";
import {
  formatHoursValue,
  formatNumber,
  formatPercent,
  formatYen,
  localizedTopicField,
} from "@/lib/format";
import {
  apiAddInquiries,
  apiDeleteInquiry,
  apiSaveSettings,
  apiWorkspace,
} from "@/lib/client";
import { loadSession } from "@/lib/session";
import type { Inquiry, TopicDefinition } from "@/lib/types";
import type { MessageKey } from "@/lib/messages";
import type { Workspace, WorkspaceSettings } from "@/lib/workspace-types";
import { useCallback, useEffect, useMemo, useState } from "react";
import { EchoMark } from "./EchoMark";
import { ImportPanel } from "./ImportPanel";
import { LanguageSwitch } from "./LanguageSwitch";
import { LogForm } from "./LogForm";
import { useLocale } from "./LocaleProvider";
import { PinGate } from "./PinGate";
import { RankingTable } from "./RankingTable";
import { SettingsPanel } from "./SettingsPanel";
import { TopicDetail } from "./TopicDetail";

type Tab = "board" | "log" | "settings";

export function InquiryApp() {
  const { locale, t } = useLocale();
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [needsPin, setNeedsPin] = useState(false);
  const [errorKey, setErrorKey] = useState<MessageKey | null>(null);
  const [tab, setTab] = useState<Tab>("board");
  const [selectedId, setSelectedId] = useState("");
  const [browserStash, setBrowserStash] = useState<Inquiry[] | null>(null);

  const load = useCallback(async () => {
    const result = await apiWorkspace();
    if (!result.ok) {
      setNeedsPin(result.pinRequired);
      if (!result.pinRequired) setErrorKey("connectError");
      return;
    }
    setNeedsPin(false);
    setErrorKey(null);
    setWorkspace(result.workspace);
  }, []);

  useEffect(() => {
    void load();
    const stored = loadSession();
    if (stored?.source === "own" && stored.inquiries.length > 0) {
      setBrowserStash(stored.inquiries);
    }
  }, [load]);

  const analysis = useMemo(() => {
    if (!workspace) return null;
    return analyzeInquiries(
      workspace.inquiries,
      workspace.topics,
      workspace.settings,
    );
  }, [workspace]);

  const selected = useMemo(
    () =>
      analysis?.topics.find((topic) => topic.id === selectedId) ??
      analysis?.topics[0],
    [analysis, selectedId],
  );

  const periodLabel = analysis
    ? analysis.periodDays > 0
      ? t("periodRecent", { days: analysis.periodDays })
      : t("periodAll")
    : "";

  if (needsPin) {
    return <PinGate onUnlocked={() => void load()} />;
  }

  if (errorKey) {
    return (
      <div className="mx-auto max-w-lg px-5 py-16">
        <div className="mb-6 flex justify-end">
          <LanguageSwitch />
        </div>
        <p className="text-sm text-muted">{t(errorKey)}</p>
      </div>
    );
  }

  if (!workspace || !analysis) {
    return (
      <div className="mx-auto max-w-lg px-5 py-16">
        <div className="mb-6 flex justify-end">
          <LanguageSwitch />
        </div>
        <p className="text-sm text-muted">{t("loading")}</p>
      </div>
    );
  }

  const settings = workspace.settings;
  const empty = workspace.inquiries.length === 0;
  const top = analysis.proposals[0];

  return (
    <div className="mx-auto flex min-h-full max-w-6xl flex-col gap-8 px-5 py-8 sm:px-8 sm:py-10">
      <header className="flex flex-col gap-5 border-b border-line pb-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <EchoMark className="h-6 w-6" />
            <div>
              <p className="font-display text-lg font-semibold tracking-wide">
                ECHO
              </p>
              <p className="text-xs text-muted">{settings.companyName}</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <LanguageSwitch />
            <nav className="flex flex-wrap gap-1 rounded-full border border-line p-1 text-xs">
              {(
                [
                  ["board", t("tabBoard")],
                  ["log", t("tabLog")],
                  ["settings", t("tabSettings")],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setTab(id)}
                  className={`rounded-full px-3 py-1.5 ${
                    tab === id ? "bg-foreground text-background" : "text-muted"
                  }`}
                >
                  {label}
                </button>
              ))}
            </nav>
          </div>
        </div>
        <div className="max-w-2xl">
          <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            {t("headline")}
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted">{t("intro")}</p>
        </div>
      </header>

      {tab === "log" ? (
        <div className="flex flex-col gap-6">
          {browserStash ? (
            <div className="rounded-xl border border-accent/30 px-4 py-3 text-sm">
              <p>{t("stashNote")}</p>
              <button
                type="button"
                className="mt-2 text-xs text-accent underline"
                onClick={async () => {
                  const next = await apiAddInquiries(browserStash, "append");
                  setWorkspace(next);
                  setBrowserStash(null);
                  setTab("board");
                }}
              >
                {t("stashImport")}
              </button>
            </div>
          ) : null}
          <LogForm
            settings={settings}
            onCreate={async (inquiry) => {
              const next = await apiAddInquiries([inquiry], "append");
              setWorkspace(next);
            }}
          />
          <ImportPanel
            defaultMinutes={settings.defaultHandleMinutes}
            onImport={async (inquiries, mode) => {
              const next = await apiAddInquiries(inquiries, mode);
              setWorkspace(next);
              setTab("board");
            }}
          />
        </div>
      ) : null}

      {tab === "settings" ? (
        <SettingsPanel
          settings={settings}
          topics={workspace.topics}
          onSave={async (
            nextSettings: WorkspaceSettings,
            topics: TopicDefinition[],
          ) => {
            const next = await apiSaveSettings(nextSettings, topics);
            setWorkspace(next);
          }}
        />
      ) : null}

      {tab === "board" ? (
        empty ? (
          <p className="rounded-2xl border border-dashed border-line px-5 py-10 text-center text-sm text-muted">
            {t("emptyBoard")}
          </p>
        ) : (
          <>
            <p className="text-xs text-muted">
              {periodLabel} · {t("asOf", { date: analysis.asOf })} ·{" "}
              {t("storedCount", {
                count: formatNumber(analysis.storedCount, locale),
              })}
            </p>
            <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Kpi
                label={t("kpiCount")}
                value={formatNumber(analysis.totalCount, locale)}
                hint={periodLabel}
              />
              <Kpi
                label={t("kpiHours")}
                value={t("hours", {
                  n: formatHoursValue(analysis.totalHours, locale),
                })}
                hint={t("kpiHourly", {
                  yen: formatNumber(settings.hourlyYen, locale),
                })}
              />
              <Kpi
                label={t("kpiYen")}
                value={formatYen(analysis.totalYen, locale)}
                hint={t("kpiInPeriod")}
              />
              <Kpi
                label={t("kpiTopics")}
                value={`${analysis.topics.length - (analysis.otherCount > 0 ? 1 : 0)}`}
                hint={t("uncategorizedCount", { count: analysis.otherCount })}
              />
            </section>

            {top ? (
              <section className="rounded-2xl border border-accent/25 bg-accent-soft px-5 py-5 sm:px-6">
                <p className="text-xs font-medium tracking-wide text-accent">
                  {t("improvement")}
                </p>
                <p className="mt-2 text-lg font-medium leading-snug sm:text-xl">
                  {t("writeDoc", {
                    doc: localizedTopicField(
                      top.id,
                      "doc",
                      top.suggestedDoc,
                      locale,
                    ),
                    hours: t("hours", {
                      n: formatHoursValue(top.saveableHours, locale),
                    }),
                    yen: formatYen(top.saveableYen, locale),
                  })}
                </p>
                <p className="mt-2 text-sm text-muted">
                  {t("topicHits", {
                    title: localizedTopicField(top.id, "title", top.title, locale),
                    count: top.count,
                    rate: formatPercent(settings.deflectionRate),
                  })}
                </p>
              </section>
            ) : null}

            <section className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(20rem,0.85fr)]">
              <div className="min-w-0">
                <div className="mb-3 flex items-end justify-between gap-3">
                  <h2 className="text-sm font-medium">{t("rankingTitle")}</h2>
                  <p className="text-xs text-muted">{t("rankingHint")}</p>
                </div>
                <RankingTable
                  topics={analysis.topics}
                  selectedId={selected?.id ?? ""}
                  onSelect={setSelectedId}
                />
              </div>
              {selected ? (
                <TopicDetail
                  topic={selected}
                  onDelete={async (id) => {
                    const next = await apiDeleteInquiry(id);
                    setWorkspace(next);
                  }}
                />
              ) : null}
            </section>

            <section>
              <h2 className="mb-3 text-sm font-medium">{t("manualsTitle")}</h2>
              {analysis.proposals.length > 0 ? (
                <ol className="grid gap-3 md:grid-cols-3">
                  {analysis.proposals.map((topic, index) => (
                    <li key={topic.id}>
                      <button
                        type="button"
                        onClick={() => setSelectedId(topic.id)}
                        className="h-full w-full rounded-2xl border border-line bg-surface px-4 py-4 text-left transition hover:border-accent/40"
                      >
                        <p className="text-xs text-muted">#{index + 1}</p>
                        <p className="mt-1 font-medium">
                          {localizedTopicField(
                            topic.id,
                            "doc",
                            topic.suggestedDoc,
                            locale,
                          )}
                        </p>
                        <p className="mt-2 text-sm text-muted">
                          {localizedTopicField(
                            topic.id,
                            "title",
                            topic.title,
                            locale,
                          )}
                        </p>
                        <p className="mt-4 text-sm">
                          {t("annualLine", {
                            hours: t("hours", {
                              n: formatHoursValue(topic.saveableHours, locale),
                            }),
                            yen: formatYen(topic.saveableYen, locale),
                          })}
                        </p>
                      </button>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="rounded-2xl border border-line px-4 py-6 text-sm text-muted">
                  {t("manualsEmpty")}
                </p>
              )}
            </section>
          </>
        )
      ) : null}

      <footer className="rounded-2xl border border-line px-5 py-4 text-xs leading-relaxed text-muted">
        <p className="font-medium text-foreground">{t("opsNotes")}</p>
        <ul className="mt-2 list-disc space-y-1 pl-4">
          <li>{t("opsStore")}</li>
          <li>{t("opsFormula", { period: periodLabel })}</li>
          <li>{t("opsHost")}</li>
        </ul>
      </footer>
    </div>
  );
}

function Kpi({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="rounded-2xl border border-line bg-surface px-4 py-4">
      <p className="text-xs text-muted">{label}</p>
      <p className="mt-2 font-display text-2xl font-semibold tracking-tight">
        {value}
      </p>
      <p className="mt-1 text-xs text-muted">{hint}</p>
    </div>
  );
}
