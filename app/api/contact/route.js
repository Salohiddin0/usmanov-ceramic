import { NextResponse } from 'next/server';
import { sb, hasDb } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

const clean = (v, max) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

export async function POST(req) {
  if (!hasDb()) return NextResponse.json({ error: 'Baza ulanmagan' }, { status: 503 });
  let b;
  try {
    b = await req.json();
  } catch {
    return NextResponse.json({ error: "Noto'g'ri so'rov" }, { status: 400 });
  }
  // Spam bot "website" maydonini to'ldiradi, odam ko'rmaydi
  if (b && b.website) return NextResponse.json({ ok: true });
  const name = clean(b?.name, 80);
  const email = clean(b?.email, 120);
  const phone = clean(b?.phone, 30);
  const message = clean(b?.message, 2000);
  const lang = ['uz', 'ru', 'en'].includes(b?.lang) ? b.lang : 'uz';
  if (!name || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !/^[+0-9 ()\-]{7,30}$/.test(phone)) {
    return NextResponse.json({ error: "Maydonlar to'liq emas" }, { status: 400 });
  }
  const { error } = await sb().from('messages').insert({ name, email, phone, message, lang });
  if (error) return NextResponse.json({ error: 'Saqlab bo\'lmadi' }, { status: 500 });
  return NextResponse.json({ ok: true });
}
