'use client';
import { useEffect, useState } from 'react';
import Pic from './Pic';
import { dec, fmt, pcs, pname, size, tgLink, tonPrice, usd } from '@/lib/format';
import { track } from '@/lib/track';

// Mahsulot tafsiloti + tonna tanlash + Telegram'ga yuborish
export default function OrderPanel({ p, lang, t, tg, catName, titleId, heading = 'h3' }) {
  const [tons, setTons] = useState(1);
  useEffect(() => {
    track('view', p.id);
  }, [p.id]);

  const name = pname(p, lang);
  const sz = size(p, t, lang);
  const n = pcs(p, tons);
  const msg = t.msg_o
    .replace('{p}', `${name} (${sz})`)
    .replace('{price}', usd(p.price, lang))
    .replace('{t}', dec(tons, lang))
    .replace('{n}', fmt(n).replace(/ /g, ' '));
  const send = tgLink(tg, msg);
  const more = tgLink(tg, t.msg_m.replace('{p}', name));
  const H = heading;
  const inputId = `tons-${p.id}`;
  const step = (d) => setTons((x) => Math.min(22, Math.max(0.5, Math.round((x + d) * 2) / 2)));

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
          <dt>{t.ton_price}</dt>
          <dd>≈ {fmt(tonPrice(p))} $</dd>
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
        <div className="tv" aria-live="polite">
          {dec(tons, lang)} {t.T}
        </div>
        <div className="stp">
          <button type="button" onClick={() => step(-0.5)} aria-label="−0.5">
            −
          </button>
          <input id={inputId} type="range" min="0.5" max="22" step="0.5" value={tons} onChange={(e) => setTons(Number(e.target.value))} />
          <button type="button" onClick={() => step(0.5)} aria-label="+0.5">
            +
          </button>
        </div>
        <div className="calc">
          <div>
            <span>{t.m_pcs}</span>
            <b>≈ {fmt(n)}</b>
          </div>
          <div>
            <span>{t.m_sum}</span>
            <b>
              ≈ {fmt(tonPrice(p) * tons)} $
            </b>
          </div>
        </div>
        {send ? (
          <>
            <a className="btn pri" href={send} target="_blank" rel="noopener" onClick={() => track('tg', p.id, tons)}>
              {t.m_send}
            </a>
            <a className="more" href={more} target="_blank" rel="noopener" onClick={() => track('tg', p.id, 22.5)}>
              {t.m_more}
            </a>
          </>
        ) : null}
        <p className="hint">{t.m_note}</p>
      </div>
    </>
  );
}
