'use client';
import { useEffect, useState } from 'react';
import Pic from './Pic';
import QtyInput from './QtyInput';
import useCart from './useCart';
import { MIN_KG, cartTotals, clearCart, removeItem, setQty } from '@/lib/cart';
import { dec, fmt, pname, size, tgLink, usd } from '@/lib/format';
import { track } from '@/lib/track';

const kgStr = (n, lang) => dec(Math.round(n * 10) / 10, lang);

// Savat oynasi: mahsulotlar ro'yxati, jami summa, 500 kg tekshiruvi, Telegram'ga buyurtma
export default function CartDrawer({ lang, t, tg }) {
  const [open, setOpen] = useState(false);
  const [ask, setAsk] = useState(false);
  const list = useCart();
  const { sum, kg } = cartTotals(list);
  const enough = kg >= MIN_KG;

  useEffect(() => {
    const o = () => setOpen(true);
    window.addEventListener('uc:cart', o);
    return () => window.removeEventListener('uc:cart', o);
  }, []);

  useEffect(() => {
    if (!open) return;
    const k = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', k);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', k);
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  const lines = list.map((x, i) => {
    const sz = size(x.p, t, lang);
    return `${i + 1}. ${pname(x.p, lang)}${sz ? ` (${sz})` : ''} — ${x.qty} ${t.pcs_word} × ${usd(x.p.price, lang)} $ = ${fmt(x.qty * x.p.price).replace(/ /g, ' ')} $`;
  });
  const message = `${t.cart_msg}\n\n${lines.join('\n')}\n\n${t.cart_sum
    .replace('{sum}', fmt(sum).replace(/ /g, ' '))
    .replace('{kg}', kgStr(kg, lang))}`;
  const orderUrl = tgLink(tg, message);

  function order(e) {
    if (!enough || !orderUrl) {
      e.preventDefault();
      return;
    }
    list.forEach((x) => track('tg', x.id, x.qty));
  }

  return (
    <div className="drawer cartd" onClick={(e) => e.target === e.currentTarget && setOpen(false)}>
      <div className="dp" role="dialog" aria-modal="true" aria-labelledby="cart-title">
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <h3 id="cart-title" style={{ margin: 0 }}>
            {t.cart}
            {list.length > 0 && <span className="hint"> · {list.length}</span>}
          </h3>
          <button className="ico" onClick={() => setOpen(false)} aria-label="✕" autoFocus>
            ✕
          </button>
        </div>

        {list.length === 0 ? (
          <div className="empty">{t.cart_empty}</div>
        ) : (
          <>
            <div className="clist">
              {list.map((x) => (
                <div className="ci" key={x.id}>
                  <div className="ci-img">
                    <Pic p={x.p} lang={lang} />
                  </div>
                  <div className="ci-body">
                    <b>{pname(x.p, lang)}</b>
                    <span className="hint">
                      {size(x.p, t, lang)} · {usd(x.p.price, lang)} $ {t.per_pc}
                    </span>
                    <QtyInput id={`cq-${x.id}`} label={t.m_vol} value={x.qty} onChange={(q) => setQty(x.id, q)} />
                    <div className="ci-foot">
                      <b>{fmt(x.qty * x.p.price)} $</b>
                      <span className="hint">
                        ≈ {kgStr(x.qty * x.p.w, lang)} {t.kg}
                      </span>
                      <button type="button" className="ci-del" onClick={() => removeItem(x.id)}>
                        {t.remove}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="ctot">
              <div>
                <span>{t.total}</span>
                <b>{fmt(sum)} $</b>
              </div>
              <div>
                <span>{t.weight}</span>
                <b>
                  ≈ {kgStr(kg, lang)} / {MIN_KG} {t.kg}
                </b>
              </div>
              <div className="kgbar" aria-hidden="true">
                <i style={{ width: `${Math.min(100, (kg / MIN_KG) * 100).toFixed(1)}%` }} className={enough ? 'ok' : ''} />
              </div>
            </div>

            {!enough && (
              <p className="warnbox" role="alert">
                {t.min_kg.replace('{w}', kgStr(kg, lang)).replace('{r}', kgStr(MIN_KG - kg, lang))}
              </p>
            )}
            {!tg && <p className="warnbox">{t.no_tg}</p>}

            <a
              className="btn pri"
              href={enough && orderUrl ? orderUrl : undefined}
              target="_blank"
              rel="noopener"
              aria-disabled={!enough || !orderUrl}
              onClick={order}
              role="button"
            >
              {t.order_btn}
            </a>
            <button
              type="button"
              className="btn line"
              onClick={() => {
                if (!ask) return setAsk(true);
                clearCart();
                setAsk(false);
              }}
            >
              {ask ? t.clear_sure : t.clear}
            </button>
            <p className="hint">{t.m_note}</p>
          </>
        )}
      </div>
    </div>
  );
}
