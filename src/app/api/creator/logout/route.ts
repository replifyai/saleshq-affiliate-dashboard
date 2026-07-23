import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { clearAuthCookies } from '@/lib/server/backend';

// The token cookies are httpOnly, so only the server can clear them.
export async function POST() {
  const jar = await cookies();
  clearAuthCookies(jar);
  return NextResponse.json({ success: true });
}
