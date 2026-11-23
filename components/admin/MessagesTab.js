'use client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { api, del, fmtDate, patch } from './api';

export default function MessagesTab({ onChange }) {
  const [items, setItems] = useState(null);
  const [err, setErr] = useState('');
  const [q, setQ] = useState('');
  const [f, setF] = useState('all');
  const [ask, setAsk] = useState(null);

  const load = useCallback(async () => {
    try {
      setItems((await api('messages')).items);
    } catch (e) {
      setErr(e.message);
    }
  }, []);
  useEffect(() => {
    load();
  }, [load]);

  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    const digits = s.replace(/\D/g, '');
    return (items || []).filter(
      (m) =>
        (f === 'all' || (f === 'new' ? !m.read : m.read)) &&
        (!s ||
          [m.name, m.email, m.phone, m.message].join(' ').toLowerCase().includes(s) ||
          (digits.length > 3 && String(m.phone || '').replace(/\D/g, '').includes(digits)))
    );
  }, [items, q, f]);

  async function mark(m, read) {
    try {
      await patch('messages', { id: m.id, read });
      setItems((a) => a.map((x) => (x.id === m.id ? { ...x, read } : x)));
      onChange && onChange();
    } catch (e) {
      setErr(e.message);
    }
  }

  async function remove(m) {
    if (ask !== m.id) return setAsk(m.id);
    setAsk(null);
    try {
      await del(`messages?id=${m.id}`);
      setItems((a) => a.filter((x) => x.id !== m.id));
      onChange && onChange();
    } catch (e) {
      setErr(e.message);
    }
  }

  return (
    <>
      <h2>Xabarlar</h2>
      <p className="hint">Saytdagi «Aloqa» formasidan kelgan xabarlar.</p>
      {err && <p className="err">{err}</p>}
      <div className="mtools">
        <input placeholder="Ism, email, telefon yoki matn bo'yicha qidirish" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Qidirish" />
        <div className="acts">
          {[
            ['all', 'Barchasi'],
            ['new', "O'qilmagan"],
            ['read', "O'qilgan"],
          ].map(([k, label]) => (
            <button key={k} className="chip" aria-pressed={f === k} onClick={() => setF(k)}>
              {label}
            </button>
          ))}
          <button className="chip" onClick={load}>
            ↻
          </button>
        </div>
      </div>
      {!items ? (
        <p className="hint">Yuklanmoqda…</p>
      ) : (
        <>
          <p className="hint" style={{ marginBottom: 10 }}>
            {list.length} ta xabar{items.length !== list.length ? ` (jami ${items.length})` : ''}
          </p>
          {list.length === 0 && <div className="empty">Xabar topilmadi.</div>}
          {list.map((m) => (
            <div className={`msg ${m.read ? '' : 'new'}`} key={m.id}>
              <div className="mh">
                <b>{m.name}</b>
                <span className="hint">
                  {fmtDate(m.created_at)} · {String(m.lang || 'uz').toUpperCase()}
                </span>
              </div>
              <div className="mc">
                <a href={`mailto:${m.email}`}>{m.email}</a>
                <a href={`tel:${String(m.phone || '').replace(/[^+\d]/g, '')}`}>{m.phone}</a>
              </div>
              <p>{m.message}</p>
              <div className="acts" style={{ marginTop: 10 }}>
                {m.read ? <button onClick={() => mark(m, false)}>O&apos;qilmagan deb belgilash</button> : <button onClick={() => mark(m, true)}>O&apos;qildi</button>}
                <button className="del" onClick={() => remove(m)}>
                  {ask === m.id ? "Ha, o'chirish" : "O'chirish"}
                </button>
              </div>
            </div>
          ))}
        </>
      )}
    </>
  );
}
