import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CATS, LANGS, T } from '@/lib/i18n';
import { getProducts, getSettings } from '@/lib/data';
import { catDesc, catName, catOf } from '@/lib/format';
import ProductCard from '@/components/ProductCard';

export const revalidate = 300;
export const dynamicParams = false;

export function generateStaticParams() {
  return LANGS.flatMap((lang) => CATS.map((c) => ({ lang, cat: c.id })));
}

export async function generateMetadata({ params }) {
  const { lang, cat } = await params;
  const c = catOf(cat);
  if (!c) return {};
  const s = await getSettings();
  const t = T[lang];
  const name = catName(s.cats, c, lang);
  return {
    title: `${name} ${t.opt}`,
    description: `${catDesc(s.cats, c, lang)}. ${t.cat_s}`,
    alternates: { canonical: `/${lang}/katalog/${cat}`, languages: { uz: `/uz/katalog/${cat}`, ru: `/ru/katalog/${cat}`, en: `/en/katalog/${cat}` } },
  };
}

export default async function CategoryPage({ params }) {
  const { lang, cat } = await params;
  const c = catOf(cat);
  if (!c) notFound();
  const t = T[lang];
  const [products, s] = await Promise.all([getProducts(), getSettings()]);
  const items = products.filter((p) => p.cat === cat);
  return (
    <main className="catv">
      <section className="band">
        <div className="wrap">
          <Link className="back" href={`/${lang}`}>
            {t.back}
          </Link>
          <div className="sec-h">
            <h1 style={{ fontSize: 'clamp(28px,3.6vw,42px)' }}>{catName(s.cats, c, lang)}</h1>
            <p>
              {catDesc(s.cats, c, lang)}. {t.cat_s}
            </p>
          </div>
          {items.length ? (
            <div className="grid">
              {items.map((p) => (
                <ProductCard key={p.id} p={p} lang={lang} t={t} />
              ))}
            </div>
          ) : (
            <div className="empty" style={{ marginTop: 24 }}>
              {t.empty}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
