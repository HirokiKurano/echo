import { asInquiry, requireAuth } from "@/lib/api-helpers";
import { addInquiries, readWorkspace } from "@/lib/store";
import { NextRequest } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const denied = await requireAuth();
  if (denied) return denied;

  const body = (await request.json()) as {
    inquiries?: unknown[];
    mode?: "append" | "replace";
  };
  const current = await readWorkspace();
  const fallback = current.settings.defaultHandleMinutes;
  const inquiries = (body.inquiries ?? [])
    .map((item) => asInquiry(item, fallback))
    .filter((item) => item !== null);

  if (inquiries.length === 0) {
    return Response.json({ error: "empty" }, { status: 400 });
  }

  const workspace = await addInquiries(
    inquiries,
    body.mode === "replace" ? "replace" : "append",
  );
  return Response.json(workspace);
}
