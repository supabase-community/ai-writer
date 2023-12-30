/** 
* USERS
* Note: This table contains user data. Users should only be able to view and update their own data.
*/
create table users (
  -- UUID from auth.users
  id uuid references auth.users not null primary key,
  full_name text,
  avatar_url text,
);
alter table users enable row level security;
create policy "Can view own user data." on users for select using (auth.uid() = id);
create policy "Can update own user data." on users for update using (auth.uid() = id);

/**
* This trigger automatically creates a user entry when a new user signs up via Supabase Auth.
*/ 
create function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.users (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

/**
* ENTRIES
* Note: This table contains user entries. Users should only be able to view and update their own entries.
*/
create table entries (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null,
  title text,
  body text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table entries enable row level security;
create policy "Can view own entries." on entries for select using (auth.uid() = user_id);
create policy "Can insert own entries." on entries for insert with check (auth.uid() = user_id);
create policy "Can update own entries." on entries for update using (auth.uid() = user_id);
create policy "Can delete own entries." on entries for delete using (auth.uid() = user_id);

/**
 * REALTIME ENTRIES
 * Only allow realtime listening on public tables.
 */
drop publication if exists supabase_realtime;
create publication supabase_realtime for table entries;