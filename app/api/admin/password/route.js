import { NextResponse } from 'next/server';
import { checkLogin, getSession, hashPassword, jsonError, setSessionCookie } from '@/lib/auth';
import { sb } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    const s = await getSession();
    if (!s) return jsonError('Avval admin panelga kiring', 401);
    const b = await req.json();
    const cur = String(b?.current || '');
    const u = String(b?.username || '').trim();
    const p = String(b?.password || '');
    if (!(await checkLogin(s.u, cur))) return jsonError("Hozirgi parol noto'g'ri", 400);
    if (!/^[A-Za-z0-9_.-]{3,40}$/.test(u)) return jsonError("Login 3–40 belgi: harf, raqam, _ . -", 400);
    if (p.length < 8) return jsonError("Yangi parol kamida 8 belgi bo'lsin", 400);
    const pass_hash = hashPassword(p);
    const { error } = await sb().from('admin_users').upsert({ id: 1, username: u, pass_hash, updated_at: new Date().toISOString() });
    if (error) return jsonError(error.message, 500);
    return setSessionCookie(NextResponse.json({ ok: true }), { u, def: false, pv: pass_hash.slice(-16) });
  } catch (e) {
    return jsonError(e.message || 'Server xatosi', 500);
  }
}
