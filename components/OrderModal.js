'use client';
import { useEffect, useState } from 'react';
import OrderPanel from './OrderPanel';

// Katalogda mahsulot bosilganda ochiladigan oyna
export default function OrderModal({ lang, t, tg, catNames }) {
  const [p, setP] = useState(null);

  useEffect(() => {
    const onOpen = (e) => setP(e.detail);
    const onClose = () => setP(null);
    window.addEventListener('uc:open', onOpen);
    window.addEventListener('uc:close-order', onClose);
    return () => {
      window.removeEventListener('uc:open', onOpen);
      window.removeEventListener('uc:close-order', onClose);
    };
  }, []);

  useEffect(() => {
    if (!p) return;
    const k = (e) => e.key === 'Escape' && setP(null);
    window.addEventListener('keydown', k);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', k);
      document.body.style.overflow = prev;
    };
  }, [p]);

  if (!p) return null;
  return (
    <div className="ov" onClick={(e) => e.target === e.currentTarget && setP(null)}>
      <div className="md" role="dialog" aria-modal="true" aria-labelledby="m-title">
        <button className="ico close" onClick={() => setP(null)} aria-label="✕" autoFocus>
          ✕
        </button>
        <OrderPanel key={p.id} p={p} lang={lang} t={t} tg={tg} catName={catNames[p.cat]} titleId="m-title" />
      </div>
    </div>
  );
}
