'use client';
import { useEffect, useState } from 'react';
import { api, post } from './api';
import { LANGS, T } from '@/lib/i18n';

const FIELDS = [
  ['tg', 'Telegram username (admin lichkasi, @ siz)', 'usmanov_ceramic'],
  ['wa', 'WhatsApp raqami', '998901234567'],
  ['phone', "Telefon (saytda ko'rinadi)", '+998 90 123 45 67'],
  ['email', 'Email (mijozlar shu manzilga yozadi)', 'info@usmanovceramic.uz'],
  ['fb', 'Facebook sahifa nomi yoki havolasi', 'usmanovceramic'],
  ['ig', 'Instagram nomi yoki havolasi', 'usmanovceramic'],
  ['addr', 'Manzil', "Farg'ona viloyati, Rishton tumani, ..."],
];

// Google yoki Yandex xarita havolasidan koordinatalarni ajratadi
function parseMapLink(v) {
  let m = v.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/) || v.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/) || v.match(/[?&](?:q|query|destination)=(-?\d+\.\d+),\s*(-?\d+\.\d+)/);
  if (m) return [Number(m[1]), Number(m[2])];
  m = v.match(/[?&](?:pt|ll|whatshere%5Bpoint%5D|whatshere\[point\])=(-?\d+\.\d+)(?:,|%2C)(-?\d+\.\d+)/);
  if (m) return [Number(m[2]), Number(m[1])]; // Yandex: uzunlik, kenglik
  return null;
}

export function SiteSettings() {
  const [v, setV] = useState(null);
  const [err, setErr] = useState('');
  const [msg, setMsg] = useState('');
  const [link, setLink] = useState('');

  useEffect(() => {
    api('settings')
      .then((s) => setV({ ...s.site, lat: s.site.lat ?? '', lng: s.site.lng ?? '' }))
      .catch((e) => setErr(e.message));
  }, []);

  if (err) return <p className="err">{err}</p>;
  if (!v) return <p className="hint">Yuklanmoqda…</p>;
  const set = (k, val) => setV((o) => ({ ...o, [k]: val }));

  async function save(e) {
    e.preventDefault();
    setMsg('Saqlanmoqda…');
    try {
      const r = await post('settings', { key: 'site', value: v });
      setV({ ...r.value, lat: r.value.lat ?? '', lng: r.value.lng ?? '' });
      setMsg("Saqlandi. Saytda bir necha soniyada ko'rinadi.");
    } catch (x) {
      setMsg("Saqlab bo'lmadi: " + x.message);
    }
  }

  return (
    <>
      <h2>Sozlamalar</h2>
      <p className="hint">Bo&apos;sh qoldirilgan kontakt saytda ko&apos;rsatilmaydi.</p>
      <form className="panel pform" style={{ marginTop: 14 }} onSubmit={save}>
        {FIELDS.map(([k, label, ph]) => (
          <div key={k}>
            <label htmlFor={`s-${k}`}>{label}</label>
            <input id={`s-${k}`} value={v[k] || ''} placeholder={ph} onChange={(e) => set(k, e.target.value)} />
          </div>
        ))}
        {LANGS.map((l) => (
          <div key={l}>
            <label htmlFor={`s-h-${l}`}>Ish vaqti ({l.toUpperCase()})</label>
            <input id={`s-h-${l}`} value={v.hrs?.[l] || ''} onChange={(e) => set('hrs', { ...v.hrs, [l]: e.target.value })} />
          </div>
        ))}
        <div className="full">
          <h4 style={{ margin: '10px 0 6px' }}>Xarita joylashuvi</h4>
          <p className="hint">
            Google Maps yoki Yandex xaritada ofisingizni toping, havolasini nusxalab shu yerga qo&apos;ying. Koordinatalar o&apos;zi olinadi. Yoki kenglik va uzunlikni qo&apos;lda kiriting.
          </p>
        </div>
        <div className="full">
          <label htmlFor="s-link">Xarita havolasi</label>
          <input
            id="s-link"
            value={link}
            placeholder="https://www.google.com/maps/place/...@40.35,71.28,17z"
            onChange={(e) => {
              setLink(e.target.value);
              const c = parseMapLink(e.target.value);
              if (c) setV((o) => ({ ...o, lat: c[0], lng: c[1] }));
            }}
          />
        </div>
        <div>
          <label htmlFor="s-lat">Kenglik (lat)</label>
          <input id="s-lat" type="number" step="any" value={v.lat} onChange={(e) => set('lat', e.target.value)} />
        </div>
        <div>
          <label htmlFor="s-lng">Uzunlik (lng)</label>
          <input id="s-lng" type="number" step="any" value={v.lng} onChange={(e) => set('lng', e.target.value)} />
        </div>
        <div className="full acts">
          <button className="btn pri sm" type="submit">
            Saqlash
          </button>
          <span className="hint" aria-live="polite">
            {msg}
          </span>
        </div>
      </form>
    </>
  );
}

