import { requireAuth } from "@/lib/api-helpers";
import { removeInquiry } from "@/lib/store";
import { NextRequest } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function DELETE(
  _request: NextRequest,
  context: RouteContext<"/api/inquiries/[id]">,
) {
  const denied = await requireAuth();
  if (denied) return denied;
  const { id } = await context.params;
  const workspace = await removeInquiry(id);
  return Response.json(workspace);
}
