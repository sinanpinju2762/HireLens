-- ============================================================
-- HireLens — Supabase Schema
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- 1. PROFILES (extends auth.users)
create table if not exists profiles (
  id               uuid references auth.users on delete cascade primary key,
  name             text,
  email            text,
  total_interviews integer default 0,
  total_resumes    integer default 0,
  avg_score        integer default 0,
  created_at       timestamp with time zone default now()
);

-- Row Level Security
alter table profiles enable row level security;

create policy "Users can view own profile"
  on profiles for select
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on profiles for insert
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- 2. INTERVIEWS
create table if not exists interviews (
  id          uuid default gen_random_uuid() primary key,
  user_id     uuid references auth.users on delete cascade not null,
  question    text not null,
  answer      text,
  category    text,
  score       integer default 0,
  feedback    jsonb,
  created_at  timestamp with time zone default now()
);

alter table interviews enable row level security;

create policy "Users can manage own interviews"
  on interviews for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);


-- 3. RESUMES
create table if not exists resumes (
  id          uuid default gen_random_uuid() primary key,
  user_id     uuid references auth.users on delete cascade not null,
  file_name   text,
  score       integer default 0,
  feedback    jsonb,
  created_at  timestamp with time zone default now()
);

alter table resumes enable row level security;

create policy "Users can manage own resumes"
  on resumes for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);


-- 4. Helper: increment resume count
create or replace function increment_resume_count(uid uuid)
returns void language plpgsql security definer as $$
begin
  update profiles set total_resumes = total_resumes + 1 where id = uid;
end;
$$;
