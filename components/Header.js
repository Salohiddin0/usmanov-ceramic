'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Logo from './Logo';
import { LANGS } from '@/lib/i18n';
import { tgLink, waLink } from '@/lib/format';
import { toggleTheme, trackVisit } from '@/lib/track';

const Moon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
  </svg>
);

export default function Header({ lang, t, site, cats }) {
  const path = usePathname() || `/${lang}`;
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const home = path === `/${lang}` || path === `/${lang}/`;

  useEffect(() => {
    trackVisit();
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 120);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.classList.toggle('scrolled', scrolled);
  }, [scrolled]);

  useEffect(() => {
    setOpen(false);
  }, [path]);

  useEffect(() => {
    if (!open) return;
    const k = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [open]);

  const swap = (l) => `/${l}${path.replace(/^\/(uz|ru|en)(?=\/|$)/, '')}`;
  const tg = tgLink(site.tg, t.msg_h);
  const wa = waLink(site.wa);
  const nav = [
    ['katalog', t.nav_cat],
    ['shartnoma', t.nav_con],
    ['tolov', t.nav_pay],
    ['aloqa', t.nav_ctc],
  ];
  const close = () => setOpen(false);

  const langSeg = (
    <div className="seg" role="group" aria-label="Til / Язык / Language">
      {LANGS.map((l) => (
        <Link key={l} href={swap(l)} aria-current={l === lang ? 'true' : undefined} className="segl">
          {l.toUpperCase()}
        </Link>
      ))}
    </div>
  );

  return (
    <>
      <header className={home && !scrolled ? 'over' : ''}>
        <div className="hd">
          <Link className="logo" href={`/${lang}`} aria-label="Usmanov Ceramic">
            <Logo />
          </Link>
          <nav aria-label="Menu">
            {nav.map(([id, label]) => (
              <a key={id} href={`/${lang}#${id}`}>
                {label}
              </a>
            ))}
          </nav>
          <div className="tools">
            {langSeg}
            <button className="ico" onClick={toggleTheme} aria-label="Dark / light">
              <Moon />
            </button>
            {tg && (
              <a className="btn sm pri" href={tg} target="_blank" rel="noopener">
                {t.tg}
              </a>
            )}
          </div>
        </div>
      </header>
      <button className="burger" onClick={() => setOpen(true)} aria-label="Menu" aria-expanded={open}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
          <path d="M4 7h16M4 12h16M4 17h10" />
        </svg>
      </button>
      {open && (
        <div className="drawer" onClick={(e) => e.target === e.currentTarget && close()}>
          <div className="dp" role="dialog" aria-modal="true" aria-label="Menu">
            <div className="row" style={{ justifyContent: 'space-between' }}>
              <span className="logo">
                <Logo />
              </span>
              <button className="ico" onClick={close} aria-label="✕" autoFocus>
                ✕
              </button>
            </div>
            <nav>
              <a href={`/${lang}`} onClick={close}>
                {t.home}
              </a>
              <a href={`/${lang}#katalog`} onClick={close}>
                {t.nav_cat}
              </a>
              <div className="sub" style={{ display: 'flex', flexDirection: 'column', paddingLeft: 10 }}>
                {cats.map((c) => (
                  <Link key={c.id} href={`/${lang}/katalog/${c.id}`} onClick={close}>
                    {c.name}
                  </Link>
                ))}
              </div>
              {nav.slice(1).map(([id, label]) => (
                <a key={id} href={`/${lang}#${id}`} onClick={close}>
                  {label}
                </a>
              ))}
            </nav>
            <div className="row">
              {langSeg}
              <button className="ico" onClick={toggleTheme} aria-label="Dark / light">
                <Moon />
              </button>
            </div>
            {tg && (
              <a className="btn pri" href={tg} target="_blank" rel="noopener">
                {t.tg}
              </a>
            )}
            {wa && (
              <a className="btn line" href={wa} target="_blank" rel="noopener">
                WhatsApp
              </a>
            )}
            {site.phone && <p className="hint">{site.phone}</p>}
          </div>
        </div>
      )}
    </>
  );
}
