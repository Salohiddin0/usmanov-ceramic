// Faqat serverda ishlatiladi. Bu faylni 'use client' komponentlarga import qilmang.
import { createClient } from '@supabase/supabase-js';

let client = null;

export const hasDb = () => Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);

export function sb() {
  if (!client) {
    if (!hasDb()) throw new Error('SUPABASE_URL va SUPABASE_SERVICE_ROLE_KEY sozlanmagan');
    client = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return client;
}
