// Brauzerda statistikani yuborish (tashrif, ko'rish, Telegram so'rov)
const isAdmin = () => {
  try {
    return localStorage.getItem('uc_admin') === '1';
  } catch {
    return false;
  }
};

export function sid() {
  try {
    let s = localStorage.getItem('uc_sid');
    if (!s || !/^[A-Za-z0-9]{8,64}$/.test(s)) {
      s = (crypto.randomUUID ? crypto.randomUUID().replace(/-/g, '') : Math.random().toString(36).slice(2) + Date.now().toString(36));
      localStorage.setItem('uc_sid', s);
    }
    return s;
  } catch {
    return 'anon' + Math.random().toString(36).slice(2, 12);
  }
}

export function track(type, pid, tons) {
  if (typeof window === 'undefined' || isAdmin()) return;
  const body = JSON.stringify({ sid: sid(), type, pid: pid || null, tons: tons || 0 });
  try {
    if (navigator.sendBeacon && navigator.sendBeacon('/api/track', new Blob([body], { type: 'application/json' }))) return;
  } catch {}
  fetch('/api/track', { method: 'POST', headers: { 'content-type': 'application/json' }, body, keepalive: true }).catch(() => {});
}

export function trackVisit() {
  if (typeof window === 'undefined' || isAdmin()) return;
  try {
    const d = new Date();
    const day = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
    if (localStorage.getItem('uc_vday') === day) return;
    localStorage.setItem('uc_vday', day);
  } catch {}
  track('visit');
}

export function toggleTheme() {
  const r = document.documentElement;
  const dark = r.dataset.theme ? r.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
  r.dataset.theme = dark ? 'light' : 'dark';
  try {
    localStorage.setItem('uc_th', r.dataset.theme);
  } catch {}
}
