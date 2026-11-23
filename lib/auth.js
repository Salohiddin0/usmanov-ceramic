// Admin panel himoyasi: parol xeshi va imzolangan cookie sessiyasi. Faqat serverda.
import crypto from 'node:crypto';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { sb, hasDb } from './supabase';

export const COOKIE = 'uc_admin';
const MAX_AGE = 60 * 60 * 24 * 7; // 7 kun
const DEFAULT_USER = 'admin';
const DEFAULT_PASS = 'admin123';

const secret = () => {
  const s = process.env.ADMIN_SECRET || '';
  if (s.length < 32) throw new Error('ADMIN_SECRET sozlanmagan yoki juda qisqa (kamida 32 belgi)');
  return s;
};

export function hashPassword(pw) {
  const salt = crypto.randomBytes(16).toString('hex');
  const h = crypto.scryptSync(String(pw), salt, 64).toString('hex');
  return `scrypt$${salt}$${h}`;
}

export function verifyPassword(pw, stored) {
  const [kind, salt, h] = String(stored || '').split('$');
  if (kind !== 'scrypt' || !salt || !h) return false;
  const a = crypto.scryptSync(String(pw), salt, 64);
  const b = Buffer.from(h, 'hex');
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

const b64 = (buf) => Buffer.from(buf).toString('base64url');
const sign = (data) => crypto.createHmac('sha256', secret()).update(data).digest('base64url');

export function makeToken(payload) {
  const body = b64(JSON.stringify({ ...payload, exp: Date.now() + MAX_AGE * 1000 }));
  return `${body}.${sign(body)}`;
}

function readToken(token) {
  if (!token || typeof token !== 'string' || !token.includes('.')) return null;
  const [body, sig] = token.split('.');
  const good = sign(body);
  if (!sig || sig.length !== good.length || !crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(good))) return null;
  try {
    const p = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
    return p.exp > Date.now() ? p : null;
  } catch {
    return null;
  }
}

export async function getAdminRow() {
  const { data, error } = await sb().from('admin_users').select('username,pass_hash').eq('id', 1).maybeSingle();
  if (error) throw error;
  return data;
}

// Login tekshiruvi. Bazada admin yo'q bo'lsa, boshlang'ich admin/admin123 ishlaydi.
export async function checkLogin(u, p) {
  const row = await getAdminRow();
  if (!row) return u === DEFAULT_USER && p === DEFAULT_PASS ? { u: DEFAULT_USER, def: true, pv: 'default' } : null;
  if (u !== row.username || !verifyPassword(p, row.pass_hash)) return null;
  return { u: row.username, def: false, pv: row.pass_hash.slice(-16) };
}

export async function getSession() {
  if (!hasDb()) return null;
  let p;
  try {
    const store = await cookies();
    p = readToken(store.get(COOKIE)?.value);
  } catch {
    return null;
  }
  if (!p) return null;
  // Parol o'zgarganda eski sessiyalar bekor bo'ladi
  const row = await getAdminRow();
  const pv = row ? row.pass_hash.slice(-16) : 'default';
  if (p.pv !== pv) return null;
  return { u: p.u, def: !row };
}

export function setSessionCookie(res, payload) {
  res.cookies.set(COOKIE, makeToken(payload), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: MAX_AGE,
  });
  return res;
}

export function clearSessionCookie(res) {
  res.cookies.set(COOKIE, '', { httpOnly: true, path: '/', maxAge: 0 });
  return res;
}

export const jsonError = (msg, status = 400) => NextResponse.json({ error: msg }, { status });

// Admin API'larda: sessiya bo'lmasa 401 qaytaradi
export async function guard() {
  try {
    const s = await getSession();
    return s ? null : jsonError('Avval admin panelga kiring', 401);
  } catch (e) {
    return jsonError(e.message || 'Server xatosi', 500);
  }
}
