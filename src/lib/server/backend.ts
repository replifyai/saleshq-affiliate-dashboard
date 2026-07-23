import { cookies } from 'next/headers';

// Central server-side auth for the creator BFF. The creator's Cognito tokens live
// ONLY in httpOnly cookies — never handed to page JS — so an XSS bug can't read
// them. Route handlers call the backend through authedBackendFetch, which reads
// the idToken cookie, and on 401/403 transparently refreshes with the refreshToken
// cookie, persists fresh httpOnly cookies, and retries once.

const BACKEND_URL =
  process.env.FIREBASE_FUNCTION_URL ||
  'https://14cgqud3x9.execute-api.ap-south-1.amazonaws.com/api';

const WEEK = 60 * 60 * 24 * 7;

export const AUTH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: WEEK,
};

type CookieJar = Awaited<ReturnType<typeof cookies>>;

export function setAuthCookies(jar: CookieJar, idToken: string, refreshToken: string) {
  jar.set('idToken', idToken, AUTH_COOKIE_OPTIONS);
  jar.set('refreshToken', refreshToken, AUTH_COOKIE_OPTIONS);
}

export function clearAuthCookies(jar: CookieJar) {
  jar.set('idToken', '', { ...AUTH_COOKIE_OPTIONS, maxAge: 0 });
  jar.set('refreshToken', '', { ...AUTH_COOKIE_OPTIONS, maxAge: 0 });
}

async function refreshTokens(
  refreshToken: string,
): Promise<{ idToken: string; refreshToken: string } | null> {
  try {
    const r = await fetch(`${BACKEND_URL}/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${refreshToken}` },
      body: '{}',
      cache: 'no-store',
    });
    if (!r.ok) return null;
    const d = (await r.json()) as { idToken?: string; refreshToken?: string };
    return d?.idToken ? { idToken: d.idToken, refreshToken: d.refreshToken || refreshToken } : null;
  } catch {
    return null;
  }
}

/**
 * Authenticated server->backend fetch. ONLY call from Route Handlers / Server
 * Actions (it needs a writable cookie jar to persist refreshed tokens).
 * Returns the raw Response; a 401 means genuinely unauthenticated (refresh also
 * failed) — the caller should surface 401 so the client redirects to /login.
 */
export async function authedBackendFetch(
  endpoint: string,
  init: RequestInit = {},
): Promise<Response> {
  const jar = await cookies();
  const idToken = jar.get('idToken')?.value;
  const refreshToken = jar.get('refreshToken')?.value;

  if (!idToken && !refreshToken) {
    return new Response(JSON.stringify({ error: 'Not authenticated' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const call = (token: string) =>
    fetch(`${BACKEND_URL}${endpoint}`, {
      ...init,
      headers: { 'Content-Type': 'application/json', ...(init.headers || {}), Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });

  let res = idToken ? await call(idToken) : new Response(null, { status: 401 });

  if ((res.status === 401 || res.status === 403) && refreshToken) {
    const refreshed = await refreshTokens(refreshToken);
    if (refreshed) {
      setAuthCookies(jar, refreshed.idToken, refreshed.refreshToken);
      res = await call(refreshed.idToken);
    } else {
      clearAuthCookies(jar);
    }
  }

  return res;
}
