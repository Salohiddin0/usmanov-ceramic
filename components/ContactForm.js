'use client';
import { useState } from 'react';

export default function ContactForm({ lang, t, email }) {
  const [state, setState] = useState({ busy: false, ok: null });

  async function submit(e) {
    e.preventDefault();
    const f = e.currentTarget;
    const data = Object.fromEntries(new FormData(f).entries());
    setState({ busy: true, ok: null });
    try {
      const r = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ ...data, lang }),
      });
      if (!r.ok) throw new Error();
      f.reset();
      setState({ busy: false, ok: true });
    } catch {
      setState({ busy: false, ok: false });
    }
  }

  return (
    <form className="cf" onSubmit={submit}>
      <label htmlFor="cf-n">{t.f_name}</label>
      <input id="cf-n" name="name" required autoComplete="name" maxLength={80} />
      <label htmlFor="cf-e">Email</label>
      <input id="cf-e" name="email" type="email" required autoComplete="email" maxLength={120} />
      <label htmlFor="cf-p">{t.f_phone}</label>
      <input id="cf-p" name="phone" type="tel" required autoComplete="tel" placeholder="+998 90 123 45 67" maxLength={30} pattern="[+0-9 ()\-]{7,30}" />
      <label htmlFor="cf-m">{t.f_msg}</label>
      <textarea id="cf-m" name="message" required maxLength={2000} />
      {/* Spam botlar uchun tuzoq: odamlar ko'rmaydi */}
      <input name="website" tabIndex={-1} autoComplete="off" className="sr" aria-hidden="true" />
      <button className="btn pri" type="submit" disabled={state.busy}>
        {t.f_send}
      </button>
      {state.ok === true && <p className="ok">{t.f_ok}</p>}
      {state.ok === false && <p className="err">{t.f_err}</p>}
      {email && (
        <>
          <p className="hint">{t.f_to}</p>
          <a className="mailto" href={`mailto:${email}`}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <rect x="3" y="5" width="18" height="14" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
              <path d="m3 7 9 6 9-6" fill="none" stroke="currentColor" strokeWidth="2" />
            </svg>
            <span>{email}</span>
          </a>
        </>
      )}
    </form>
  );
}
