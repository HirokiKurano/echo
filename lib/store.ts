import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { ASSUMPTIONS } from "./assumptions";
import { TOPIC_DEFINITIONS } from "./topics";
import type { Inquiry, TopicDefinition } from "./types";
import type { Workspace, WorkspaceSettings } from "./workspace-types";

const DATA_DIR = path.join(process.cwd(), "data");
const FILE_PATH = path.join(DATA_DIR, "workspace.json");

let writeChain: Promise<unknown> = Promise.resolve();

function withLock<T>(fn: () => Promise<T>): Promise<T> {
  const run = writeChain.then(fn, fn);
  writeChain = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

export function defaultSettings(): WorkspaceSettings {
  return {
    companyName: "自社",
    hourlyYen: ASSUMPTIONS.hourlyYen,
    deflectionRate: ASSUMPTIONS.deflectionRate,
    defaultHandleMinutes: ASSUMPTIONS.defaultHandleMinutes,
    periodDays: ASSUMPTIONS.periodDays,
  };
}

export function emptyWorkspace(): Workspace {
  return {
    version: 1,
    settings: defaultSettings(),
    topics: structuredClone(TOPIC_DEFINITIONS),
    inquiries: [],
  };
}

function normalizeWorkspace(raw: unknown): Workspace {
  const base = emptyWorkspace();
  if (!raw || typeof raw !== "object") return base;
  const value = raw as Partial<Workspace>;
  return {
    version: 1,
    settings: { ...base.settings, ...value.settings },
    topics: Array.isArray(value.topics) && value.topics.length > 0
      ? value.topics
      : base.topics,
    inquiries: Array.isArray(value.inquiries) ? value.inquiries : [],
  };
}

export async function readWorkspace(): Promise<Workspace> {
  try {
    const text = await readFile(FILE_PATH, "utf8");
    return normalizeWorkspace(JSON.parse(text));
  } catch {
    const workspace = emptyWorkspace();
    await writeWorkspace(workspace);
    return workspace;
  }
}

export async function writeWorkspace(workspace: Workspace): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(FILE_PATH, `${JSON.stringify(workspace, null, 2)}\n`, "utf8");
}

export async function updateWorkspace(
  updater: (current: Workspace) => Workspace,
): Promise<Workspace> {
  return withLock(async () => {
    const current = await readWorkspace();
    const next = updater(current);
    await writeWorkspace(next);
    return next;
  });
}

export async function addInquiries(
  incoming: Inquiry[],
  mode: "append" | "replace",
): Promise<Workspace> {
  return updateWorkspace((current) => {
    if (mode === "replace") {
      return { ...current, inquiries: incoming };
    }
    const existing = new Set(current.inquiries.map((item) => item.id));
    const merged = [...current.inquiries];
    for (const item of incoming) {
      if (existing.has(item.id)) continue;
      existing.add(item.id);
      merged.push(item);
    }
    return { ...current, inquiries: merged };
  });
}

export async function removeInquiry(id: string): Promise<Workspace> {
  return updateWorkspace((current) => ({
    ...current,
    inquiries: current.inquiries.filter((item) => item.id !== id),
  }));
}

export async function saveSettings(
  settings: Partial<WorkspaceSettings>,
  topics?: TopicDefinition[],
): Promise<Workspace> {
  return updateWorkspace((current) => ({
    ...current,
    settings: { ...current.settings, ...settings },
    topics: topics ?? current.topics,
  }));
}
