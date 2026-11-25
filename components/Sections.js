// Bosh sahifa bo'limlari (serverda chiziladi)
import Link from 'next/link';
import { CATS } from '@/lib/i18n';
import { catArt, heroScene } from '@/lib/art';
import { catDesc, catImg, catName, hasMap, rulesFor, safeImg, telLink, tgLink, waLink } from '@/lib/format';
import ProductCard from './ProductCard';
import Rail from './Rail';
import ContactForm from './ContactForm';

export function Hero({ t, hero, tg }) {
  const img = safeImg(hero);
  const tgUrl = tgLink(tg, t.msg_h);
  return (
    <section className="hero">
      <div className="hbg" aria-hidden="true">
        {img ? <img src={img} alt="" fetchPriority="high" /> : <span dangerouslySetInnerHTML={{ __html: heroScene() }} />}
      </div>
      <div className="wrap band" style={{ paddingBlock: 0 }}>
        <h1>{t.hero_t}</h1>
        <p className="lead">{t.hero_s}</p>
        <div className="cta">
          <a className="btn" href="#katalog">
            {t.cta1}
          </a>
          {tgUrl && (
            <a className="btn ghost" href={tgUrl} target="_blank" rel="noopener">
              {t.cta2}
            </a>
          )}
        </div>
        <div className="figs">
          <div>
            <b>10</b>
            <span>{t.f1}</span>
          </div>
          <div>
            <b>1 000</b>
            <span>{t.f2}</span>
          </div>
          <div>
            <b>500 kg</b>
            <span>{t.f3}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Steps({ t }) {
  return (
    <section className="band">
      <div className="wrap">
        <h2>{t.how_t}</h2>
        <div className="steps">
          {t.steps.map((s, i) => (
            <div className="st" key={i}>
              <i>{i + 1}</i>
              <h3 style={{ fontSize: 17, fontFamily: 'inherit', marginBottom: 6 }}>{s[0]}</h3>
              <p>{s[1]}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CatTile({ c, i, lang, t, cats, count }) {
  const img = safeImg(catImg(cats, c));
  return (
    <Link className={`ctile ${img ? '' : 'g' + i}`} href={`/${lang}/katalog/${c.id}`}>
      <span className="cimg">{img ? <img src={img} alt="" loading="lazy" /> : <span style={{ display: 'contents' }} dangerouslySetInnerHTML={{ __html: catArt(c.art, i) }} />}</span>
      <b>{catName(cats, c, lang)}</b>
      <span>{catDesc(cats, c, lang)}</span>
      <em>
        {count} {t.items} · {t.all} →
      </em>
    </Link>
  );
}

export function Catalog({ lang, t, cats, products }) {
  return (
    <section className="band cat-band" id="katalog">
      <div className="wrap">
        <div className="sec-h">
          <h2>{t.cat_t}</h2>
          <p>{t.cat_s}</p>
        </div>
        {CATS.map((c, i) => {
          const items = products.filter((p) => p.cat === c.id);
          return (
            <div className="crow" key={c.id}>
              <CatTile c={c} i={i} lang={lang} t={t} cats={cats} count={items.length} />
              {items.length ? (
                <Rail>
                  {items.map((p) => (
                    <ProductCard key={p.id} p={p} lang={lang} t={t} />
                  ))}
                </Rail>
              ) : (
                <div className="railw">
                  <div className="empty">{t.empty}</div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

export function Contract({ lang, t, rules, tg }) {
  const tgUrl = tgLink(tg, t.msg_h);
  return (
    <section className="band" id="shartnoma">
      <div className="wrap">
        <div className="sec-h">
          <h2>{t.con_t}</h2>
          <p>{t.con_s}</p>
        </div>
        <div className="rules">
          {rulesFor(rules, lang).map((r, i) => (
            <div className="rule" key={i}>
              <div>
                <h3 style={{ fontSize: 17, fontFamily: 'inherit' }}>{r[0]}</h3>
                <p>{r[1]}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="cnote">
          <p>{t.con_n}</p>
          {tgUrl && (
            <a className="btn pri" href={tgUrl} target="_blank" rel="noopener">
              {t.tg}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}

export function Pay({ t, site }) {
  const tgUrl = tgLink(site.tg, t.msg_h);
  const wa = waLink(site.wa);
  const tel = telLink(site.phone);
  return (
    <section className="band pay" id="tolov">
      <div className="wrap">
        <div>
          <h2>{t.pay_t}</h2>
          <p>{t.pay_s}</p>
        </div>
        <div className="cta">
          {tgUrl && (
            <a className="btn" href={tgUrl} target="_blank" rel="noopener">
              Telegram
            </a>
          )}
          {wa && (
            <a className="btn ghost" href={wa} target="_blank" rel="noopener">
              WhatsApp
            </a>
          )}
          {tel && (
            <a className="btn ghost" href={tel}>
              {site.phone}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}

export function Contact({ lang, t, site }) {
  const map = hasMap(site);
  const lat = Number(site.lat);
  const lng = Number(site.lng);
  const ylang = lang === 'en' ? 'en_US' : lang === 'ru' ? 'ru_RU' : 'uz_UZ';
  return (
    <section className="band" id="aloqa">
      <div className="wrap">
        <div className="sec-h">
          <h2>{t.ctc_t}</h2>
          <p>{t.ctc_s}</p>
        </div>
        <div className="cgrid">
          <ContactForm lang={lang} t={t} email={site.email} />
          <div className="mapc">
            <div className="mapv">
              {map ? (
                <iframe
                  title={t.map_t}
                  src={`https://yandex.uz/map-widget/v1/?ll=${lng},${lat}&z=16&pt=${lng},${lat},pm2rdm&lang=${ylang}`}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              ) : (
                <div className="nomap">{site.addr || t.map_t}</div>
              )}
            </div>
            <div className="minfo">
              {site.addr && (
                <div>
                  <small>{t.addr_l}</small>
                  <b>{site.addr}</b>
                </div>
              )}
              {site.hrs?.[lang] && (
                <div>
                  <small>{t.hrs_l}</small>
                  <b>{site.hrs[lang]}</b>
                </div>
              )}
              {site.phone && (
                <div>
                  <small>Tel</small>
                  <b>
                    <a href={telLink(site.phone)} style={{ textDecoration: 'none' }}>
                      {site.phone}
                    </a>
                  </b>
                </div>
              )}
              {site.email && (
                <div>
                  <small>Email</small>
                  <b style={{ overflowWrap: 'anywhere' }}>
                    <a href={`mailto:${site.email}`} style={{ textDecoration: 'none' }}>
                      {site.email}
                    </a>
                  </b>
                </div>
              )}
              {map && (
                <div className="mlinks">
                  <a className="btn sm pri" href={`https://yandex.uz/maps/?pt=${lng},${lat}&z=16&l=map`} target="_blank" rel="noopener">
                    {t.open_y}
                  </a>
                  <a className="btn sm line" href={`https://www.google.com/maps?q=${lat},${lng}`} target="_blank" rel="noopener">
                    {t.open_g}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
