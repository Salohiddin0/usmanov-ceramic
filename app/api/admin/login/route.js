import { NextResponse } from 'next/server';
import { checkLogin, jsonError, setSessionCookie } from '@/lib/auth';
import { hasDb } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

// Oddiy himoya: bitta IP'dan ko'p noto'g'ri urinishni sekinlatadi
const tries = new Map();
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export async function POST(req) {
  if (!hasDb()) return jsonError('Supabase sozlanmagan (SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)', 500);
  const ip = (req.headers.get('x-forwarded-for') || 'x').split(',')[0].trim();
  const rec = tries.get(ip) || { n: 0, at: 0 };
  if (rec.n >= 8 && Date.now() - rec.at < 10 * 60 * 1000) return jsonError("Ko'p urinish. 10 daqiqadan keyin qayta urining.", 429);

  let b;
  try {
    b = await req.json();
  } catch {
    return jsonError("Noto'g'ri so'rov");
  }
  try {
    const s = await checkLogin(String(b?.u || '').trim(), String(b?.p || ''));
    if (!s) {
      tries.set(ip, { n: rec.n + 1, at: Date.now() });
      await sleep(600);
      return jsonError("Login yoki parol noto'g'ri", 401);
    }
    tries.delete(ip);
    return setSessionCookie(NextResponse.json({ ok: true, user: s.u, def: s.def }), s);
  } catch (e) {
    return jsonError(e.message || 'Server xatosi', 500);
  }
}