export function RulesSettings() {
  const [v, setV] = useState(null);
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  useEffect(() => {
    api('settings')
      .then((s) => {
        const o = {};
        LANGS.forEach((l) => {
          const r = Array.isArray(s.rules?.[l]) && s.rules[l].length ? s.rules[l] : T[l].rules;
          o[l] = r.map((x) => `${x[0]} | ${x[1]}`).join('\n');
        });
        setV(o);
      })
      .catch((e) => setErr(e.message));
  }, []);

  if (err) return <p className="err">{err}</p>;
  if (!v) return <p className="hint">Yuklanmoqda…</p>;

  async function save(e) {
    e.preventDefault();
    const value = {};
    LANGS.forEach((l) => {
      value[l] = v[l]
        .split('\n')
        .map((line) => line.split('|'))
        .filter((x) => x[0].trim())
        .map((x) => [x[0].trim(), x.slice(1).join('|').trim()]);
    });
    setMsg('Saqlanmoqda…');
    try {
      await post('settings', { key: 'rules', value });
      setMsg('Saqlandi');
    } catch (x) {
      setMsg("Saqlab bo'lmadi: " + x.message);
    }
  }

  return (
    <>
      <h2>Shartnoma shartlari</h2>
      <p className="hint">
        Har bir qatorda bitta qoida: <b>Sarlavha | matn</b>
      </p>
      <form className="panel" style={{ marginTop: 12, display: 'grid', gap: 12 }} onSubmit={save}>
        {LANGS.map((l) => (
          <div key={l}>
            <label htmlFor={`r-${l}`}>{l.toUpperCase()}</label>
            <textarea id={`r-${l}`} style={{ minHeight: 200 }} value={v[l]} onChange={(e) => setV((o) => ({ ...o, [l]: e.target.value }))} />
          </div>
        ))}
        <div className="acts">
          <button className="btn pri sm" type="submit">
            Saqlash
          </button>
          <span className="hint" aria-live="polite">
            {msg}
          </span>
        </div>
      </form>
    </>
  );
}

export function SecuritySettings({ user, def, onDone }) {
  const [f, setF] = useState({ current: '', username: user || 'admin', password: '', password2: '' });
  const [msg, setMsg] = useState('');
  const set = (k, v) => setF((o) => ({ ...o, [k]: v }));

  async function save(e) {
    e.preventDefault();
    if (f.password !== f.password2) return setMsg('Yangi parollar bir xil emas');
    setMsg('Saqlanmoqda…');
    try {
      await post('password', { current: f.current, username: f.username, password: f.password });
      setF({ current: '', username: f.username, password: '', password2: '' });
      setMsg('Login va parol yangilandi');
      onDone && onDone();
    } catch (x) {
      setMsg(x.message);
    }
  }

  return (
    <>
      <h2>Xavfsizlik</h2>
      {def && <p className="warn">Hozir boshlang&apos;ich login va parol ishlatilmoqda. Ularni darhol almashtiring.</p>}
      <form className="panel pform" style={{ marginTop: 14, maxWidth: 760 }} onSubmit={save}>
        <div className="full">
          <label htmlFor="sc-old">Hozirgi parol</label>
          <input id="sc-old" type="password" autoComplete="current-password" required value={f.current} onChange={(e) => set('current', e.target.value)} />
        </div>
        <div className="full">
          <label htmlFor="sc-u">Yangi login</label>
          <input id="sc-u" autoComplete="username" required minLength={3} value={f.username} onChange={(e) => set('username', e.target.value)} />
        </div>
        <div>
          <label htmlFor="sc-p1">Yangi parol (kamida 8 belgi)</label>
          <input id="sc-p1" type="password" autoComplete="new-password" required minLength={8} value={f.password} onChange={(e) => set('password', e.target.value)} />
        </div>
        <div>
          <label htmlFor="sc-p2">Yangi parolni takrorlang</label>
          <input id="sc-p2" type="password" autoComplete="new-password" required minLength={8} value={f.password2} onChange={(e) => set('password2', e.target.value)} />
        </div>
        <div className="full acts">
          <button className="btn pri sm" type="submit">
            Saqlash
          </button>
          <span className="hint" aria-live="polite">
            {msg}
          </span>
        </div>
      </form>
      <p className="hint" style={{ marginTop: 12 }}>
        Parol o&apos;zgarganda boshqa qurilmalardagi admin sessiyalari avtomatik yopiladi.
      </p>
    </>
  );
}
