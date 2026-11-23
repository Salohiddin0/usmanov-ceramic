import { Unbounded, Manrope } from 'next/font/google';

export const display = Unbounded({
  subsets: ['latin', 'cyrillic'],
  weight: ['500', '700'],
  variable: '--f-display',
  display: 'swap',
});

export const body = Manrope({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--f-body',
  display: 'swap',
});
