import { createHash, timingSafeEqual } from "node:crypto";

import { cookies } from "next/headers";

export const adminSessionCookieName = "becoming_bensons_admin";

const defaultAdminPassword = "SholaBenson123@";
const sessionDuration = 60 * 60 * 8;

function getCookieOptions(path: string, maxAge: number) {
  return {
    httpOnly: true,
    sameSite: "strict" as const,
    secure: process.env.NODE_ENV === "production",
    path,
    maxAge,
  };
}

function getAdminPassword() {
  return process.env.ADMIN_PASSWORD ?? defaultAdminPassword;
}

function getAdminSecret() {
  return process.env.ADMIN_SESSION_SECRET ?? getAdminPassword();
}

function createSessionToken() {
  return createHash("sha256")
    .update(`${getAdminSecret()}:${getAdminPassword()}`)
    .digest("hex");
}

export function isValidAdminPassword(password: string) {
  const expected = Buffer.from(getAdminPassword());
  const incoming = Buffer.from(password);

  if (expected.length !== incoming.length) {
    return false;
  }

  return timingSafeEqual(expected, incoming);
}

export async function getPasswordAdminUser() {
  const cookieStore = await cookies();
  const sessionTokens = cookieStore
    .getAll(adminSessionCookieName)
    .map((cookie) => cookie.value);
  const validToken = createSessionToken();

  if (!sessionTokens.includes(validToken)) {
    return null;
  }

  return {
    email: "admin@becomingthebensons.local",
  };
}

export async function setPasswordAdminSession() {
  const cookieStore = await cookies();
  cookieStore.set(adminSessionCookieName, "", getCookieOptions("/admin", 0));

  cookieStore.set(
    adminSessionCookieName,
    createSessionToken(),
    getCookieOptions("/", sessionDuration),
  );
}

export async function clearPasswordAdminSession() {
  const cookieStore = await cookies();

  cookieStore.set(adminSessionCookieName, "", getCookieOptions("/", 0));
  cookieStore.set(adminSessionCookieName, "", getCookieOptions("/admin", 0));
}
