-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- USERS (Public Profiles)
create table public.users (
  id uuid references auth.users not null primary key,
  username text unique,
  avatar_url text,
  balance numeric default 0,
  client_seed text,
  nonce integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.users enable row level security;

-- Policies for users
create policy "Public profiles are viewable by everyone."
  on public.users for select
  using ( true );

create policy "Users can insert their own profile."
  on public.users for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on public.users for update
  using ( auth.uid() = id );

-- CASES
create table public.cases (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  slug text unique not null,
  price numeric not null,
  image_url text,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.cases enable row level security;

create policy "Cases are viewable by everyone."
  on public.cases for select
  using ( true );

-- ITEMS
create table public.items (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  image_url text,
  rarity text not null, -- common, rare, epic, legendary
  price numeric not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.items enable row level security;

create policy "Items are viewable by everyone."
  on public.items for select
  using ( true );

-- CASE_ITEMS (Many-to-Many)
create table public.case_items (
  id uuid default uuid_generate_v4() primary key,
  case_id uuid references public.cases not null,
  item_id uuid references public.items not null,
  drop_chance numeric not null, -- Percentage 0-100
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.case_items enable row level security;

create policy "Case items are viewable by everyone."
  on public.case_items for select
  using ( true );

-- USER_ITEMS (Inventory)
create table public.user_items (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users not null,
  item_id uuid references public.items not null,
  status text default 'in_inventory', -- in_inventory, sold, withdrawn
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.user_items enable row level security;

create policy "Users can view own items."
  on public.user_items for select
  using ( auth.uid() = user_id );

-- TRANSACTIONS
create table public.transactions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users not null,
  amount numeric not null,
  type text not null, -- deposit, withdraw, case_open, item_sell
  reference_id uuid, -- link to case or item
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.transactions enable row level security;

create policy "Users can view own transactions."
  on public.transactions for select
  using ( auth.uid() = user_id );

-- PROVABLY FAIR GAMES
create table public.provably_fair_games (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users not null,
  case_id uuid references public.cases not null,
  server_seed text not null,
  client_seed text not null,
  nonce integer not null,
  roll_result numeric not null,
  item_won_id uuid references public.items not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.provably_fair_games enable row level security;

create policy "Users can view own games."
  on public.provably_fair_games for select
  using ( auth.uid() = user_id );

-- Function to handle new user creation
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.users (id, username, avatar_url)
  values (new.id, new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'avatar_url');
  return new;
end;
$$;

-- Trigger for new user
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
