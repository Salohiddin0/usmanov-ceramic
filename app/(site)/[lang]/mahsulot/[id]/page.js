import Link from 'next/link';
import { notFound } from 'next/navigation';
import { T } from '@/lib/i18n';
import { getProduct, getProducts, getSettings } from '@/lib/data';
import { catName, catOf, fmt, pname, safeImg, size } from '@/lib/format';
import { ld, siteUrl } from '@/lib/site';
import OrderPanel from '@/components/OrderPanel';
import ProductCard from '@/components/ProductCard';

export const revalidate = 300;
// Mahsulotlar admin paneldan qo'shiladi, shuning uchun sahifalar so'ralganda yaratiladi
export const dynamicParams = true;
export function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }) {
  const { lang, id } = await params;
  const p = await getProduct(id);
  if (!p) return {};
  const t = T[lang];
  const name = pname(p, lang);
  const img = safeImg(p.img);
  return {
    title: `${name} ${t.opt}`,
    description: `${name}, ${size(p, t, lang)}. ${fmt(p.price).replace(/ /g, ' ')} ${t.cur} ${t.perT}. ${t.cat_s}`,
    alternates: { canonical: `/${lang}/mahsulot/${id}`, languages: { uz: `/uz/mahsulot/${id}`, ru: `/ru/mahsulot/${id}`, en: `/en/mahsulot/${id}` } },
    openGraph: img ? { images: [{ url: img }] } : undefined,
  };
}

export default async function ProductPage({ params }) {
  const { lang, id } = await params;
  const p = await getProduct(id);
  if (!p) notFound();
  const t = T[lang];
  const [s, all] = await Promise.all([getSettings(), getProducts()]);
  const c = catOf(p.cat);
  const cName = c ? catName(s.cats, c, lang) : '';
  const others = all.filter((x) => x.cat === p.cat && x.id !== p.id).slice(0, 4);
  const img = safeImg(p.img);
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: pname(p, lang),
    brand: { '@type': 'Brand', name: 'Usmanov Ceramic' },
    category: cName,
    url: `${siteUrl()}/${lang}/mahsulot/${p.id}`,
    ...(img ? { image: img } : {}),
  };
  return (
    <main className="catv">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ld(schema) }} />
      <section className="band">
        <div className="wrap">
          <Link className="back" href={`/${lang}/katalog/${p.cat}`}>
            ← {cName}
          </Link>
          <div className="md static">
            <OrderPanel p={p} lang={lang} t={t} tg={s.site.tg} catName={cName} heading="h1" />
          </div>
          <p style={{ marginTop: 18 }}>
            <a className="more" href={`/${lang}#shartnoma`}>
              {t.see_rules} →
            </a>
          </p>
          {others.length > 0 && (
            <div className="prod-more">
              <h2 style={{ fontSize: 26 }}>{t.prod_more}</h2>
              <div className="grid">
                {others.map((x) => (
                  <ProductCard key={x.id} p={x} lang={lang} t={t} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
