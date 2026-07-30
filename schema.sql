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
