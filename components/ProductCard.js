'use client';
import Link from 'next/link';
import Pic from './Pic';
import { fmt, pcs, pname, size, tonPrice, usd } from '@/lib/format';

export const openOrder = (p) => window.dispatchEvent(new CustomEvent('uc:open', { detail: p }));

export default function ProductCard({ p, lang, t }) {
  const name = pname(p, lang);
  return (
    <article className="pc">
      <button className="pimg" onClick={() => openOrder(p)} aria-label={name}>
        <Pic p={p} lang={lang} />
      </button>
      <div className="pb">
        <h4>
          <Link href={`/${lang}/mahsulot/${p.id}`}>{name}</Link>
        </h4>
        <p className="sz">{size(p, t, lang)}</p>
        <p className="pr">
          <b>{usd(p.price, lang)} $</b> {t.per_pc}
        </p>
        <p className="sz">
          ≈ {fmt(tonPrice(p))} $ {t.perT}
        </p>
        <p className="pcs">{t.pcs.replace('{n}', fmt(pcs(p, 1)))}</p>
        <button className="btn sm" onClick={() => openOrder(p)}>
          {t.order}
        </button>
      </div>
    </article>
  );
}
