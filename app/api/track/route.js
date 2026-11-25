import { NextResponse } from 'next/server';
import { sb, hasDb } from '@/lib/supabase';
import { isUuid } from '@/lib/data';

export const dynamic = 'force-dynamic';

const bad = () => NextResponse.json({ ok: false }, { status: 400 });

export async function POST(req) {
  if (!hasDb()) return NextResponse.json({ ok: false }, { status: 503 });
  let b;
  try {
    b = await req.json();
  } catch {
    return bad();
  }
  const { sid, type, pid, tons } = b || {};
  if (typeof sid !== 'string' || !/^[A-Za-z0-9]{8,64}$/.test(sid)) return bad();
  if (!['visit', 'view', 'tg'].includes(type)) return bad();
  if (type !== 'visit' && !isUuid(pid)) return bad();
  let t = 0;
  if (type === 'tg') {
    // tons maydonida endi dona soni yoziladi (1 001 = "1 000 dan ko'p")
    t = Math.round(Number(tons));
    if (!Number.isFinite(t) || t < 1 || t > 100000) return bad();
  }
  const { error } = await sb()
    .from('events')
    .insert({ sid, type, product_id: type === 'visit' ? null : pid, tons: t });
  if (error) return NextResponse.json({ ok: false }, { status: 500 });
  return NextResponse.json({ ok: true });
}
