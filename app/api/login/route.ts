import { setAuthorizedCookie } from "@/lib/auth";
import { NextRequest } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as { pin?: string };
  const ok = await setAuthorizedCookie(body.pin ?? "");
  if (!ok) {
    return Response.json({ error: "invalid_pin" }, { status: 401 });
  }
  return Response.json({ ok: true });
}
