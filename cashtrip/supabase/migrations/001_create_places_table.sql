-- Create places table for storing destination information
create table if not exists public.places (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  city text not null,
  country text not null,
  country_code char(2),
  coordinates geography(point),
  timezone text,
  description text,
  is_popular boolean default false,
  search_count int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Indexes for performance
create index if not exists idx_places_city_country on public.places(city, country);
create index if not exists idx_places_popular on public.places(is_popular) where is_popular = true;
create index if not exists idx_places_search_count on public.places(search_count desc);

-- Enable RLS
alter table public.places enable row level security;

-- Policy: Anyone can read places
create policy "public_read_places"
  on public.places for select
  to public
  using (true);

-- Policy: Only authenticated users can insert places (or service role)
create policy "authenticated_insert_places"
  on public.places for insert
  to authenticated
  with check (true);

-- Policy: Only service role can update/delete
create policy "service_role_modify_places"
  on public.places for update
  to service_role
  using (true);

-- Function to update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Trigger to auto-update updated_at
create trigger places_updated_at
  before update on public.places
  for each row
  execute function public.handle_updated_at();

-- Add some comments
comment on table public.places is 'Stores destination/place information for the Cash Trip app';
comment on column public.places.is_popular is 'Flag for popular destinations that should be pre-warmed';
comment on column public.places.search_count is 'Number of times this place has been searched/viewed';











