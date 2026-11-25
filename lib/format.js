import { CATS, T } from './i18n';

// Raqamni 36 000 000 ko'rinishida chiqaradi (bo'shliq bo'linmaydi)
export const fmt = (n) => String(Math.round(Number(n) || 0)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
// O'nli kasr: uz/ru da vergul, en da nuqta
export const dec = (n, lang) => (lang === 'en' ? String(n) : String(n).replace('.', ','));

export const kindOf = (cat) => (cat === 'naborlar' ? 'p' : cat === 'piyolalar' || cat === 'choynaklar' ? 'v' : 'd');
export const pcs = (p, tons) => (tons * 1000) / (p.w || 1);
export const size = (p, t, lang) =>
  p.size_label?.[lang] || p.size_label?.uz || (p.k === 'd' ? `Ø ${p.s} ${t.cm}` : p.k === 'v' ? `${dec(p.s, lang)} ${t.l}` : `${p.s} ${t.pc}`);

// Dollar narxi: 7,5 / 2,59 / 4 090 (1000 dan katta bo'lsa butun son)
export const usd = (n, lang) => {
  const r = Math.round((Number(n) || 0) * 100) / 100;
  if (r >= 1000) return fmt(r);
  const s = r.toFixed(2).replace(/\.?0+$/, '');
  return lang === 'en' ? s : s.replace('.', ',');
};
// 1 tonna narxi = 1 dona narxi × 1 tonnadagi dona soni
export const tonPrice = (p) => (Number(p.price) || 0) * pcs(p, 1);
export const pname = (p, lang) => (p.name && (p.name[lang] || p.name.uz)) || '';

export const catOf = (id) => CATS.find((c) => c.id === id);
export const catName = (cats, c, lang) => cats?.[c.id]?.name?.[lang] || c.name[lang];
export const catDesc = (cats, c, lang) => cats?.[c.id]?.desc?.[lang] || c.desc[lang];
export const catImg = (cats, c) => cats?.[c.id]?.img || '';
export const rulesFor = (rules, lang) =>
  Array.isArray(rules?.[lang]) && rules[lang].length ? rules[lang] : T[lang].rules;

export const tgLink = (user, text) =>
  user ? `https://t.me/${encodeURIComponent(user)}${text ? `?text=${encodeURIComponent(text)}` : ''}` : '';
export const waLink = (num) => {
  const d = String(num || '').replace(/\D/g, '');
  return d ? `https://wa.me/${d}` : '';
};
export const fbLink = (v) => (!v ? '' : /^https:\/\//.test(v) ? v : `https://facebook.com/${encodeURIComponent(v)}`);
export const igLink = (v) => (!v ? '' : /^https:\/\//.test(v) ? v : `https://instagram.com/${encodeURIComponent(v)}`);
export const telLink = (v) => {
  const d = String(v || '').replace(/[^+\d]/g, '');
  return d ? `tel:${d}` : '';
};
export const hasMap = (site) => Number.isFinite(Number(site?.lat)) && Number.isFinite(Number(site?.lng)) && site.lat !== null && site.lng !== null;
export const safeImg = (u) => (typeof u === 'string' && (/^https:\/\//.test(u) || /^\/products\/[\w.-]+$/.test(u)) ? u : '');
