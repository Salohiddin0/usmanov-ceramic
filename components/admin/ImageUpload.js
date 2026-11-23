'use client';
import { useId, useState } from 'react';
import { uploadImage } from './api';

export default function ImageUpload({ value, onChange, folder, label = 'Rasm yuklash' }) {
  const id = useId();
  const [msg, setMsg] = useState('JPG, PNG yoki WEBP. Avtomatik kichraytiriladi.');
  const [busy, setBusy] = useState(false);

  async function pick(e) {
    const f = e.target.files && e.target.files[0];
    e.target.value = '';
    if (!f) return;
    setBusy(true);
    setMsg('Yuklanmoqda…');
    try {
      const url = await uploadImage(f, folder);
      await onChange(url);
      setMsg('Yuklandi');
    } catch (err) {
      setMsg('Yuklanmadi: ' + err.message);
    }
    setBusy(false);
  }

  return (
    <div className="upl">
      <div className="upv">{value ? <img src={value} alt="" /> : "Rasm yo'q"}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <label className="btn sm pri" htmlFor={id} aria-disabled={busy}>
          {label}
        </label>
        <input type="file" id={id} accept="image/jpeg,image/png,image/webp" onChange={pick} disabled={busy} />
        {value && (
          <button type="button" className="chip" onClick={() => onChange('')} disabled={busy}>
            Rasmni olib tashlash
          </button>
        )}
        <span className="hint" aria-live="polite">
          {msg}
        </span>
      </div>
    </div>
  );
}
