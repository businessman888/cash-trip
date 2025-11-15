-- Create images table for storing image metadata
create table if not exists public.images (
  id uuid primary key default gen_random_uuid(),
  
  -- Relationships
  place_id uuid references public.places(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  
  -- Storage information
  bucket text not null default 'places',
  path text not null unique,
  
  -- Technical metadata
  mime text not null,
  width int,
  height int,
  size_bytes bigint,
  
  -- Visual metadata
  blurhash text,
  dominant_hex char(7),
  
  -- Classification
  is_primary boolean default false,
  image_type text check (image_type in ('hero', 'gallery', 'avatar', 'thumbnail')),
  
  -- Source information
  source text not null check (source in ('unsplash', 'google-places', 'upload', 'partner', 'manual')),
  source_url text,
  source_id text,
  
  -- License and attribution
  author text,
  author_url text,
  license text default 'unsplash',
  
  -- Deduplication
  hash_sha256 text,
  
  -- Timestamps
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Indexes for performance
create index if not exists idx_images_place_id on public.images(place_id);
create index if not exists idx_images_user_id on public.images(user_id);
create index if not exists idx_images_hash on public.images(hash_sha256);
create index if not exists idx_images_source_id on public.images(source_id);
create index if not exists idx_images_is_primary on public.images(is_primary) where is_primary = true;
create index if not exists idx_images_bucket_path on public.images(bucket, path);

-- Enable RLS
alter table public.images enable row level security;

-- Policy: Anyone can read images
create policy "public_read_images"
  on public.images for select
  to public
  using (true);

-- Policy: Authenticated users can insert their own avatar images
create policy "users_insert_own_avatar"
  on public.images for insert
  to authenticated
  with check (
    user_id = auth.uid() 
    AND image_type = 'avatar'
  );

-- Policy: Service role can insert any images
create policy "service_role_insert_images"
  on public.images for insert
  to service_role
  with check (true);

-- Policy: Service role can update/delete
create policy "service_role_modify_images"
  on public.images for update
  to service_role
  using (true);

-- Trigger to auto-update updated_at
create trigger images_updated_at
  before update on public.images
  for each row
  execute function public.handle_updated_at();

-- Add comments
comment on table public.images is 'Stores metadata for all images in the Cash Trip app';
comment on column public.images.is_primary is 'Primary/hero image for a place';
comment on column public.images.hash_sha256 is 'SHA-256 hash for deduplication';
comment on column public.images.blurhash is 'BlurHash for placeholder while loading';
comment on column public.images.dominant_hex is 'Dominant color in hex format';










