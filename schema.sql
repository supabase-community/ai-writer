/**
* ENTRIES
* Note: This table contains user entries. Users should only be able to view and update their own entries.
*/
create table
  public.entries (
    id uuid not null default uuid_generate_v4 (),
    user_id uuid not null default auth.uid (),
    title text not null default ''::text,
    body text not null default ''::text,
    created_at timestamp with time zone not null default timezone ('utc'::text, now()),
    updated_at timestamp with time zone not null default timezone ('utc'::text, now()),
    constraint entries_pkey primary key (id),
    constraint entries_id_key unique (id),
    constraint entries_user_id_fkey foreign key (user_id) references auth.users (id)
  ) tablespace pg_default;
  
alter table entries enable row level security;

/* Ensure that created_at is unique for each entry */
create policy "Can view own entries." on entries for select using (auth.uid() = user_id);
create policy "Anyone can insert entries." on entries for insert using true;
create policy "Can update own entries." on entries for update using (auth.uid() = user_id);
create policy "Can delete own entries." on entries for delete using (auth.uid() = user_id);

-- Define a custom type for the Entry structure
CREATE TYPE Entry AS (
    id TEXT,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE,
    title TEXT,
    body TEXT
);

-- Create the function to backup entries
CREATE
OR REPLACE FUNCTION update_entries (updated_entries entry_type[]) RETURNS void AS $$
DECLARE
    entry_data entry_type;
BEGIN
    -- Process each entry in updated_entries
    FOREACH entry_data IN ARRAY updated_entries
    LOOP
        -- Update the existing entry
        UPDATE public.entries
        SET
            title = entry_data.title,
            body = entry_data.body,
            updated_at = entry_data.updated_at
        WHERE id = entry_data.id;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Create a function that reconciles local and server entries
CREATE OR REPLACE FUNCTION reconcile_entries(entries Entry[])
RETURNS SETOF entries AS $$
DECLARE
    entry Entry;
BEGIN
    FOREACH entry IN ARRAY entries
    LOOP
        -- Attempt to update the row if it exists
        UPDATE entries
        SET title = entry.title,
            body = entry.body,
            updated_at = entry.updated_at
        WHERE id = entry.id AND updated_at < entry.updated_at;

        -- If no row was updated, insert a new row
        IF NOT FOUND THEN
            INSERT INTO entries (id, created_at, updated_at, title, body, user_id)
            VALUES (entry.id, entry.created_at, entry.updated_at, entry.title, entry.body, auth.uid());
        END IF;
    END LOOP;

    -- Return all rows where user_id = auth.uid()
    RETURN QUERY SELECT * FROM entries WHERE user_id = auth.uid();
END;
$$ LANGUAGE plpgsql;


-- Create a function to create a new entry
CREATE
OR REPLACE FUNCTION create_entry (
  title text,
  body text,
  created_at timestamp with time zone,
  updated_at timestamp with time zone
) RETURNS uuid AS $$
DECLARE
    new_entry_id uuid;
BEGIN
    -- Insert a new entry
    INSERT INTO public.entries (id, user_id, title, body, created_at, updated_at)
    VALUES (
        uuid_generate_v4(),
        auth.uid(),
        title,
        body,
        created_at,
        updated_at
    )
    RETURNING id INTO new_entry_id;

    -- Return the ID of the newly created entry
    RETURN new_entry_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to delete an entry
CREATE
OR REPLACE FUNCTION delete_entry (entry_id uuid) RETURNS void AS $$
BEGIN
    -- Delete the entry with the specified ID
    DELETE FROM public.entries WHERE id = entry_id;
END;
$$ LANGUAGE plpgsql;