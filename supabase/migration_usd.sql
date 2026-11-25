-- =====================================================================
-- Usmanov Ceramic: narxlarni dollarga o'tkazish (bir marta ishga tushiriladi)
-- Supabase -> SQL Editor -> New query -> shu matnni qo'ying -> Run
-- =====================================================================

-- Narx endi: $ / 1 dona (kasr bilan, masalan 7.50)
alter table public.products alter column price type numeric(12,2) using price::numeric;

-- Qutidagi dona soni, quti og'irligi (brutto) va 3 tildagi o'lcham
alter table public.products add column if not exists box_qty    integer not null default 0;
alter table public.products add column if not exists box_kg     numeric not null default 0;
alter table public.products add column if not exists size_label jsonb   not null default '{}'::jsonb;
