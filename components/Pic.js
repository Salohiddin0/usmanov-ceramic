import { art } from '@/lib/art';
import { catOf, pname, safeImg } from '@/lib/format';

// Mahsulot rasmi: yuklangan bo'lsa foto, bo'lmasa chizilgan keramika
export default function Pic({ p, lang = 'uz', eager = false }) {
  const src = safeImg(p.img);
  if (src) return <img src={src} alt={pname(p, lang)} loading={eager ? 'eager' : 'lazy'} />;
  return <span style={{ display: 'contents' }} dangerouslySetInnerHTML={{ __html: art(catOf(p.cat)?.art || 'plate', p.v || 0) }} />;
}
