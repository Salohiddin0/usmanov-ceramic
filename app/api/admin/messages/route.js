import { NextResponse } from 'next/server';
import { guard, jsonError } from '@/lib/auth';
import { sb } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

const idOf = (v) => (/^\d{1,18}$/.test(String(v)) ? String(v) : null);

export async function GET(req) {
  const g = await guard();
  if (g) return g;
  const url = new URL(req.url);
  if (url.searchParams.get('unread')) {
    const { count, error } = await sb().from('messages').select('id', { count: 'exact', head: true }).eq('read', false);
    if (error) return jsonError(error.message, 500);
    return NextResponse.json({ unread: count || 0 });
  }
  const { data, error } = await sb().from('messages').select('*').order('created_at', { ascending: false }).limit(1000);
  if (error) return jsonError(error.message, 500);
  return NextResponse.json({ items: data });
}

export async function PATCH(req) {
  const g = await guard();
  if (g) return g;
  const b = await req.json().catch(() => null);
  const id = idOf(b?.id);
  if (!id) return jsonError("Noto'g'ri ID");
  const { error } = await sb().from('messages').update({ read: !!b.read }).eq('id', id);
  if (error) return jsonError(error.message, 500);
  return NextResponse.json({ ok: true });
}

export async function DELETE(req) {
  const g = await guard();
  if (g) return g;
  const id = idOf(new URL(req.url).searchParams.get('id'));
  if (!id) return jsonError("Noto'g'ri ID");
  const { error } = await sb().from('messages').delete().eq('id', id);
  if (error) return jsonError(error.message, 500);
  return NextResponse.json({ ok: true });
}
