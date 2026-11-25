// Savat: brauzerda saqlanadi (sahifa yangilansa ham yo'qolmaydi)
const KEY = 'uc_cart';
export const MIN_Q = 10; // har bir mahsulotdan kamida
export const MAX_Q = 1000; // har bir mahsulotdan ko'pi bilan
export const STEP_Q = 10; // −/+ tugmasi qadami
export const MIN_KG = 500; // butun buyurtma kamida

let items = null;
const subs = new Set();

export const clampQ = (q) => Math.min(MAX_Q, Math.max(MIN_Q, Math.round(Number(q) || MIN_Q)));

function load() {
  if (items) return items;
  try {
    const v = JSON.parse(localStorage.getItem(KEY) || '[]');
    items = Array.isArray(v) ? v.filter((x) => x && x.id && x.p) : [];
  } catch {
    items = [];
  }
  return items;
}

function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify(items));
  } catch {}
  subs.forEach((f) => f());
}

export const getCart = () => (typeof window === 'undefined' ? [] : load());

export function subscribe(f) {
  subs.add(f);
  const onStorage = (e) => {
    if (e.key === KEY) {
      items = null;
      f();
    }
  };
  window.addEventListener('storage', onStorage);
  return () => {
    subs.delete(f);
    window.removeEventListener('storage', onStorage);
  };
}

const snap = (p) => ({
  id: p.id,
  cat: p.cat,
  name: p.name,
  price: Number(p.price) || 0,
  w: Number(p.w) || 0,
  size_label: p.size_label || {},
  img: p.img || '',
  v: p.v || 0,
  k: p.k,
  s: p.s,
});

export function addToCart(p, qty) {
  load();
  const i = items.findIndex((x) => x.id === p.id);
  if (i >= 0) items = items.map((x, j) => (j === i ? { ...x, p: snap(p), qty: clampQ(x.qty + qty) } : x));
  else items = [...items, { id: p.id, qty: clampQ(qty), p: snap(p) }];
  save();
}

export function setQty(id, q) {
  load();
  items = items.map((x) => (x.id === id ? { ...x, qty: clampQ(q) } : x));
  save();
}

export function removeItem(id) {
  load();
  items = items.filter((x) => x.id !== id);
  save();
}

export function clearCart() {
  items = [];
  save();
}

export const cartTotals = (list) =>
  list.reduce(
    (a, x) => ({ sum: a.sum + x.qty * x.p.price, kg: a.kg + x.qty * x.p.w, count: a.count + 1 }),
    { sum: 0, kg: 0, count: 0 }
  );

export const openCart = () => {
  window.dispatchEvent(new Event('uc:close-order'));
  window.dispatchEvent(new Event('uc:cart'));
};
