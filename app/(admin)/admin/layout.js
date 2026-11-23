import '@/app/globals.css';
import { display, body } from '@/lib/fonts';
import { THEME_JS } from '@/lib/site';

export const metadata = {
  title: 'Admin panel | Usmanov Ceramic',
  robots: { index: false, follow: false },
  icons: { icon: '/icon.svg' },
};

export default function AdminLayout({ children }) {
  return (
    <html lang="uz" className={`${display.variable} ${body.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_JS }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
