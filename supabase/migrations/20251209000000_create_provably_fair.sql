-- Create user_seeds table
create table public.user_seeds (
  user_id uuid references auth.users not null primary key,
  server_seed text not null,
  client_seed text not null,
  nonce bigint not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.user_seeds enable row level security;

-- Policies for user_seeds
create policy "Users can view their own seeds"
  on public.user_seeds for select
  using (auth.uid() = user_id);

create policy "Users can update their own seeds"
  on public.user_seeds for update
  using (auth.uid() = user_id);

create policy "Users can insert their own seeds"
  on public.user_seeds for insert
  with check (auth.uid() = user_id);

-- Create game_rolls table (audit log)
create table public.game_rolls (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  case_id uuid references public.cases not null,
  server_seed text not null, -- The seed used for this roll
  client_seed text not null,
  nonce bigint not null,
  roll_result bigint not null, -- The raw number (0-100000 or similar)
  item_won_id uuid references public.items not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.game_rolls enable row level security;

-- Policies for game_rolls
create policy "Users can view their own rolls"
  on public.game_rolls for select
  using (auth.uid() = user_id);

-- Open access to read (or restrict to self, usually self is enough)
