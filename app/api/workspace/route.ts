import { pinRequired } from "@/lib/auth";
import { requireAuth } from "@/lib/api-helpers";
import { saveSettings, readWorkspace } from "@/lib/store";
import type { TopicDefinition } from "@/lib/types";
import type { WorkspaceSettings } from "@/lib/workspace-types";
import { NextRequest } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const denied = await requireAuth();
  if (denied) {
    return Response.json(
      { error: "pin_required", pinRequired: pinRequired() },
      { status: 401 },
    );
  }
  const workspace = await readWorkspace();
  return Response.json(workspace);
}

export async function PATCH(request: NextRequest) {
  const denied = await requireAuth();
  if (denied) return denied;
  const body = (await request.json()) as {
    settings?: Partial<WorkspaceSettings>;
    topics?: TopicDefinition[];
  };
  const workspace = await saveSettings(body.settings ?? {}, body.topics);
  return Response.json(workspace);
}
