-- Run once in Supabase SQL Editor. No browser service-role key is required.
-- Only the signed-in user can read or modify their own learning snapshot.
create table if not exists public.artikel_progress (
  user_id uuid primary key references auth.users(id) on delete cascade,
  payload jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
alter table public.artikel_progress enable row level security;
revoke all on table public.artikel_progress from anon, authenticated;
grant select, insert, update on public.artikel_progress to authenticated;
drop policy if exists artikel_progress_select_own on public.artikel_progress;
drop policy if exists artikel_progress_insert_own on public.artikel_progress;
drop policy if exists artikel_progress_update_own on public.artikel_progress;
create policy artikel_progress_select_own on public.artikel_progress
for select to authenticated using ((select auth.uid()) = user_id);
create policy artikel_progress_insert_own on public.artikel_progress
for insert to authenticated with check ((select auth.uid()) = user_id);
create policy artikel_progress_update_own on public.artikel_progress
for update to authenticated using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);
