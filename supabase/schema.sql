-- =====================================================================
-- Usmanov Ceramic: ma'lumotlar bazasi sxemasi
-- Supabase -> SQL Editor -> New query -> shu matnni to'liq qo'ying -> Run
-- Bir necha marta ishga tushirsangiz ham zarar qilmaydi.
-- =====================================================================

create extension if not exists pgcrypto;

-- Mahsulotlar
create table if not exists public.products (
  id          uuid primary key default gen_random_uuid(),
  sort        integer not null default 0,
  cat         text not null check (cat in ('tovoqlar','kosalar','piyolalar','choynaklar','naborlar')),
  name_uz     text not null,
  name_ru     text not null default '',
  name_en     text not null default '',
  price       numeric(12,2) not null default 0 check (price >= 0), -- $, 1 dona uchun
  box_qty     integer not null default 0,                           -- qutidagi dona soni
  box_kg      numeric not null default 0,                           -- quti og'irligi (brutto), kg
  weight      numeric not null default 1 check (weight > 0),        -- 1 dona og'irligi, kg (brutto / dona)
  size        numeric not null default 0 check (size >= 0),
  size_label  jsonb not null default '{}'::jsonb,                   -- o'lcham 3 tilda: {"uz":"42 sm",...}
  pattern     integer not null default 0 check (pattern between 0 and 4),
  img         text not null default '',
  active      boolean not null default true,
  created_at  timestamptz not null default now()
);
create index if not exists products_cat_idx on public.products (cat, sort);

-- Sozlamalar (kontaktlar, kataloglar, shartnoma, bosh sahifa rasmi)
create table if not exists public.settings (
  key         text primary key,
  value       jsonb not null default '{}'::jsonb,
  updated_at  timestamptz not null default now()
);

-- Aloqa formasidan kelgan xabarlar
create table if not exists public.messages (
  id          bigint generated always as identity primary key,
  created_at  timestamptz not null default now(),
  name        text not null,
  email       text not null,
  phone       text not null default '',
  message     text not null,
  lang        text not null default 'uz',
  read        boolean not null default false
);
create index if not exists messages_created_idx on public.messages (created_at desc);

-- Statistika hodisalari: tashrif, mahsulot ko'rish, Telegram so'rov
create table if not exists public.events (
  id          bigint generated always as identity primary key,
  ts          timestamptz not null default now(),
  day         date not null default ((now() at time zone 'Asia/Tashkent')::date),
  sid         text not null,
  type        text not null check (type in ('visit','view','tg')),
  product_id  uuid,
  tons        numeric not null default 0
);
create index if not exists events_day_type_idx on public.events (day, type);

-- Admin login va paroli (bitta qator)
create table if not exists public.admin_users (
  id          integer primary key default 1 check (id = 1),
  username    text not null,
  pass_hash   text not null,
  updated_at  timestamptz not null default now()
);

-- Himoya: jadvallarga faqat server (service_role) kira oladi.
alter table public.products    enable row level security;
alter table public.settings    enable row level security;
alter table public.messages    enable row level security;
alter table public.events      enable row level security;
alter table public.admin_users enable row level security;

-- Rasmlar papkasi (hamma ko'ra oladi, faqat server yuklaydi)
insert into storage.buckets (id, name, public)
values ('images', 'images', true)
on conflict (id) do update set public = true;

-- Statistika hisoboti (admin panel uchun)
create or replace function public.uc_stats(p_from date, p_to date)
returns jsonb
language sql
stable
as $$
  select jsonb_build_object(
    'days', coalesce((
      select jsonb_agg(jsonb_build_object('d', d, 'v', v, 'q', q) order by d)
      from (
        select g::date as d,
          (select count(distinct e.sid) from public.events e where e.day = g::date and e.type = 'visit') as v,
          (select count(*) from public.events e where e.day = g::date and e.type = 'tg') as q
        from generate_series(p_from::timestamp, p_to::timestamp, interval '1 day') as g
      ) x
    ), '[]'::jsonb),
    'views', (select count(*) from public.events where day between p_from and p_to and type = 'view'),
    'tg',    (select count(*) from public.events where day between p_from and p_to and type = 'tg'),
    'tons',  (select coalesce(sum(least(tons, 22)), 0) from public.events where day between p_from and p_to and type = 'tg'),
    'top_tg', coalesce((
      select jsonb_agg(jsonb_build_object('id', product_id, 'n', n) order by n desc)
      from (select product_id, count(*) as n from public.events
            where day between p_from and p_to and type = 'tg' and product_id is not null
            group by product_id order by n desc limit 6) t
    ), '[]'::jsonb),
    'top_view', coalesce((
      select jsonb_agg(jsonb_build_object('id', product_id, 'n', n) order by n desc)
      from (select product_id, count(*) as n from public.events
            where day between p_from and p_to and type = 'view' and product_id is not null
            group by product_id order by n desc limit 6) t
    ), '[]'::jsonb),
    'by_cat', coalesce((
      select jsonb_agg(jsonb_build_object('cat', cat, 't', t) order by t desc)
      from (select p.cat, sum(least(e.tons, 22)) as t
            from public.events e join public.products p on p.id = e.product_id
            where e.day between p_from and p_to and e.type = 'tg'
            group by p.cat) s
    ), '[]'::jsonb),
    'buckets', (
      select jsonb_build_object(
        'a', count(*) filter (where tons <= 2),
        'b', count(*) filter (where tons > 2 and tons <= 5),
        'c', count(*) filter (where tons > 5 and tons <= 10),
        'd', count(*) filter (where tons > 10 and tons <= 22),
        'e', count(*) filter (where tons > 22))
      from public.events where day between p_from and p_to and type = 'tg'
    ),
    'recent', coalesce((
      select jsonb_agg(jsonb_build_object('id', product_id, 't', tons, 'ts', ts) order by ts desc)
      from (select product_id, tons, ts from public.events
            where day between p_from and p_to and type = 'tg'
            order by ts desc limit 10) r
    ), '[]'::jsonb)
  );
$$;

revoke all on function public.uc_stats(date, date) from public, anon, authenticated;
grant execute on function public.uc_stats(date, date) to service_role;
