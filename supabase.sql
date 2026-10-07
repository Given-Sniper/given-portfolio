-- Given Portfolio: database and file storage setup.
--
-- Run once in a new Supabase project.
--
-- BEFORE RUNNING:
-- Replace every OWNER_USER_UUID below with the user UUID
-- of your manually created owner account.
--
-- This UUID is an account identifier, not your password.

begin;

-- Information about uploaded certificates, photos and CVs.
create table public.portfolio_assets (
  id uuid primary key default gen_random_uuid(),

  kind text not null
    check (kind in ('certificate', 'profile', 'cv')),

  title text not null
    check (length(trim(title)) between 1 and 200),

  issuer text,

  issued_on date,

  verification_url text
    check (
      verification_url is null
      or verification_url like 'https://%'
    ),

  file_path text not null unique,

  created_at timestamptz not null default now(),

  check (
    kind <> 'certificate'
    or (
      issuer is not null
      and length(trim(issuer)) > 0
      and issued_on is not null
    )
  )
);

-- Enforce access rules for database requests.
alter table public.portfolio_assets
  enable row level security;

-- Visitors can read the portfolio catalogue.
grant select on public.portfolio_assets
  to anon, authenticated;

-- Signed-in users still need to pass the owner policies below.
grant insert, update, delete on public.portfolio_assets
  to authenticated;

create policy "Visitors can read portfolio entries"
  on public.portfolio_assets
  for select
  to anon, authenticated
  using (true);

-- Only your owner account can add entries.
create policy "Owner can add portfolio entries"
  on public.portfolio_assets
  for insert
  to authenticated
  with check (
    auth.uid() = 'OWNER_USER_UUID'::uuid
    and split_part(file_path, '/', 1) = auth.uid()::text
  );

-- Only your owner account can update entries.
create policy "Owner can update portfolio entries"
  on public.portfolio_assets
  for update
  to authenticated
  using (
    auth.uid() = 'OWNER_USER_UUID'::uuid
  )
  with check (
    auth.uid() = 'OWNER_USER_UUID'::uuid
    and split_part(file_path, '/', 1) = auth.uid()::text
  );

-- Only your owner account can remove entries.
create policy "Owner can remove portfolio entries"
  on public.portfolio_assets
  for delete
  to authenticated
  using (
    auth.uid() = 'OWNER_USER_UUID'::uuid
  );

-- Public files can be viewed by portfolio visitors.
-- Maximum file size: 10 MB.
insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'portfolio',
  'portfolio',
  true,
  10485760,
  array[
    'image/jpeg',
    'image/png',
    'image/webp',
    'application/pdf'
  ]
);

-- Only the owner can manage files in their own folder.
-- The upload code stores files as:
-- OWNER_USER_UUID/random-file-name.extension
create policy "Owner can manage portfolio files"
  on storage.objects
  for all
  to authenticated
  using (
    bucket_id = 'portfolio'
    and auth.uid() = 'OWNER_USER_UUID'::uuid
    and (storage.foldername(name))[1] = auth.uid()::text
  )
  with check (
    bucket_id = 'portfolio'
    and auth.uid() = 'OWNER_USER_UUID'::uuid
    and (storage.foldername(name))[1] = auth.uid()::text
  );

commit;