// Admin panel uchun server bilan aloqa
export async function api(path, opts = {}) {
  const headers = { ...(opts.headers || {}) };
  if (opts.body && !(opts.body instanceof FormData)) headers['content-type'] = 'application/json';
  const r = await fetch(`/api/admin/${path}`, { ...opts, headers, cache: 'no-store' });
  let j = null;
  try {
    j = await r.json();
  } catch {}
  if (!r.ok) {
    const e = new Error((j && j.error) || `Xato: ${r.status}`);
    e.status = r.status;
    throw e;
  }
  return j;
}

export const post = (p, b) => api(p, { method: 'POST', body: JSON.stringify(b) });
export const patch = (p, b) => api(p, { method: 'PATCH', body: JSON.stringify(b) });
export const del = (p) => api(p, { method: 'DELETE' });

// Rasmni brauzerda kichraytirib, JPEG qilib yuklaydi
export async function uploadImage(file, folder, max = 1600) {
  if (!/^image\//.test(file.type)) throw new Error('Faqat rasm fayli');
  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    await new Promise((res, rej) => {
      img.onload = res;
      img.onerror = () => rej(new Error("Rasmni o'qib bo'lmadi"));
      img.src = url;
    });
    const sc = Math.min(1, max / Math.max(img.naturalWidth, img.naturalHeight));
    const c = document.createElement('canvas');
    c.width = Math.round(img.naturalWidth * sc);
    c.height = Math.round(img.naturalHeight * sc);
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.drawImage(img, 0, 0, c.width, c.height);
    const blob = await new Promise((res) => c.toBlob(res, 'image/jpeg', 0.86));
    if (!blob) throw new Error("Rasmni tayyorlab bo'lmadi");
    const fd = new FormData();
    fd.append('file', blob, 'image.jpg');
    fd.append('folder', folder);
    const j = await api('upload', { method: 'POST', body: fd });
    return j.url;
  } finally {
    URL.revokeObjectURL(url);
  }
}

export const fmtDate = (s) => {
  const d = new Date(s);
  const p = (n) => String(n).padStart(2, '0');
  return `${p(d.getDate())}.${p(d.getMonth() + 1)}.${d.getFullYear()} ${p(d.getHours())}:${p(d.getMinutes())}`;
};
