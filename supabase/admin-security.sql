-- MIMOUVERSE — sécurité administrateur
-- À exécuter dans Supabase SQL Editor.
-- L'adresse ci-dessous identifie le seul compte administrateur autorisé.

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  pseudo text,
  avatar_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.user_roles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'reader' check (role in ('reader', 'admin')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles r
    join auth.users u on u.id = r.user_id
    where r.user_id = auth.uid()
      and r.role = 'admin'
      and lower(u.email) = 'juniorlakpo300@gmail.com'
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

drop policy if exists "Profiles are public to readers" on public.profiles;
create policy "Profiles are public to readers"
on public.profiles for select
to anon, authenticated
using (true);

drop policy if exists "Users can create their profile" on public.profiles;
create policy "Users can create their profile"
on public.profiles for insert
to authenticated
with check (id = auth.uid());

drop policy if exists "Users can edit their profile" on public.profiles;
create policy "Users can edit their profile"
on public.profiles for update
to authenticated
using (id = auth.uid() or public.is_admin())
with check (id = auth.uid() or public.is_admin());

drop policy if exists "Only admin can read roles" on public.user_roles;
create policy "Only admin can read roles"
on public.user_roles for select
to authenticated
using (user_id = auth.uid() or public.is_admin());

drop policy if exists "Only admin can manage roles" on public.user_roles;
create policy "Only admin can manage roles"
on public.user_roles for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- Après la première connexion Google de l'administrateur,
-- récupérer son UUID dans Authentication > Users puis exécuter :
-- insert into public.user_roles (user_id, role)
-- values ('UUID_DU_COMPTE_ADMIN', 'admin')
-- on conflict (user_id) do update set role = 'admin';

-- IMPORTANT : ne jamais mettre une clé sb_secret/service_role dans le frontend.
