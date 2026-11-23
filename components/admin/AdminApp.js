'use client';
import { useCallback, useEffect, useState } from 'react';
import { api, post } from './api';
import { Mark } from '../Logo';
import StatsTab from './StatsTab';
import ProductsTab from './ProductsTab';
import CatalogsTab from './CatalogsTab';
import MessagesTab from './MessagesTab';
import { RulesSettings, SecuritySettings, SiteSettings } from './SettingsTab';

const TABS = [
  ['stats', 'Statistika'],
  ['prods', 'Mahsulotlar'],
  ['cats', 'Kataloglar'],
  ['msgs', 'Xabarlar'],
  ['sets', 'Sozlamalar'],
  ['rules', 'Shartnoma'],
  ['sec', 'Xavfsizlik'],
];

const setAdminFlag = (on) => {
  try {
    if (on) localStorage.setItem('uc_admin', '1');
    else localStorage.removeItem('uc_admin');
  } catch {}
};

function Login({ onOk }) {
  const [u, setU] = useState('');
  const [p, setP] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setErr('');
    try {
      await post('login', { u, p });
      setAdminFlag(true);
      onOk();
    } catch (x) {
      setErr(x.message);
      setP('');
    }
    setBusy(false);
  }

  return (
    <form className="login" onSubmit={submit}>
      <span className="logo">
        <Mark />
        <span className="lw">
          <b>Admin panel</b>
          <small>USMANOV CERAMIC</small>
        </span>
      </span>
      <label htmlFor="lu">Login</label>
      <input id="lu" autoComplete="username" required value={u} onChange={(e) => setU(e.target.value)} />
      <label htmlFor="pw">Parol</label>
      <input id="pw" type="password" autoComplete="current-password" required value={p} onChange={(e) => setP(e.target.value)} />
      <button className="btn pri" type="submit" disabled={busy}>
        Kirish
      </button>
      {err && <p className="err">{err}</p>}
      <a href="/" className="more">
        ← Saytga qaytish
      </a>
    </form>
  );
}

export default function AdminApp() {
  const [sess, setSess] = useState(undefined);
  const [tab, setTab] = useState('stats');
  const [unread, setUnread] = useState(0);

  const check = useCallback(() => {
    api('session')
      .then((s) => {
        setAdminFlag(true);
        setSess(s);
      })
      .catch(() => setSess(null));
  }, []);

  const refreshUnread = useCallback(() => {
    api('messages?unread=1')
      .then((j) => setUnread(j.unread || 0))
      .catch(() => {});
  }, []);

  useEffect(() => {
    check();
  }, [check]);

  useEffect(() => {
    if (sess) refreshUnread();
  }, [sess, refreshUnread]);

  async function logout() {
    try {
      await post('logout', {});
    } catch {}
    setAdminFlag(false);
    setSess(null);
  }

  if (sess === undefined)
    return (
      <div className="login">
        <p className="hint">Yuklanmoqda…</p>
      </div>
    );
  if (!sess) return <Login onOk={check} />;

  return (
    <div className="adm">
      <aside className="side">
        <span className="logo">
          <Mark />
          <span className="lw">
            <b>Usmanov</b>
            <small>CERAMIC</small>
          </span>
        </span>
        {TABS.map(([k, label]) => (
          <button key={k} aria-pressed={tab === k} onClick={() => setTab(k)}>
            {label}
            {k === 'msgs' && unread > 0 && <span className="badge">{unread}</span>}
          </button>
        ))}
        <a href="/" target="_blank" rel="noopener">
          ↗ Saytni ochish
        </a>
        <button onClick={logout}>Chiqish</button>
      </aside>
      <div className="am">
        {sess.def && tab !== 'sec' && (
          <p className="warn" style={{ marginBottom: 16 }}>
            Siz boshlang&apos;ich login va parol bilan kirdingiz.{' '}
            <button className="chip" onClick={() => setTab('sec')}>
              Hozir almashtirish
            </button>
          </p>
        )}
        {tab === 'stats' && <StatsTab />}
        {tab === 'prods' && <ProductsTab />}
        {tab === 'cats' && <CatalogsTab />}
        {tab === 'msgs' && <MessagesTab onChange={refreshUnread} />}
        {tab === 'sets' && <SiteSettings />}
        {tab === 'rules' && <RulesSettings />}
        {tab === 'sec' && <SecuritySettings user={sess.user} def={sess.def} onDone={check} />}
      </div>
    </div>
  );
}
