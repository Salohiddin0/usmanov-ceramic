import '@/app/globals.css';
import { notFound } from 'next/navigation';
import { display, body } from '@/lib/fonts';
import { CATS, LANGS, LOCALES, T, isLang } from '@/lib/i18n';
import { getSettings } from '@/lib/data';
import { catName } from '@/lib/format';
import { THEME_JS, metadataBase } from '@/lib/site';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import OrderModal from '@/components/OrderModal';
import CartDrawer from '@/components/CartDrawer';
import CartButton from '@/components/CartButton';

export const revalidate = 300;

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }) {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  const t = T[lang];
  return {
    metadataBase: metadataBase(),
    title: { default: `Usmanov Ceramic: ${t.hero_t}`, template: '%s | Usmanov Ceramic' },
    description: t.hero_s,
    applicationName: 'Usmanov Ceramic',
    alternates: { canonical: `/${lang}`, languages: { uz: '/uz', ru: '/ru', en: '/en', 'x-default': '/uz' } },
    openGraph: { type: 'website', siteName: 'Usmanov Ceramic', locale: LOCALES[lang], title: `Usmanov Ceramic: ${t.hero_t}`, description: t.hero_s, url: `/${lang}` },
    icons: { icon: '/icon.svg' },
  };
}

export const viewport = { themeColor: '#070d1d' };

export default async function SiteLayout({ children, params }) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const t = T[lang];
  const s = await getSettings();
  const cats = CATS.map((c) => ({ id: c.id, name: catName(s.cats, c, lang) }));
  const catNames = Object.fromEntries(cats.map((c) => [c.id, c.name]));
  return (
    <html lang={lang} className={`${display.variable} ${body.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_JS }} />
      </head>
      <body>
        <Header lang={lang} t={t} site={s.site} cats={cats} />
        {children}
        <Footer lang={lang} t={t} site={s.site} cats={cats} />
        <OrderModal lang={lang} t={t} tg={s.site.tg} catNames={catNames} />
        <CartDrawer lang={lang} t={t} tg={s.site.tg} />
        <CartButton label={t.cart} variant="fab" />
      </body>
    </html>
  );
}
