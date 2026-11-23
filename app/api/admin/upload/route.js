import crypto from 'node:crypto';
import { NextResponse } from 'next/server';
import { guard, jsonError } from '@/lib/auth';
import { sb } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

const TYPES = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' };

export async function POST(req) {
  const g = await guard();
  if (g) return g;
  let fd;
  try {
    fd = await req.formData();
  } catch {
    return jsonError('Fayl yuborilmadi');
  }
  const f = fd.get('file');
  const folder = String(fd.get('folder') || 'misc').replace(/[^a-z0-9-]/g, '').slice(0, 20) || 'misc';
  if (!f || typeof f === 'string') return jsonError('Fayl topilmadi');
  const ext = TYPES[f.type];
  if (!ext) return jsonError('Faqat JPG, PNG yoki WEBP rasm');
  if (f.size > 4 * 1024 * 1024) return jsonError('Rasm 4 MB dan katta');
  const path = `${folder}/${Date.now()}-${crypto.randomBytes(4).toString('hex')}.${ext}`;
  const buf = Buffer.from(await f.arrayBuffer());
  const { error } = await sb().storage.from('images').upload(path, buf, { contentType: f.type, cacheControl: '31536000', upsert: false });
  if (error) return jsonError(error.message, 500);
  const { data } = sb().storage.from('images').getPublicUrl(path);
  return NextResponse.json({ url: data.publicUrl });
}
