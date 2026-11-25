'use client';
import useCart from './useCart';
import { openCart } from '@/lib/cart';

export const CartIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.5L21 8H6.2" />
    <circle cx="10" cy="20" r="1.4" />
    <circle cx="18" cy="20" r="1.4" />
  </svg>
);

// variant: "head" — header'dagi tugma; "fab" — pastki o'ng burchakdagi suzuvchi tugma
export default function CartButton({ label, variant = 'head' }) {
  const list = useCart();
  const n = list.length;
  if (variant === 'fab' && n === 0) return null;
  return (
    <button type="button" className={variant === 'fab' ? 'cartfab' : 'ico cartbtn'} onClick={openCart} aria-label={`${label}${n ? ` (${n})` : ''}`}>
      <CartIcon />
      {n > 0 && <span className="cbadge">{n}</span>}
    </button>
  );
}
