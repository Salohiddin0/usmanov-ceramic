import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { guard, jsonError } from '@/lib/auth';
import { sb } from '@/lib/supabase';
import { normalizeSettings } from '@/lib/data';
import { CATS, LANGS } from '@/lib/i18n';

export const dynamic = 'force-dynamic';

const str = (v, max) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
const img = (v) => (typeof v === 'string' && /^https:\/\//.test(v) ? v.slice(0, 600) : '');
const coord = (v, lim) => {
  if (v === null || v === '' || v === undefined) return null;
  const n = Number(v);
  return Number.isFinite(n) && Math.abs(n) <= lim ? n : null;
};

function cleanValue(key, v) {
  if (key === 'site') {
    const hrs = {};
    LANGS.forEach((l) => (hrs[l] = str(v?.hrs?.[l], 80)));
    return {
      tg: str(v?.tg, 64).replace(/^@/, '').replace(/^https?:\/\/t\.me\//, ''),
      wa: str(v?.wa, 30),
      phone: str(v?.phone, 40),
      email: str(v?.email, 120),
      fb: str(v?.fb, 200),
      ig: str(v?.ig, 200),
      addr: str(v?.addr, 200),
      lat: coord(v?.lat, 90),
      lng: coord(v?.lng, 180),
      hrs,
    };
  }
  if (key === 'cats') {
    const out = {};
    CATS.forEach((c) => {
      const o = v?.[c.id] || {};
      const name = {};
      const desc = {};
      LANGS.forEach((l) => {
        name[l] = str(o.name?.[l], 80);
        desc[l] = str(o.desc?.[l], 200);
      });
      out[c.id] = { img: img(o.img), name, desc };
    });
    return out;
  }
  if (key === 'rules') {
    const out = {};
    LANGS.forEach((l) => {
      out[l] = (Array.isArray(v?.[l]) ? v[l] : [])
        .slice(0, 30)
        .map((r) => [str(r?.[0], 120), str(r?.[1], 800)])
        .filter((r) => r[0]);
    });
    return out;
  }
  if (key === 'hero') return { url: img(v?.url) };
  return null;
}

export async function GET() {
  const g = await guard();
  if (g) return g;
  const { data, error } = await sb().from('settings').select('key,value');
  if (error) return jsonError(error.message, 500);
  const o = {};
  (data || []).forEach((r) => (o[r.key] = r.value));
  return NextResponse.json(normalizeSettings(o));
}

export async function POST(req) {
  const g = await guard();
  if (g) return g;
  let b;
  try {
    b = await req.json();
  } catch {
    return jsonError("Noto'g'ri so'rov");
  }
  const key = b?.key;
  const value = cleanValue(key, b?.value);
  if (!value) return jsonError("Noto'g'ri sozlama");
  const { error } = await sb().from('settings').upsert({ key, value, updated_at: new Date().toISOString() });
  if (error) return jsonError(error.message, 500);
  revalidatePath('/', 'layout');
  revalidatePath('/[lang]', 'layout');
  return NextResponse.json({ ok: true, value });
}
