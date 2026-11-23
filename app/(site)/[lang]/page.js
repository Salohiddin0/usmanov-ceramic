import { T } from '@/lib/i18n';
import { getProducts, getSettings } from '@/lib/data';
import { fbLink, hasMap, igLink, tgLink } from '@/lib/format';
import { ld, siteUrl } from '@/lib/site';
import { Catalog, Contact, Contract, Hero, Pay, Steps } from '@/components/Sections';

export const revalidate = 300;

export default async function Home({ params }) {
  const { lang } = await params;
  const t = T[lang];
  const [products, s] = await Promise.all([getProducts(), getSettings()]);
  const site = s.site;

  const org = {
    '@context': 'https://schema.org',
    '@type': 'Store',
    name: 'Usmanov Ceramic',
    description: t.hero_s,
    url: `${siteUrl()}/${lang}`,
    logo: `${siteUrl()}/icon.svg`,
    ...(site.phone ? { telephone: site.phone } : {}),
    ...(site.email ? { email: site.email } : {}),
    ...(site.addr ? { address: { '@type': 'PostalAddress', streetAddress: site.addr, addressCountry: 'UZ' } } : {}),
    ...(hasMap(site) ? { geo: { '@type': 'GeoCoordinates', latitude: Number(site.lat), longitude: Number(site.lng) } } : {}),
    sameAs: [tgLink(site.tg), fbLink(site.fb), igLink(site.ig)].filter(Boolean),
  };

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ld(org) }} />
      <Hero t={t} hero={s.hero} tg={site.tg} />
      <Steps t={t} />
      <Catalog lang={lang} t={t} cats={s.cats} products={products} />
      <Contract lang={lang} t={t} rules={s.rules} tg={site.tg} />
      <Pay t={t} site={site} />
      <Contact lang={lang} t={t} site={site} />
    </main>
  );
}
