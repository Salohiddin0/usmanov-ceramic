'use client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { api, del, post } from './api';
import ImageUpload from './ImageUpload';
import { CATS } from '@/lib/i18n';
import { art } from '@/lib/art';
import { fmt, usd } from '@/lib/format';

const empty = (cat, sort) => ({ cat, name_uz: '', name_ru: '', name_en: '', price: '', box_qty: '', box_kg: '', size_label: { uz: '', ru: '', en: '' }, pattern: 0, img: '', active: true, sort });
const perPiece = (p) => (Number(p.box_qty) > 0 && Number(p.box_kg) > 0 ? Number(p.box_kg) / Number(p.box_qty) : Number(p.weight) || 0);
const perTon = (p) => (perPiece(p) > 0 ? 1000 / perPiece(p) : 0);

function Thumb({ p }) {
  if (p.img) return <img src={p.img} alt="" />;
  const kind = CATS.find((c) => c.id === p.cat)?.art || 'plate';
  return <span style={{ display: 'contents' }} dangerouslySetInnerHTML={{ __html: art(kind, p.pattern) }} />;
}

export default function ProductsTab() {
  const [items, setItems] = useState(null);
  const [err, setErr] = useState('');
  const [edit, setEdit] = useState(null);
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('');
  const [ask, setAsk] = useState(null);

  const load = useCallback(async () => {
    try {
      setItems((await api('products')).items);
    } catch (e) {
      setErr(e.message);
    }
  }, []);
  useEffect(() => {
    load();
  }, [load]);

  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    return (items || []).filter((p) => (!cat || p.cat === cat) && (!s || [p.name_uz, p.name_ru, p.name_en].join(' ').toLowerCase().includes(s)));
  }, [items, q, cat]);

  const set = (k, v) => setEdit((e) => ({ ...e, [k]: v }));

  async function save(e) {
    e.preventDefault();
    setBusy(true);
    setMsg('');
    try {
      await post('products', edit);
      setEdit(null);
      await load();
    } catch (x) {
      setMsg(x.message);
    }
    setBusy(false);
  }

  async function toggle(p) {
    try {
      await post('products', { ...p, active: !p.active });
      await load();
    } catch (x) {
      setErr(x.message);
    }
  }

  async function remove(p) {
    if (ask !== p.id) return setAsk(p.id);
    setAsk(null);
    try {
      await del(`products?id=${p.id}`);
      await load();
    } catch (x) {
      setErr(x.message);
    }
  }

  const setSize = (l, v) => setEdit((e) => ({ ...e, size_label: { ...(e.size_label || {}), [l]: v } }));

  return (
    <>
      <div className="ah">
        <h2>Mahsulotlar</h2>
        <button
          className="btn sm"
          onClick={() => {
            setMsg('');
            setEdit(empty(cat || 'tovoqlar', (items || []).length));
          }}
        >
          + Mahsulot qo&apos;shish
        </button>
      </div>
      <p className="hint">{items ? `${items.length} ta mahsulot.` : ''} O&apos;zgarishlar saytda bir necha soniyada ko&apos;rinadi.</p>
      {err && <p className="err">{err}</p>}

      {edit && (
        <div className="panel w" style={{ margin: '14px 0' }}>
          <h4>{edit.id ? 'Mahsulotni tahrirlash' : 'Yangi mahsulot'}</h4>
          <form className="pform" onSubmit={save}>
            <div className="full">
              <ImageUpload value={edit.img} folder="products" label="Mahsulot rasmini yuklash" onChange={(url) => set('img', url)} />
            </div>
            <div>
              <label htmlFor="pf-uz">Nomi (UZ)</label>
              <input id="pf-uz" value={edit.name_uz} onChange={(e) => set('name_uz', e.target.value)} required maxLength={120} />
            </div>
            <div>
              <label htmlFor="pf-ru">Nomi (RU)</label>
              <input id="pf-ru" value={edit.name_ru} onChange={(e) => set('name_ru', e.target.value)} maxLength={120} />
            </div>
            <div>
              <label htmlFor="pf-en">Nomi (EN)</label>
              <input id="pf-en" value={edit.name_en} onChange={(e) => set('name_en', e.target.value)} maxLength={120} />
            </div>
            <div>
              <label htmlFor="pf-cat">Katalog</label>
              <select id="pf-cat" value={edit.cat} onChange={(e) => set('cat', e.target.value)}>
                {CATS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name.uz}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="pf-pr">Narx, $ / 1 dona</label>
              <input id="pf-pr" type="number" min="0" step="0.01" value={edit.price} onChange={(e) => set('price', e.target.value)} required />
            </div>
            <div>
              <label htmlFor="pf-q">Qutida necha dona</label>
              <input id="pf-q" type="number" min="1" step="1" value={edit.box_qty} onChange={(e) => set('box_qty', e.target.value)} required />
            </div>
            <div>
              <label htmlFor="pf-kg">Quti og&apos;irligi (brutto), kg</label>
              <input id="pf-kg" type="number" min="0.01" step="0.01" value={edit.box_kg} onChange={(e) => set('box_kg', e.target.value)} required />
            </div>
            {['uz', 'ru', 'en'].map((l) => (
              <div key={l}>
                <label htmlFor={`pf-s-${l}`}>O&apos;lcham ({l.toUpperCase()}), masalan {l === 'uz' ? '42 sm' : l === 'ru' ? '42 см' : '42 cm'}</label>
                <input id={`pf-s-${l}`} value={edit.size_label?.[l] || ''} onChange={(e) => setSize(l, e.target.value)} maxLength={60} />
              </div>
            ))}
            <div className="full hint">
              {perTon(edit) > 0
                ? `1 dona ≈ ${perPiece(edit).toFixed(2)} kg · 1 tonnada ≈ ${fmt(perTon(edit))} dona · 1 tonna narxi ≈ ${fmt(perTon(edit) * (Number(edit.price) || 0))} $`
                : "Narx, qutidagi soni va brutto kiritilsa, 1 tonna narxi shu yerda hisoblanadi."}
            </div>
            <div>
              <label htmlFor="pf-o">Tartib raqami (kichigi oldin)</label>
              <input id="pf-o" type="number" step="1" value={edit.sort} onChange={(e) => set('sort', e.target.value)} />
            </div>
            <div>
              <label htmlFor="pf-v">Rasm bo&apos;lmasa: naqsh rangi (0–4)</label>
              <input id="pf-v" type="number" min="0" max="4" value={edit.pattern} onChange={(e) => set('pattern', e.target.value)} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, minHeight: 48 }}>
              <input id="pf-a" type="checkbox" checked={edit.active} onChange={(e) => set('active', e.target.checked)} style={{ width: 22, height: 22 }} />
              <label htmlFor="pf-a">Saytda ko&apos;rsatilsin</label>
            </div>
            <div className="full acts">
              <button type="submit" className="btn pri sm" disabled={busy}>
                Saqlash
              </button>
              <button type="button" onClick={() => setEdit(null)}>
                Bekor qilish
              </button>
              {msg && <span className="err">{msg}</span>}
            </div>
          </form>
        </div>
      )}

      <div className="mtools">
        <input placeholder="Mahsulot nomi bo'yicha qidirish" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Qidirish" />
        <select value={cat} onChange={(e) => setCat(e.target.value)} style={{ flex: '0 1 220px' }} aria-label="Katalog">
          <option value="">Barcha kataloglar</option>
          {CATS.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name.uz}
            </option>
          ))}
        </select>
      </div>

      <div className="panel scroll">
        {!items ? (
          <p className="hint">Yuklanmoqda…</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Rasm</th>
                <th>Nomi</th>
                <th>Katalog</th>
                <th style={{ textAlign: 'right' }}>$ / dona</th>
                <th style={{ textAlign: 'right' }}>Qutida</th>
                <th style={{ textAlign: 'right' }}>≈ $ / T</th>
                <th>Saytda</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {list.length === 0 && (
                <tr>
                  <td colSpan={8} className="hint">
                    {items.length ? 'Mahsulot topilmadi.' : "Hali mahsulot yo'q. «+ Mahsulot qo'shish» tugmasini bosing."}
                  </td>
                </tr>
              )}
              {list.map((p) => (
                <tr key={p.id}>
                  <td>
                    <div className="th">
                      <Thumb p={p} />
                    </div>
                  </td>
                  <td>
                    <b>{p.name_uz}</b>
                    {p.size_label?.uz && <span className="hint"> · {p.size_label.uz}</span>}
                    {!p.img && (
                      <>
                        <br />
                        <span className="hint">rasm yuklanmagan</span>
                      </>
                    )}
                  </td>
                  <td>{CATS.find((c) => c.id === p.cat)?.name.uz}</td>
                  <td className="n">{usd(p.price, 'en')} $</td>
                  <td className="n">
                    {p.box_qty || '—'} · {p.box_kg || '—'} kg
                  </td>
                  <td className="n">{fmt(perTon(p) * (Number(p.price) || 0))}</td>
                  <td>
                    <input type="checkbox" checked={p.active} onChange={() => toggle(p)} aria-label="Saytda ko'rsatish" style={{ width: 22, height: 22 }} />
                  </td>
                  <td>
                    <div className="acts">
                      <button
                        onClick={() => {
                          setMsg('');
                          setEdit({ ...p, size_label: { uz: '', ru: '', en: '', ...(p.size_label || {}) } });
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                      >
                        Tahrirlash
                      </button>
                      <button className="del" onClick={() => remove(p)}>
                        {ask === p.id ? "Ha, o'chirish" : "O'chirish"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
