-- =====================================================================
-- Usmanov Ceramic: statistikani tonnadan DONAga o'tkazish (bir marta)
-- Supabase -> SQL Editor -> New query -> shu matnni qo'ying -> Run
-- Eski (tonnadagi) sinov so'rovlari bilan aralashmasligi uchun ular o'chiriladi.
-- Tashriflar va ko'rishlar statistikasi saqlanib qoladi.
-- =====================================================================

delete from public.events where type = 'tg' and tons < 10;

create or replace function public.uc_stats(p_from date, p_to date)
returns jsonb
language sql
stable
as $$
  -- Eslatma: events.tons ustunida endi so'ralgan DONA soni saqlanadi
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
    'tons',  (select coalesce(sum(least(tons, 1000)), 0) from public.events where day between p_from and p_to and type = 'tg'),
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
      from (select p.cat, sum(least(e.tons, 1000)) as t
            from public.events e join public.products p on p.id = e.product_id
            where e.day between p_from and p_to and e.type = 'tg'
            group by p.cat) s
    ), '[]'::jsonb),
    'buckets', (
      select jsonb_build_object(
        'a', count(*) filter (where tons <= 50),
        'b', count(*) filter (where tons > 50 and tons <= 100),
        'c', count(*) filter (where tons > 100 and tons <= 300),
        'd', count(*) filter (where tons > 300 and tons <= 1000),
        'e', count(*) filter (where tons > 1000))
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
