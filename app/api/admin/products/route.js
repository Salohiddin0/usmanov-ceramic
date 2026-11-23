import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { guard, jsonError } from '@/lib/auth';
import { sb } from '@/lib/supabase';
import { isUuid } from '@/lib/data';
import { CATS } from '@/lib/i18n';

export const dynamic = 'force-dynamic';

const str = (v, max) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
const num = (v, min, max, def) => {
  const n = Number(v);
  return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : def;
};

export async function GET() {
  const g = await guard();
  if (g) return g;
  const { data, error } = await sb().from('products').select('*').order('sort').order('created_at');
  if (error) return jsonError(error.message, 500);
  return NextResponse.json({ items: data });
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
  const row = {
    cat: CATS.some((c) => c.id === b?.cat) ? b.cat : null,
    name_uz: str(b?.name_uz, 120),
    name_ru: str(b?.name_ru, 120),
    name_en: str(b?.name_en, 120),
    price: Math.round(num(b?.price, 0, 1e13, 0)),
    weight: num(b?.weight, 0.001, 1000, 1),
    size: num(b?.size, 0, 100000, 0),
    pattern: Math.round(num(b?.pattern, 0, 4, 0)),
    sort: Math.round(num(b?.sort, -100000, 100000, 0)),
    img: typeof b?.img === 'string' && /^https:\/\//.test(b.img) ? b.img.slice(0, 600) : '',
    active: b?.active !== false,
  };
  if (!row.cat) return jsonError("Katalog noto'g'ri");
  if (!row.name_uz) return jsonError('Mahsulot nomini (UZ) kiriting');

  let res;
  if (b?.id) {
    if (!isUuid(b.id)) return jsonError("Noto'g'ri ID");
    res = await sb().from('products').update(row).eq('id', b.id).select().single();
  } else {
    res = await sb().from('products').insert(row).select().single();
  }
  if (res.error) return jsonError(res.error.message, 500);
  revalidatePath('/', 'layout');
  revalidatePath('/[lang]', 'layout');
  return NextResponse.json({ item: res.data });
}

export async function DELETE(req) {
  const g = await guard();
  if (g) return g;
  const id = new URL(req.url).searchParams.get('id');
  if (!isUuid(id)) return jsonError("Noto'g'ri ID");
  const { error } = await sb().from('products').delete().eq('id', id);
  if (error) return jsonError(error.message, 500);
  revalidatePath('/', 'layout');
  revalidatePath('/[lang]', 'layout');
  return NextResponse.json({ ok: true });
}
