-- =====================================================================
--  Beyond the Factory — Area clienti
--  Da eseguire UNA VOLTA in Supabase → SQL Editor → New query → Run.
--  Crea tabelle, regole di sicurezza (RLS), archivio documenti e
--  notifiche email. Leggi supabase/README.md prima di eseguirlo.
-- =====================================================================

create extension if not exists pgcrypto;
create extension if not exists pg_net;

-- ---------------------------------------------------------------------
-- Amministratori: le email del team che accedono al pannello /admin/
-- ---------------------------------------------------------------------
create table if not exists public.admins (
  email text primary key check (email = lower(email))
);
alter table public.admins enable row level security;
-- nessuna policy: la tabella è leggibile solo dalle funzioni qui sotto

create or replace function public.current_email()
returns text language sql stable as $$
  select lower(coalesce(auth.jwt() ->> 'email', ''))
$$;

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.admins a where a.email = public.current_email())
$$;

-- ---------------------------------------------------------------------
-- Profili clienti (dati obbligatori per fatturazione e spedizione)
-- ---------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  first_name text not null check (length(trim(first_name)) > 0),
  last_name text not null check (length(trim(last_name)) > 0),
  company text,
  tax_code text not null check (length(trim(tax_code)) > 0),
  phone text not null check (length(trim(phone)) > 4),
  address text not null check (length(trim(address)) > 0),
  postal_code text not null check (length(trim(postal_code)) > 0),
  city text not null check (length(trim(city)) > 0),
  province text not null check (length(trim(province)) > 0),
  country text not null check (length(trim(country)) > 0),
  notes text,
  lang text not null default 'it' check (lang in ('it', 'en', 'es', 'de', 'fr')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.profiles enable row level security;

-- l'email del profilo è sempre quella dell'account, non modificabile a mano
create or replace function public.profiles_set_email()
returns trigger language plpgsql as $$
begin
  new.email := public.current_email();
  new.updated_at := now();
  return new;
end $$;
drop trigger if exists profiles_set_email on public.profiles;
create trigger profiles_set_email before insert or update on public.profiles
  for each row when (not public.is_admin()) execute function public.profiles_set_email();

drop policy if exists "profilo: lettura" on public.profiles;
create policy "profilo: lettura" on public.profiles for select
  using (id = auth.uid() or public.is_admin());
drop policy if exists "profilo: creazione" on public.profiles;
create policy "profilo: creazione" on public.profiles for insert
  with check (id = auth.uid());
drop policy if exists "profilo: modifica" on public.profiles;
create policy "profilo: modifica" on public.profiles for update
  using (id = auth.uid() or public.is_admin())
  with check (id = auth.uid() or public.is_admin());

-- ---------------------------------------------------------------------
-- Ordini
-- ---------------------------------------------------------------------
do $$ begin
  create type public.order_status as enum
    ('consultation', 'design', 'review', 'production', 'finishing', 'shipping', 'delivered');
exception when duplicate_object then null; end $$;

create sequence if not exists public.order_code_seq;

-- codice leggibile: BTF-2026-001
create or replace function public.next_order_code()
returns text language sql volatile as $$
  select 'BTF-' || to_char(now(), 'YYYY') || '-' || lpad(nextval('public.order_code_seq')::text, 3, '0')
$$;

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  code text not null unique default public.next_order_code(),
  customer_email text not null check (customer_email = lower(trim(customer_email)) and customer_email like '%@%'),
  title text not null check (length(trim(title)) > 0),
  service text,
  status public.order_status not null default 'consultation',
  status_note text,
  carrier text,
  tracking_number text,
  tracking_url text check (tracking_url is null or tracking_url ~* '^https?://'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists orders_customer_email_idx on public.orders (customer_email);
alter table public.orders enable row level security;

-- vero se l'utente collegato può vedere l'ordine (è il cliente oppure un admin)
create or replace function public.can_access_order(p_order uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.orders o
    where o.id = p_order and (o.customer_email = public.current_email() or public.is_admin())
  )
$$;

drop policy if exists "ordini: lettura" on public.orders;
create policy "ordini: lettura" on public.orders for select
  using (customer_email = public.current_email() or public.is_admin());
drop policy if exists "ordini: gestione admin" on public.orders;
create policy "ordini: gestione admin" on public.orders for all
  using (public.is_admin()) with check (public.is_admin());

-- Cronologia degli stati (scritta automaticamente)
create table if not exists public.order_events (
  id bigint generated always as identity primary key,
  order_id uuid not null references public.orders (id) on delete cascade,
  status public.order_status not null,
  note text,
  created_at timestamptz not null default now()
);
create index if not exists order_events_order_idx on public.order_events (order_id, created_at);
alter table public.order_events enable row level security;
drop policy if exists "eventi: lettura" on public.order_events;
create policy "eventi: lettura" on public.order_events for select
  using (public.can_access_order(order_id));

create or replace function public.orders_track_status()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  new.updated_at := now();
  if tg_op = 'INSERT' or new.status is distinct from old.status
     or new.status_note is distinct from old.status_note then
    insert into public.order_events (order_id, status, note) values (new.id, new.status, new.status_note);
  end if;
  return new;
end $$;
drop trigger if exists orders_track_status_ins on public.orders;
create trigger orders_track_status_ins after insert on public.orders
  for each row execute function public.orders_track_status();
drop trigger if exists orders_track_status_upd on public.orders;
create trigger orders_track_status_upd before update on public.orders
  for each row execute function public.orders_track_status();

-- ---------------------------------------------------------------------
-- Documenti (i file stanno nel bucket privato "order-docs")
-- ---------------------------------------------------------------------
create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  name text not null,
  path text not null unique,
  size bigint,
  uploaded_by uuid default auth.uid(),
  from_admin boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists documents_order_idx on public.documents (order_id, created_at);
alter table public.documents enable row level security;

drop policy if exists "documenti: lettura" on public.documents;
create policy "documenti: lettura" on public.documents for select
  using (public.can_access_order(order_id));
drop policy if exists "documenti: caricamento" on public.documents;
create policy "documenti: caricamento" on public.documents for insert
  with check (public.can_access_order(order_id) and path like order_id::text || '/%');
drop policy if exists "documenti: eliminazione admin" on public.documents;
create policy "documenti: eliminazione admin" on public.documents for delete
  using (public.is_admin());

-- ---------------------------------------------------------------------
-- Messaggi (chat per ordine)
-- ---------------------------------------------------------------------
create table if not exists public.messages (
  id bigint generated always as identity primary key,
  order_id uuid not null references public.orders (id) on delete cascade,
  sender_id uuid default auth.uid(),
  from_admin boolean not null default false,
  body text not null check (length(trim(body)) > 0 and length(body) <= 4000),
  created_at timestamptz not null default now()
);
create index if not exists messages_order_idx on public.messages (order_id, created_at);
alter table public.messages enable row level security;

drop policy if exists "messaggi: lettura" on public.messages;
create policy "messaggi: lettura" on public.messages for select
  using (public.can_access_order(order_id));
drop policy if exists "messaggi: invio" on public.messages;
create policy "messaggi: invio" on public.messages for insert
  with check (public.can_access_order(order_id));

-- mittente e ruolo vengono decisi dal database, non dal browser
create or replace function public.stamp_sender()
returns trigger language plpgsql as $$
begin
  if tg_table_name = 'messages' then
    new.sender_id := auth.uid();
  else
    new.uploaded_by := auth.uid();
  end if;
  new.from_admin := public.is_admin();
  new.created_at := now();
  return new;
end $$;
drop trigger if exists messages_stamp on public.messages;
create trigger messages_stamp before insert on public.messages
  for each row execute function public.stamp_sender();
drop trigger if exists documents_stamp on public.documents;
create trigger documents_stamp before insert on public.documents
  for each row execute function public.stamp_sender();

-- ---------------------------------------------------------------------
-- Archivio file: bucket privato, cartella = id dell'ordine
-- ---------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit)
values ('order-docs', 'order-docs', false, 52428800)
on conflict (id) do nothing;

create or replace function public.storage_order_id(p_name text)
returns uuid language plpgsql immutable as $$
begin
  return split_part(p_name, '/', 1)::uuid;
exception when others then
  return null;
end $$;

drop policy if exists "order-docs: lettura" on storage.objects;
create policy "order-docs: lettura" on storage.objects for select
  using (bucket_id = 'order-docs' and public.can_access_order(public.storage_order_id(name)));
drop policy if exists "order-docs: caricamento" on storage.objects;
create policy "order-docs: caricamento" on storage.objects for insert
  with check (bucket_id = 'order-docs' and public.can_access_order(public.storage_order_id(name)));
drop policy if exists "order-docs: eliminazione admin" on storage.objects;
create policy "order-docs: eliminazione admin" on storage.objects for delete
  using (bucket_id = 'order-docs' and public.is_admin());

-- ---------------------------------------------------------------------
-- Aggiornamenti in tempo reale (chat, stato, documenti)
-- ---------------------------------------------------------------------
do $$ begin
  alter publication supabase_realtime add table public.messages, public.orders, public.order_events, public.documents;
exception when duplicate_object then null; end $$;

-- ---------------------------------------------------------------------
-- Notifiche email: a ogni nuovo messaggio e cambio di stato il database
-- chiama la Edge Function "notify" (vedi supabase/functions/notify).
-- ---------------------------------------------------------------------
create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

create table if not exists private.settings (
  key text primary key,
  value text not null
);

create or replace function private.notify_change()
returns trigger language plpgsql security definer set search_path = public, private as $$
declare
  v_url text := (select value from private.settings where key = 'notify_url');
  v_secret text := (select value from private.settings where key = 'webhook_secret');
begin
  if v_url is null or v_secret is null then
    return null;
  end if;
  -- per gli ordini avvisa solo quando cambia lo stato
  if tg_table_name = 'orders' then
    if new.status is not distinct from old.status then
      return null;
    end if;
  end if;
  perform net.http_post(
    url := v_url,
    headers := jsonb_build_object('Content-Type', 'application/json', 'x-webhook-secret', v_secret),
    body := jsonb_build_object(
      'type', tg_op,
      'table', tg_table_name,
      'record', to_jsonb(new),
      'old_record', case when tg_op = 'UPDATE' then to_jsonb(old) else null end
    )
  );
  return null;
end $$;

drop trigger if exists messages_notify on public.messages;
create trigger messages_notify after insert on public.messages
  for each row execute function private.notify_change();
drop trigger if exists orders_notify on public.orders;
create trigger orders_notify after update on public.orders
  for each row execute function private.notify_change();

-- =====================================================================
--  DA COMPLETARE (sostituisci i valori tra virgolette e rilancia solo
--  queste righe):
--
--  insert into public.admins (email) values ('gianni@esempio.it'), ('andrea@esempio.it')
--    on conflict do nothing;
--
--  insert into private.settings (key, value) values
--    ('notify_url', 'https://IL-TUO-PROGETTO.supabase.co/functions/v1/notify'),
--    ('webhook_secret', 'UNA-STRINGA-LUNGA-E-CASUALE')
--  on conflict (key) do update set value = excluded.value;
-- =====================================================================
