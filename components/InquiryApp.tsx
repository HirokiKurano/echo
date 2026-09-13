"use client";

import { analyzeInquiries, inquiriesInPeriod } from "@/lib/analyze";
import { channelLabel, listBoardChannels, normalizeChannel } from "@/lib/channels";
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
import { ChannelDetail } from "./ChannelDetail";
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
  const [channel, setChannel] = useState("");
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

  const channels = useMemo(
    () => (workspace ? listBoardChannels(workspace.inquiries) : []),
    [workspace],
  );

  const analysis = useMemo(() => {
    if (!workspace) return null;
    const scoped = channel
      ? workspace.inquiries.filter(
          (item) => normalizeChannel(item.channel) === channel,
        )
      : workspace.inquiries;
    return analyzeInquiries(scoped, workspace.topics, workspace.settings);
  }, [workspace, channel]);

  const channelItems = useMemo(() => {
    if (!workspace || !channel) return [];
    return inquiriesInPeriod(
      workspace.inquiries.filter(
        (item) => normalizeChannel(item.channel) === channel,
      ),
      workspace.settings.periodDays,
    ).sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  }, [workspace, channel]);

  const selected = useMemo(() => {
    if (!analysis) return undefined;
    if (selectedId) {
      return analysis.topics.find((topic) => topic.id === selectedId);
    }
    if (channel) return undefined;
    return analysis.topics[0];
  }, [analysis, selectedId, channel]);

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
    <div className="mx-auto flex min-h-full max-w-6xl flex-col gap-10 px-5 py-8 sm:px-10 sm:py-12">
      <header className="flex flex-wrap items-start justify-between gap-4 border-b border-line pb-6">
        <div className="flex items-center gap-3">
          <EchoMark className="h-8 w-8" />
          <div>
            <h1 className="font-display text-sm font-semibold tracking-[0.42em]">
              ECHO
            </h1>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-6">
          <LanguageSwitch />
          <nav className="flex flex-wrap gap-5 text-[11px] tracking-[0.16em] text-muted">
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
                className={
                  tab === id
                    ? "text-foreground underline decoration-accent decoration-2 underline-offset-8"
                    : "hover:text-foreground"
                }
              >
                {label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {tab === "log" ? (
        <div className="flex flex-col gap-6">
          {browserStash ? (
            <div className="border-l-2 border-accent bg-accent-soft/60 px-4 py-3 text-sm">
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
            channels={channels}
            topics={workspace.topics}
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
        <>
          <nav
            className="flex flex-wrap gap-5 text-[11px] tracking-[0.12em] text-muted"
            aria-label={t("channel")}
          >
            <button
              type="button"
              onClick={() => {
                setChannel("");
                setSelectedId("");
              }}
              className={
                channel === ""
                  ? "text-foreground underline decoration-accent decoration-2 underline-offset-8"
                  : "hover:text-foreground"
              }
            >
              {t("channelAll")}
            </button>
            {channels.map((name) => (
              <button
                key={name}
                type="button"
                onClick={() => {
                  setChannel(name);
                  setSelectedId("");
                }}
                className={
                  channel === name
                    ? "text-foreground underline decoration-accent decoration-2 underline-offset-8"
                    : "hover:text-foreground"
                }
              >
                {channelLabel(name, locale)}
              </button>
            ))}
          </nav>
          {empty && !channel ? (
            <p className="border border-dashed border-line px-5 py-16 text-center font-serif text-lg text-muted">
              {t("emptyBoard")}
            </p>
          ) : (
          <>
            <p className="label-kicker">
              {periodLabel} · {t("asOf", { date: analysis.asOf })} ·{" "}
              {t("storedCount", {
                count: formatNumber(analysis.storedCount, locale),
              })}
            </p>
            <section className="grid gap-0 border-y border-line sm:grid-cols-2 lg:grid-cols-4">
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
              <section className="border-l-2 border-accent bg-white/50 px-5 py-6 sm:px-7">
                <p className="label-kicker text-accent">{t("improvement")}</p>
                <p className="mt-3 font-serif text-2xl font-medium leading-snug sm:text-[1.7rem]">
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
                <div className="mb-4 flex items-end justify-between gap-3">
                  <h2 className="font-serif text-xl">{t("rankingTitle")}</h2>
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
              ) : channel ? (
                <ChannelDetail
                  name={channelLabel(channel, locale)}
                  inquiries={channelItems}
                  hours={analysis.totalHours}
                  yen={analysis.totalYen}
                  onDelete={async (id) => {
                    const next = await apiDeleteInquiry(id);
                    setWorkspace(next);
                  }}
                />
              ) : null}
            </section>

            <section>
              <h2 className="mb-4 font-serif text-xl">{t("manualsTitle")}</h2>
              {analysis.proposals.length > 0 ? (
                <ol className="grid gap-0 border-t border-line md:grid-cols-3">
                  {analysis.proposals.map((topic, index) => (
                    <li key={topic.id} className="border-b border-line md:border-r md:last:border-r-0">
                      <button
                        type="button"
                        onClick={() => setSelectedId(topic.id)}
                        className="h-full w-full px-5 py-6 text-left transition hover:bg-white/50"
                      >
                        <p className="font-display text-xs tracking-[0.2em] text-accent">
                          {String(index + 1).padStart(2, "0")}
                        </p>
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
                <p className="border border-line px-4 py-8 text-sm text-muted">
                  {t("manualsEmpty")}
                </p>
              )}
            </section>
          </>
          )}
        </>
      ) : null}

      <footer className="border-t border-line pt-6 text-xs leading-relaxed text-muted">
        <p className="label-kicker text-foreground">{t("opsNotes")}</p>
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
    <div className="border-b border-line px-5 py-6 sm:border-r lg:border-b-0 last:border-b-0">
      <p className="label-kicker">{label}</p>
      <p className="mt-3 font-display text-[1.7rem] font-semibold tracking-tight">
        {value}
      </p>
      <p className="mt-1 text-xs text-muted">{hint}</p>
    </div>
  );
}
