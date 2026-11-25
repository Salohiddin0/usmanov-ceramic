'use client';
import { useEffect, useState } from 'react';
import Pic from './Pic';
import QtyInput from './QtyInput';
import { dec, fmt, pname, size, tgLink, usd } from '@/lib/format';
import { MAX_Q, MIN_Q, addToCart, openCart } from '@/lib/cart';
import { track } from '@/lib/track';

// Mahsulot tafsiloti + dona tanlash + savatga qo'shish
export default function OrderPanel({ p, lang, t, tg, catName, titleId, heading = 'h3' }) {
  const [qty, setQty] = useState(MIN_Q);
  const [added, setAdded] = useState(false);
  useEffect(() => {
    track('view', p.id);
  }, [p.id]);

  const name = pname(p, lang);
  const sz = size(p, t, lang);
  const more = tgLink(tg, t.msg_m.replace('{p}', name));
  const H = heading;
  const inputId = `qty-${p.id}`;

  function add() {
    addToCart(p, qty);
    setAdded(true);
  }

  return (
    <>
      <div className="mi">
        <Pic p={p} lang={lang} eager />
      </div>
      <div className="mx">
        {catName && <span className="hint">{catName}</span>}
        <H id={titleId} style={{ margin: 0 }}>
          {name}
        </H>
        <dl>
          <dt>{t.m_price}</dt>
          <dd>
            {usd(p.price, lang)} $ {t.per_pc}
          </dd>
          {sz && (
            <>
              <dt>{t.m_size}</dt>
              <dd>{sz}</dd>
            </>
          )}
          {p.box_qty > 0 && p.box_kg > 0 ? (
            <>
              <dt>{t.box}</dt>
              <dd>
                {p.box_qty} {t.pcs_word} · {dec(p.box_kg, lang)} {t.kg}
              </dd>
            </>
          ) : (
            <>
              <dt>{t.m_w}</dt>
              <dd>
                {dec(Math.round(p.w * 100) / 100, lang)} {t.kg}
              </dd>
            </>
          )}
        </dl>
        <label htmlFor={inputId}>{t.m_vol}</label>
        <QtyInput
          id={inputId}
          label={t.m_vol}
          value={qty}
          onChange={(q) => {
            setQty(q);
            setAdded(false);
          }}
        />
        <p className="hint" style={{ marginTop: -4 }}>
          {t.qty_hint.replace('{min}', MIN_Q).replace('{max}', fmt(MAX_Q))}
        </p>
        <div className="calc">
          <div>
            <span>{t.m_sum}</span>
            <b>≈ {fmt(qty * p.price)} $</b>
          </div>
          <div>
            <span>{t.m_kg}</span>
            <b>
              ≈ {dec(Math.round(qty * p.w * 10) / 10, lang)} {t.kg}
            </b>
          </div>
        </div>
        <button type="button" className="btn pri" onClick={add}>
          {t.add_cart}
        </button>
        {added && (
          <div className="added" role="status">
            <span>✓ {t.added}</span>
            <button type="button" className="btn sm" onClick={openCart}>
              {t.go_cart} →
            </button>
          </div>
        )}
        {more && (
          <a className="more" href={more} target="_blank" rel="noopener" onClick={() => track('tg', p.id, MAX_Q + 1)}>
            {t.m_more}
          </a>
        )}
        <p className="hint">{t.m_note}</p>
      </div>
    </>
  );
}
