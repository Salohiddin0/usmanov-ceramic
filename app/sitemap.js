import { CATS, LANGS } from '@/lib/i18n';
import { getProducts } from '@/lib/data';
import { siteUrl } from '@/lib/site';

export const revalidate = 3600;

export default async function sitemap() {
  const base = siteUrl();
  const products = await getProducts();
  const now = new Date();
  const out = [];
  for (const l of LANGS) {
    out.push({ url: `${base}/${l}`, lastModified: now, changeFrequency: 'weekly', priority: 1 });
    for (const c of CATS) out.push({ url: `${base}/${l}/katalog/${c.id}`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 });
    for (const p of products) out.push({ url: `${base}/${l}/mahsulot/${p.id}`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 });
  }
  return out;
}
