/**
* ENTRIES
* Note: This table contains user entries. Users should only be able to view and update their own entries.
*/
create table entries (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users default auth.uid() not null,
  title text not null default '',
  body text not null default '',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table entries enable row level security;

/* Ensure that created_at is unique for each entry */
alter table entries add constraint unique_created_at unique (created_at);
create policy "Can view own entries." on entries for select using (auth.uid() = user_id);
create policy "Can insert own entries." on entries for insert with check (auth.uid() = user_id);
create policy "Can update own entries." on entries for update using (auth.uid() = user_id);
create policy "Can delete own entries." on entries for delete using (auth.uid() = user_id);