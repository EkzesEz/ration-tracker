-- ═══════════════════════════════════════════════════════════════════════════
-- Схема для синхронизации трекера. Выполни ОДИН раз в Supabase:
--   Проект → SQL Editor → New query → вставь всё это → Run.
-- Хранит одну строку на пользователя: весь дневник как JSON (last-write-wins).
-- ═══════════════════════════════════════════════════════════════════════════

create table if not exists public.tracker_state (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  data       jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- Row Level Security: каждый видит и правит ТОЛЬКО свою строку.
alter table public.tracker_state enable row level security;

drop policy if exists "own row select" on public.tracker_state;
create policy "own row select" on public.tracker_state
  for select using (auth.uid() = user_id);

drop policy if exists "own row upsert" on public.tracker_state;
drop policy if exists "own row insert" on public.tracker_state;
create policy "own row insert" on public.tracker_state
  for insert with check (auth.uid() = user_id);

drop policy if exists "own row update" on public.tracker_state;
create policy "own row update" on public.tracker_state
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ═══════════════════════════════════════════════════════════════════════════
-- ОБЩАЯ база продуктов: добавленное одним пользователем видят все.
-- Читать может любой вошедший, править/удалять — только автор своих записей.
-- ВНИМАНИЕ: поле author (логин из email) виден всем пользователям сервиса.
-- ═══════════════════════════════════════════════════════════════════════════

create table if not exists public.shared_products (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null default auth.uid() references auth.users (id) on delete cascade,
  author     text not null default split_part(coalesce(auth.jwt() ->> 'email', 'аноним'), '@', 1),
  name       text not null,
  kcal       numeric not null,
  p          numeric not null default 0,
  f          numeric not null default 0,
  c          numeric not null default 0,
  created_at timestamptz not null default now()
);

alter table public.shared_products enable row level security;

drop policy if exists "shared read all" on public.shared_products;
create policy "shared read all" on public.shared_products
  for select to authenticated using (true);

drop policy if exists "shared insert own" on public.shared_products;
create policy "shared insert own" on public.shared_products
  for insert to authenticated with check (auth.uid() = user_id);

drop policy if exists "shared update own" on public.shared_products;
create policy "shared update own" on public.shared_products
  for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "shared delete own" on public.shared_products;
create policy "shared delete own" on public.shared_products
  for delete to authenticated using (auth.uid() = user_id);

-- ═══════════════════════════════════════════════════════════════════════════
-- API-ТОКЕНЫ для MCP (добавление еды из чата с Claude).
-- Токен — случайная строка, привязанная к пользователю. Пароль и service_role
-- нигде не участвуют. Функции ниже работают через SECURITY DEFINER: они сами
-- проверяют токен и пишут ТОЛЬКО в данные его владельца.
--
-- Создать себе токен (выполни отдельно, подставив свой email):
--   insert into public.api_tokens (token, user_id, label)
--   values (encode(gen_random_bytes(24), 'hex'),
--           (select id from auth.users where email = 'ТВОЙ@EMAIL'), 'mcp')
--   returning token;
-- ═══════════════════════════════════════════════════════════════════════════

create table if not exists public.api_tokens (
  token      text primary key,
  user_id    uuid not null references auth.users (id) on delete cascade,
  label      text default 'mcp',
  created_at timestamptz not null default now()
);

-- RLS включён и политик нет: напрямую таблицу не прочитать никому,
-- доступ только изнутри функций ниже.
alter table public.api_tokens enable row level security;

-- Добавить еду в приём на дату (приём создаётся, если его нет).
create or replace function public.api_log_food(
  p_token text, p_name text, p_kcal numeric,
  p_p numeric default 0, p_f numeric default 0, p_c numeric default 0,
  p_qty numeric default 1, p_meal text default 'Другое', p_date text default null
) returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  v_user uuid; v_date text; v_data jsonb; v_days jsonb; v_day jsonb;
  v_meal jsonb; v_items jsonb; v_item jsonb; v_new jsonb;
  v_idx int := -1; v_found int := -1; v_i int;
begin
  select user_id into v_user from api_tokens where token = p_token;
  if v_user is null then raise exception 'bad token'; end if;

  v_date := coalesce(p_date, to_char((now() at time zone 'Europe/Moscow')::date, 'YYYY-MM-DD'));

  select coalesce(data, '{}'::jsonb) into v_data from tracker_state where user_id = v_user;
  v_data := coalesce(v_data, '{}'::jsonb);
  v_days := coalesce(v_data->'days', '{}'::jsonb);
  v_day  := coalesce(v_days->v_date, '[]'::jsonb);

  for v_i in 0 .. jsonb_array_length(v_day) - 1 loop
    if v_day->v_i->>'name' = p_meal then v_idx := v_i; exit; end if;
  end loop;

  v_new := jsonb_build_object('name', p_name, 'kcal', p_kcal, 'p', p_p,
                              'f', p_f, 'c', p_c, 'qty', p_qty);

  if v_idx = -1 then
    v_day := v_day || jsonb_build_array(
      jsonb_build_object('name', p_meal, 'items', jsonb_build_array(v_new)));
  else
    v_meal  := v_day->v_idx;
    v_items := coalesce(v_meal->'items', '[]'::jsonb);
    for v_i in 0 .. jsonb_array_length(v_items) - 1 loop
      if v_items->v_i->>'name' = p_name then v_found := v_i; exit; end if;
    end loop;
    if v_found = -1 then
      v_items := v_items || jsonb_build_array(v_new);
    else
      v_item  := v_items->v_found;
      v_item  := jsonb_set(v_item, '{qty}',
                   to_jsonb(coalesce((v_item->>'qty')::numeric, 1) + p_qty));
      v_items := jsonb_set(v_items, array[v_found::text], v_item);
    end if;
    v_meal := jsonb_set(v_meal, '{items}', v_items);
    v_day  := jsonb_set(v_day, array[v_idx::text], v_meal);
  end if;

  v_days := jsonb_set(v_days, array[v_date], v_day, true);
  v_data := jsonb_set(v_data, '{days}', v_days, true);
  v_data := jsonb_set(v_data, '{updatedAt}',
              to_jsonb((extract(epoch from now()) * 1000)::bigint), true);

  insert into tracker_state (user_id, data, updated_at)
  values (v_user, v_data, now())
  on conflict (user_id) do update set data = excluded.data, updated_at = now();

  return jsonb_build_object('ok', true, 'date', v_date, 'meal', p_meal, 'added', v_new);
end $$;

-- Добавить продукт в общую базу.
create or replace function public.api_add_product(
  p_token text, p_name text, p_kcal numeric,
  p_p numeric default 0, p_f numeric default 0, p_c numeric default 0
) returns jsonb
language plpgsql security definer set search_path = public as $$
declare v_user uuid; v_author text; v_id uuid;
begin
  select user_id into v_user from api_tokens where token = p_token;
  if v_user is null then raise exception 'bad token'; end if;
  select split_part(coalesce(email, 'аноним'), '@', 1) into v_author
    from auth.users where id = v_user;
  insert into shared_products (user_id, author, name, kcal, p, f, c)
  values (v_user, v_author, p_name, p_kcal, p_p, p_f, p_c)
  returning id into v_id;
  return jsonb_build_object('ok', true, 'id', v_id, 'author', v_author);
end $$;

-- Посмотреть день: итоги, норма, приёмы.
create or replace function public.api_get_day(p_token text, p_date text default null)
returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  v_user uuid; v_date text; v_data jsonb; v_day jsonb;
  v_kcal numeric := 0; v_p numeric := 0; v_f numeric := 0; v_c numeric := 0;
begin
  select user_id into v_user from api_tokens where token = p_token;
  if v_user is null then raise exception 'bad token'; end if;

  v_date := coalesce(p_date, to_char((now() at time zone 'Europe/Moscow')::date, 'YYYY-MM-DD'));
  select coalesce(data, '{}'::jsonb) into v_data from tracker_state where user_id = v_user;
  v_data := coalesce(v_data, '{}'::jsonb);
  v_day  := coalesce(v_data->'days'->v_date, '[]'::jsonb);

  select coalesce(sum((it->>'kcal')::numeric * coalesce((it->>'qty')::numeric, 1)), 0),
         coalesce(sum((it->>'p')::numeric    * coalesce((it->>'qty')::numeric, 1)), 0),
         coalesce(sum((it->>'f')::numeric    * coalesce((it->>'qty')::numeric, 1)), 0),
         coalesce(sum((it->>'c')::numeric    * coalesce((it->>'qty')::numeric, 1)), 0)
    into v_kcal, v_p, v_f, v_c
    from jsonb_array_elements(v_day) m,
         jsonb_array_elements(coalesce(m->'items', '[]'::jsonb)) it;

  return jsonb_build_object(
    'ok', true, 'date', v_date,
    'totals', jsonb_build_object('kcal', v_kcal, 'p', v_p, 'f', v_f, 'c', v_c),
    'norm', coalesce(v_data->'norm', 'null'::jsonb),
    'meals', v_day);
end $$;

revoke all on function public.api_log_food(text, text, numeric, numeric, numeric, numeric, numeric, text, text) from public;
revoke all on function public.api_add_product(text, text, numeric, numeric, numeric, numeric) from public;
revoke all on function public.api_get_day(text, text) from public;
grant execute on function public.api_log_food(text, text, numeric, numeric, numeric, numeric, numeric, text, text) to anon, authenticated;
grant execute on function public.api_add_product(text, text, numeric, numeric, numeric, numeric) to anon, authenticated;
grant execute on function public.api_get_day(text, text) to anon, authenticated;
