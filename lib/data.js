// Serverda saytga ma'lumot olish (mahsulotlar va sozlamalar)
import { cache } from 'react';
import { sb, hasDb } from './supabase';
import { kindOf } from './format';
import { DEFAULT_SITE } from './i18n';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export const isUuid = (v) => typeof v === 'string' && UUID.test(v);

export function mapProduct(r) {
  return {
    id: r.id,
    cat: r.cat,
    name: { uz: r.name_uz, ru: r.name_ru || r.name_uz, en: r.name_en || r.name_uz },
    price: Number(r.price) || 0,
    w: Number(r.weight) || 1,
    s: Number(r.size) || 0,
    v: Number(r.pattern) || 0,
    img: r.img || '',
    on: r.active !== false,
    k: kindOf(r.cat),
    sort: r.sort || 0,
  };
}

export const getProducts = cache(async () => {
  if (!hasDb()) return [];
  try {
    const { data, error } = await sb()
      .from('products')
      .select('*')
      .eq('active', true)
      .order('sort', { ascending: true })
      .order('created_at', { ascending: true });
    if (error) throw error;
    return (data || []).map(mapProduct);
  } catch (e) {
    console.error('getProducts:', e.message);
    return [];
  }
});

export const getProduct = cache(async (id) => {
  if (!hasDb() || !isUuid(id)) return null;
  try {
    const { data, error } = await sb().from('products').select('*').eq('id', id).eq('active', true).maybeSingle();
    if (error) throw error;
    return data ? mapProduct(data) : null;
  } catch (e) {
    console.error('getProduct:', e.message);
    return null;
  }
});

export function normalizeSettings(o = {}) {
  const site = { ...DEFAULT_SITE, ...(o.site || {}) };
  site.hrs = { ...DEFAULT_SITE.hrs, ...((o.site && o.site.hrs) || {}) };
  if (site.lat === '' || site.lat === undefined) site.lat = null;
  if (site.lng === '' || site.lng === undefined) site.lng = null;
  return {
    site,
    cats: o.cats || {},
    rules: o.rules || {},
    hero: (o.hero && o.hero.url) || '',
  };
}

export const getSettings = cache(async () => {
  if (!hasDb()) return normalizeSettings({});
  try {
    const { data, error } = await sb().from('settings').select('key,value');
    if (error) throw error;
    const o = {};
    (data || []).forEach((r) => {
      o[r.key] = r.value;
    });
    return normalizeSettings(o);
  } catch (e) {
    console.error('getSettings:', e.message);
    return normalizeSettings({});
  }
});
