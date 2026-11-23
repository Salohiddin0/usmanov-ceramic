import Link from 'next/link';
import Logo from './Logo';
import { fbLink, igLink, telLink, tgLink, waLink } from '@/lib/format';

const ICON = {
  tg: <path d="M21 4 3 11l6 2 2 6 3-4 5 4z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />,
  wa: <path d="M4 20l1.3-4A8 8 0 1 1 8 18.7z" fill="none" stroke="currentColor" strokeWidth="2" />,
  fb: <path d="M14 8h3V4h-3a4 4 0 0 0-4 4v2H7v4h3v7h4v-7h3l1-4h-4V8z" fill="currentColor" />,
  ig: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2" />
    </>
  ),
};

const I = ({ d }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    {d}
  </svg>
);

export default function Footer({ lang, t, site, cats }) {
  const tg = tgLink(site.tg, t.msg_h);
  const social = [
    ['tg', 'Telegram', tg],
    ['wa', 'WhatsApp', waLink(site.wa)],
    ['fb', 'Facebook', fbLink(site.fb)],
    ['ig', 'Instagram', igLink(site.ig)],
  ].filter((s) => s[2]);
  return (
    <footer className="band" style={{ paddingBottom: 28 }}>
      <div className="wrap">
        <div className="fcta">
          <div>
            <h3>{t.fc_t}</h3>
            <p>{t.fc_s}</p>
          </div>
          {tg && (
            <a className="btn" href={tg} target="_blank" rel="noopener">
              {t.tg}
            </a>
          )}
        </div>
        <div className="fcols">
          <div className="fbrand">
            <span className="logo">
              <Logo />
            </span>
            <p>{t.ft_d}</p>
            {social.length > 0 && (
              <div className="fsoc">
                {social.map(([k, label, href]) => (
                  <a key={k} href={href} target="_blank" rel="noopener" aria-label={label} title={label}>
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      {ICON[k]}
                    </svg>
                  </a>
                ))}
              </div>
            )}
          </div>
          <div>
            <h4>{t.cat_t}</h4>
            {cats.map((c) => (
              <Link key={c.id} href={`/${lang}/katalog/${c.id}`}>
                {c.name}
              </Link>
            ))}
          </div>
          <div>
            <h4>{t.ft_i}</h4>
            <a href={`/${lang}#shartnoma`}>{t.nav_con}</a>
            <a href={`/${lang}#tolov`}>{t.nav_pay}</a>
            <a href={`/${lang}#aloqa`}>{t.nav_ctc}</a>
            <a href={`/${lang}#katalog`}>{t.nav_cat}</a>
          </div>
          <div className="fct">
            <h4>{t.nav_ctc}</h4>
            {site.phone && (
              <div>
                <I d={<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />} />
                <a href={telLink(site.phone)} style={{ padding: 0 }}>
                  {site.phone}
                </a>
              </div>
            )}
            {site.email && (
              <div>
                <I d={<><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></>} />
                <a href={`mailto:${site.email}`} style={{ padding: 0, overflowWrap: 'anywhere' }}>
                  {site.email}
                </a>
              </div>
            )}
            {site.addr && (
              <div>
                <I d={<><path d="M12 22s7-6.5 7-12a7 7 0 0 0-14 0c0 5.5 7 12 7 12z" /><circle cx="12" cy="10" r="2.5" /></>} />
                <span>{site.addr}</span>
              </div>
            )}
            {site.hrs?.[lang] && (
              <div>
                <I d={<><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>} />
                <span>{site.hrs[lang]}</span>
              </div>
            )}
          </div>
        </div>
        <div className="fbot">
          <span>
            © {new Date().getFullYear()} Usmanov Ceramic. {t.rights}
          </span>
          <span>{t.ft_w}</span>
        </div>
      </div>
    </footer>
  );
}
