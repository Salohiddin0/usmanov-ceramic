'use client';
import { useCallback, useEffect, useState } from 'react';
import { api } from './api';
import { CATS } from '@/lib/i18n';
import { fmt } from '@/lib/format';

const dd = (s) => {
  const [, m, d] = String(s).split('-');
  return `${d}.${m}`;
};
const dec1 = (n) => String(Math.round(Number(n || 0) * 10) / 10).replace('.', ',');

function Change({ a, b, period }) {
  if (!b) return <small className={a ? 'up' : 'flat'}>{a ? 'yangi davr' : '—'}</small>;
  const p = Math.round(((a - b) / b) * 100);
  return (
    <small className={p > 0 ? 'up' : p < 0 ? 'dn' : 'flat'}>
      {p > 0 ? '▲' : p < 0 ? '▼' : ''} {Math.abs(p)}% oldingi {period} kunga
    </small>
  );
}

function Bars({ rows, unit }) {
  if (!rows.length) return <p className="hint">Hali ma&apos;lumot yo&apos;q.</p>;
  const mx = Math.max(1, ...rows.map((r) => r[1]));
  return rows.map(([label, v], i) => (
    <div className="hb" key={i}>
      <span>{label}</span>
      <div className="tr">
        <i style={{ width: `${((v / mx) * 100).toFixed(1)}%` }} />
      </div>
      <b>{unit ? `${dec1(v)} ${unit}` : fmt(v)}</b>
    </div>
  ));
}

