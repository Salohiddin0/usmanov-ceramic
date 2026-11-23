import { NextResponse } from 'next/server';
import { guard, jsonError } from '@/lib/auth';
import { sb } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

const today = () =>
  new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Tashkent', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
const addDays = (s, n) => {
  const d = new Date(`${s}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
};

export async function GET(req) {
  const g = await guard();
  if (g) return g;
  const q = Number(new URL(req.url).searchParams.get('days'));
  const days = [7, 14, 30, 90].includes(q) ? q : 7;
  const to = today();
  const from = addDays(to, -(days - 1));
  const pto = addDays(from, -1);
  const pfrom = addDays(from, -days);
  const [a, b, p] = await Promise.all([
    sb().rpc('uc_stats', { p_from: from, p_to: to }),
    sb().rpc('uc_stats', { p_from: pfrom, p_to: pto }),
    sb().from('products').select('id,name_uz,cat'),
  ]);
  const err = a.error || b.error || p.error;
  if (err) return jsonError(err.message, 500);
  return NextResponse.json({ days, from, to, cur: a.data, prev: b.data, products: p.data });
}
