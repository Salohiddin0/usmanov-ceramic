import { T } from '@/lib/i18n';

export default function NotFound() {
  const t = T.uz;
  return (
    <main className="nf">
      <div>
        <h1>404</h1>
        <p>
          {t.nf_s} / {T.ru.nf_s}
        </p>
        <a className="btn pri" href="/uz">
          {t.home}
        </a>
      </div>
    </main>
  );
}