export default function StatsTab() {
  const [period, setPeriod] = useState(7);
  const [d, setD] = useState(null);
  const [err, setErr] = useState('');

  const load = useCallback(async () => {
    setErr('');
    setD(null);
    try {
      setD(await api(`stats?days=${period}`));
    } catch (e) {
      setErr(e.message);
    }
  }, [period]);

  useEffect(() => {
    load();
  }, [load]);

  const head = (
    <div className="ah">
      <h2>Statistika</h2>
      <div className="acts">
        {[7, 14, 30, 90].map((n) => (
          <button key={n} className="chip" aria-pressed={n === period} onClick={() => setPeriod(n)}>
            {n} kun
          </button>
        ))}
        <button className="chip" onClick={load}>
          ↻ Yangilash
        </button>
      </div>
    </div>
  );
  if (err)
    return (
      <>
        {head}
        <p className="err">Statistikani yuklab bo&apos;lmadi: {err}</p>
      </>
    );
  if (!d)
    return (
      <>
        {head}
        <p className="hint">Yuklanmoqda…</p>
      </>
    );

  const c = d.cur || {};
  const p = d.prev || {};
  const sum = (a, k) => (a || []).reduce((s, x) => s + Number(x[k] || 0), 0);
  const vA = sum(c.days, 'v');
  const vB = sum(p.days, 'v');
  const qA = Number(c.tg || 0);
  const qB = Number(p.tg || 0);
  const names = Object.fromEntries((d.products || []).map((x) => [x.id, x.name_uz]));
  const nm = (id) => names[id] || "(o'chirilgan mahsulot)";
  const catN = Object.fromEntries(CATS.map((x) => [x.id, x.name.uz]));
  const days = c.days || [];
  const mx = Math.max(1, ...days.map((x) => Math.max(x.v, x.q)));
  const conv = vA ? Math.round((qA / vA) * 1000) / 10 : 0;
  const bk = c.buckets || {};
  const buckets = [
    ['0,5–2 T', bk.a],
    ['2,5–5 T', bk.b],
    ['5,5–10 T', bk.c],
    ['10,5–22 T', bk.d],
    ["22 T dan ko'p", bk.e],
  ].filter((r) => Number(r[1]) > 0);
  const showLabel = (i) => days.length <= 14 || i % Math.ceil(days.length / 10) === 0 || i === days.length - 1;

  return (
    <>
      {head}
      <p className="hint">
        {dd(d.from)} – {dd(d.to)}. Admin sifatida kirgan brauzerning tashriflari hisobga olinmaydi.
      </p>
      <div className="kpis">
        <div className="kpi">
          <span>Tashriflar</span>
          <b>{fmt(vA)}</b>
          <Change a={vA} b={vB} period={period} />
        </div>
        <div className="kpi">
          <span>Telegram so&apos;rovlar</span>
          <b>{fmt(qA)}</b>
          <Change a={qA} b={qB} period={period} />
        </div>
        <div className="kpi">
          <span>Mahsulot ko&apos;rishlar</span>
          <b>{fmt(c.views)}</b>
          <small className="flat">konversiya {String(conv).replace('.', ',')}%</small>
        </div>
        <div className="kpi">
          <span>So&apos;ralgan hajm</span>
          <b>{dec1(c.tons)} T</b>
          <small className="flat">{fmt(qA)} ta so&apos;rov</small>
        </div>
      </div>
      <div className="panels">
        <div className="panel w">
          <h4>Kunlik tashriflar va Telegram so&apos;rovlar</h4>
          {!vA && <p className="hint">Hali tashrif yo&apos;q. Saytga kirishlar boshlanganda raqamlar shu yerda paydo bo&apos;ladi.</p>}
          <div className="cols">
            {days.map((x, i) => (
              <div className="col" key={x.d} title={`${dd(x.d)}: ${x.v} tashrif, ${x.q} so'rov`}>
                <div className="bars">
                  {x.v > 0 && days.length <= 14 && <em>{x.v}</em>}
                  <i style={{ height: `${((x.v / mx) * 100).toFixed(1)}%` }} />
                  <i className="q" style={{ height: `${((x.q / mx) * 100).toFixed(1)}%` }} />
                </div>
                <small>{showLabel(i) ? dd(x.d) : ''}</small>
              </div>
            ))}
          </div>
          <div className="lg">
            <span>
              <i style={{ background: 'color-mix(in srgb,var(--pri) 40%,transparent)' }} />
              Tashriflar
            </span>
            <span>
              <i style={{ background: 'var(--amb)' }} />
              Telegram so&apos;rovlar
            </span>
          </div>
        </div>
        <div className="panel">
          <h4>Eng ko&apos;p so&apos;ralgan mahsulotlar</h4>
          <Bars rows={(c.top_tg || []).map((x) => [nm(x.id), x.n])} />
        </div>
        <div className="panel">
          <h4>Eng ko&apos;p ko&apos;rilgan mahsulotlar</h4>
          <Bars rows={(c.top_view || []).map((x) => [nm(x.id), x.n])} />
        </div>
        <div className="panel">
          <h4>Katalog bo&apos;yicha so&apos;ralgan hajm</h4>
          <Bars rows={(c.by_cat || []).map((x) => [catN[x.cat] || x.cat, Number(x.t)])} unit="T" />
        </div>
        <div className="panel">
          <h4>Buyurtma hajmi taqsimoti</h4>
          <Bars rows={buckets.map((r) => [r[0], Number(r[1])])} />
        </div>
        <div className="panel w">
          <h4>Oxirgi Telegram so&apos;rovlar</h4>
          {(c.recent || []).length ? (
            <div className="scroll">
              <table>
                <thead>
                  <tr>
                    <th>Sana</th>
                    <th>Mahsulot</th>
                    <th style={{ textAlign: 'right' }}>Hajm</th>
                  </tr>
                </thead>
                <tbody>
                  {c.recent.map((r, i) => {
                    const t = new Date(r.ts);
                    return (
                      <tr key={i}>
                        <td>{t.toLocaleString('ru-RU', { timeZone: 'Asia/Tashkent', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}</td>
                        <td>{nm(r.id)}</td>
                        <td className="n">{Number(r.t) > 22 ? '22+ T' : `${dec1(r.t)} T`}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="hint">Hali so&apos;rov yo&apos;q.</p>
          )}
        </div>
      </div>
    </>
  );
}
