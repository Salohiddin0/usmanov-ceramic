'use client';
import { useEffect, useState } from 'react';
import { api, post } from './api';
import ImageUpload from './ImageUpload';
import { CATS, LANGS } from '@/lib/i18n';

const L = { uz: 'UZ', ru: 'RU', en: 'EN' };

function CatForm({ c, value, onSave }) {
  const [v, setV] = useState(() => ({
    img: value?.img || '',
    name: Object.fromEntries(LANGS.map((l) => [l, value?.name?.[l] || c.name[l]])),
    desc: Object.fromEntries(LANGS.map((l) => [l, value?.desc?.[l] || c.desc[l]])),
  }));
  const [msg, setMsg] = useState('');
  const setF = (group, l, val) => setV((o) => ({ ...o, [group]: { ...o[group], [l]: val } }));

  async function save(next) {
    setMsg('Saqlanmoqda…');
    try {
      await onSave(c.id, next || v);
      setMsg("Saqlandi, saytda ko'rinadi");
    } catch (e) {
      setMsg('Saqlab bo\'lmadi: ' + e.message);
    }
  }

  return (
    <form
      className="panel"
      style={{ display: 'grid', gap: 10 }}
      onSubmit={(e) => {
        e.preventDefault();
        save();
      }}
    >
      <h4>{c.name.uz}</h4>
      <ImageUpload
        value={v.img}
        folder="catalogs"
        label="Katalog rasmini yuklash"
        onChange={async (url) => {
          const next = { ...v, img: url };
          setV(next);
          await save(next);
        }}
      />
      {LANGS.map((l) => (
        <div key={l}>
          <label htmlFor={`cn-${c.id}-${l}`}>Nomi ({L[l]})</label>
          <input id={`cn-${c.id}-${l}`} value={v.name[l]} onChange={(e) => setF('name', l, e.target.value)} maxLength={80} />
        </div>
      ))}
      {LANGS.map((l) => (
        <div key={l}>
          <label htmlFor={`cd-${c.id}-${l}`}>Izoh ({L[l]})</label>
          <input id={`cd-${c.id}-${l}`} value={v.desc[l]} onChange={(e) => setF('desc', l, e.target.value)} maxLength={200} />
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
  );
}

export default function CatalogsTab() {
  const [s, setS] = useState(null);
  const [err, setErr] = useState('');
  const [heroMsg, setHeroMsg] = useState('');

  useEffect(() => {
    api('settings')
      .then(setS)
      .catch((e) => setErr(e.message));
  }, []);

  async function saveCat(id, val) {
    const cats = { ...(s.cats || {}), [id]: val };
    const r = await post('settings', { key: 'cats', value: cats });
    setS((o) => ({ ...o, cats: r.value }));
  }

  async function saveHero(url) {
    setHeroMsg('Saqlanmoqda…');
    try {
      await post('settings', { key: 'hero', value: { url } });
      setS((o) => ({ ...o, hero: url }));
      setHeroMsg(url ? 'Saqlandi' : 'Olib tashlandi, chizilgan fon qaytdi');
    } catch (e) {
      setHeroMsg("Saqlab bo'lmadi: " + e.message);
    }
  }

  if (err) return <p className="err">{err}</p>;
  if (!s) return <p className="hint">Yuklanmoqda…</p>;
  return (
    <>
      <h2>Kataloglar</h2>
      <p className="hint">Bosh sahifadagi 5 ta katta katalog kartasining rasmi, nomi va izohi.</p>
      <div className="catcards">
        {CATS.map((c) => (
          <CatForm key={c.id} c={c} value={s.cats?.[c.id]} onSave={saveCat} />
        ))}
      </div>
      <div className="panel" style={{ marginTop: 14 }}>
        <h4>Bosh sahifa (Main) fon rasmi</h4>
        <p className="hint" style={{ marginBottom: 12 }}>
          Keng va sifatli rasm tanlang (kamida 1600 px). Matn chap tomonda turadi, rasm ustiga qorong&apos;i qatlam qo&apos;yiladi.
        </p>
        <ImageUpload value={s.hero} folder="hero" label="Fon rasmini yuklash" onChange={saveHero} />
        <p className="hint">{heroMsg}</p>
      </div>
    </>
  );
}
