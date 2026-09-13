import type { Inquiry } from "./types";
import type { Workspace, WorkspaceSettings } from "./workspace-types";
import type { TopicDefinition } from "./types";

export async function apiLogin(pin: string): Promise<boolean> {
  const response = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ pin }),
  });
  return response.ok;
}

export async function apiWorkspace(): Promise<
  { ok: true; workspace: Workspace } | { ok: false; pinRequired: boolean }
> {
  const response = await fetch("/api/workspace", { cache: "no-store" });
  if (response.status === 401) {
    return { ok: false, pinRequired: true };
  }
  if (!response.ok) {
    return { ok: false, pinRequired: false };
  }
  return { ok: true, workspace: (await response.json()) as Workspace };
}

export async function apiAddInquiries(
  inquiries: Inquiry[],
  mode: "append" | "replace" = "append",
): Promise<Workspace> {
  const response = await fetch("/api/inquiries", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ inquiries, mode }),
  });
  if (!response.ok) {
    throw new Error("保存に失敗しました");
  }
  return (await response.json()) as Workspace;
}

export async function apiDeleteInquiry(id: string): Promise<Workspace> {
  const response = await fetch(`/api/inquiries/${id}`, { method: "DELETE" });
  if (!response.ok) {
    throw new Error("削除に失敗しました");
  }
  return (await response.json()) as Workspace;
}

export async function apiSaveSettings(
  settings: Partial<WorkspaceSettings>,
  topics?: TopicDefinition[],
): Promise<Workspace> {
  const response = await fetch("/api/workspace", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ settings, topics }),
  });
  if (!response.ok) {
    throw new Error("設定の保存に失敗しました");
  }
  return (await response.json()) as Workspace;
}
