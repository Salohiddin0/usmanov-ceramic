export const siteUrl = () => (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/+$/, '');

export function metadataBase() {
  try {
    return new URL(siteUrl());
  } catch {
    return new URL('http://localhost:3000');
  }
}

// Sahifa chizilishidan oldin dark/light rejimni qo'llaydi (miltillamasligi uchun)
export const THEME_JS =
  "try{var t=localStorage.getItem('uc_th');if(t==='dark'||t==='light')document.documentElement.dataset.theme=t}catch(e){}";

// JSON-LD ni xavfsiz joylash
export const ld = (obj) => JSON.stringify(obj).replace(/</g, '\\u003c');
