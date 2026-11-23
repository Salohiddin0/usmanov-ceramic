import { CATS, T } from './i18n';

// Raqamni 36 000 000 ko'rinishida chiqaradi (bo'shliq bo'linmaydi)
export const fmt = (n) => String(Math.round(Number(n) || 0)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
// O'nli kasr: uz/ru da vergul, en da nuqta
export const dec = (n, lang) => (lang === 'en' ? String(n) : String(n).replace('.', ','));

export const kindOf = (cat) => (cat === 'naborlar' ? 'p' : cat === 'piyolalar' || cat === 'choynaklar' ? 'v' : 'd');
export const pcs = (p, tons) => (tons * 1000) / (p.w || 1);
export const size = (p, t, lang) =>
  p.k === 'd' ? `Ø ${p.s} ${t.cm}` : p.k === 'v' ? `${dec(p.s, lang)} ${t.l}` : `${p.s} ${t.pc}`;
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
export const safeImg = (u) => (typeof u === 'string' && /^https:\/\//.test(u) ? u : '');
