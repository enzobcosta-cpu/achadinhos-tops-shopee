-- ============================================================
-- ACHADINHOS TOPS SHO — BANCO DE DADOS SUPABASE
-- Cole este SQL no SQL Editor do seu projeto Supabase.
-- ============================================================

create extension if not exists pgcrypto;

create table if not exists public.links (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text default '',
  url text not null,
  icon text default '🔗',
  position integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.links enable row level security;

-- A página pública pode somente visualizar links ativos.
drop policy if exists "Public can view active links" on public.links;
create policy "Public can view active links"
on public.links
for select
to anon, authenticated
using (active = true);

-- O usuário autenticado pode gerenciar os links.
drop policy if exists "Authenticated can manage links" on public.links;
create policy "Authenticated can manage links"
on public.links
for all
to authenticated
using (true)
with check (true);

-- ============================================================
-- LINKS INICIAIS
-- ============================================================

insert into public.links (title, description, url, icon, position, active)
values
(
  'Minha loja na Shopee',
  'Confira nossas ofertas e achadinhos!',
  'https://br.shp.ee/quyo09b7?fromSource=copy_link&smtt=0.0.9',
  '🛍️',
  0,
  true
),
(
  'Nosso Instagram',
  'Novidades, ofertas e muito mais!',
  'https://www.instagram.com/achadinhostopsshopee31?stkn=MXM3bmtpMGprcXNnMA%3D%3D&utm_source=qr',
  '📸',
  1,
  true
);
