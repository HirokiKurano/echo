import { cookies } from "next/headers";

const COOKIE = "echo_gate";

export function configuredPin(): string {
  return process.env.ECHO_ACCESS_PIN?.trim() ?? "";
}

export function pinRequired(): boolean {
  return configuredPin().length > 0;
}

export async function isAuthorized(): Promise<boolean> {
  const expected = configuredPin();
  if (!expected) return true;
  const jar = await cookies();
  return jar.get(COOKIE)?.value === expected;
}

export async function setAuthorizedCookie(pin: string): Promise<boolean> {
  const expected = configuredPin();
  if (!expected) return true;
  if (pin !== expected) return false;
  const jar = await cookies();
  jar.set(COOKIE, expected, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return true;
}
