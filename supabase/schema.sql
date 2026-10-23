create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text not null check (char_length(trim(username)) between 3 and 24),
  created_at timestamptz not null default now()
);

create unique index if not exists profiles_username_lower_idx
  on public.profiles (lower(username));

create or replace function public.create_profile_for_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  profile_username text;
begin
  profile_username := trim(new.raw_user_meta_data ->> 'username');

  if profile_username is null or char_length(profile_username) not between 3 and 24 then
    raise exception 'A username between 3 and 24 characters is required';
  end if;

  insert into public.profiles (id, username)
  values (new.id, profile_username);

  return new;
end;
$$;

drop trigger if exists create_profile_after_signup on auth.users;
create trigger create_profile_after_signup
  after insert on auth.users
  for each row execute function public.create_profile_for_new_user();

create table if not exists public.game_saves (
  user_id uuid primary key references auth.users (id) on delete cascade,
  class_id smallint not null check (class_id between 1 and 4),
  character_name text not null,
  attack integer not null check (attack > 0),
  max_health integer not null check (max_health > 0),
  current_health integer not null check (current_health between 0 and max_health),
  stage text not null check (stage in ('forest', 'cave', 'deeper cave')),
  enemy_health integer not null check (enemy_health >= 0),
  used_heal boolean not null default false,
  used_block boolean not null default false,
  stage_complete boolean not null default false,
  completed boolean not null default false,
  updated_at timestamptz not null default now()
);

create or replace function public.set_game_save_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists set_game_save_updated_at on public.game_saves;
create trigger set_game_save_updated_at
  before update on public.game_saves
  for each row execute function public.set_game_save_updated_at();

alter table public.profiles enable row level security;
alter table public.game_saves enable row level security;

drop policy if exists "Users can read their own profile" on public.profiles;
create policy "Users can read their own profile"
  on public.profiles for select to authenticated
  using ((select auth.uid()) = id);

drop policy if exists "Users can read their own save" on public.game_saves;
create policy "Users can read their own save"
  on public.game_saves for select to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "Users can create their own save" on public.game_saves;
create policy "Users can create their own save"
  on public.game_saves for insert to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users can update their own save" on public.game_saves;
create policy "Users can update their own save"
  on public.game_saves for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

grant select on public.profiles to authenticated;
grant select, insert, update on public.game_saves to authenticated;
