import { NextResponse } from 'next/server';
import { getSession, jsonError } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const s = await getSession();
    if (!s) return jsonError('Kirilmagan', 401);
    return NextResponse.json({ ok: true, user: s.u, def: s.def });
  } catch (e) {
    return jsonError(e.message || 'Server xatosi', 500);
  }
}
