-- Create entries table
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

-- Create RLS policies for entries table
-- Select
CREATE POLICY "Enable select for users based on user_id" ON "public"."entries"
AS PERMISSIVE FOR SELECT
TO public
USING (auth.uid() = user_id)

-- Insert
CREATE POLICY "Enable insert for authenticated users only" ON "public"."entries"
AS PERMISSIVE FOR INSERT
TO authenticated
WITH CHECK (true)

-- Update
CREATE POLICY "Enable update for users based on user_id" ON "public"."entries"
AS PERMISSIVE FOR UPDATE
TO public
USING (auth.uid() = user_id)

-- Delete
CREATE POLICY "Enable delete for users based on user_id" ON "public"."entries"
AS PERMISSIVE FOR DELETE
TO public
USING (auth.uid() = user_id)


-- Define a custom type for the Entry structure
CREATE TYPE Entry AS (
    id TEXT,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE,
    title TEXT,
    body TEXT
);

-- Create a function that reconciles local and server entries
CREATE
OR REPLACE FUNCTION reconcile_entries (local_entries Entry[]) RETURNS SETOF Entry AS $$
DECLARE
    entry Entry;
BEGIN
    IF auth.uid() IS NULL THEN
        RAISE EXCEPTION 'User ID is NULL';
    END IF;
    
    FOREACH entry IN ARRAY local_entries
    LOOP
        BEGIN
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
        EXCEPTION WHEN unique_violation THEN
            -- Handle duplicate key error, you might choose to ignore or log it
            UPDATE entries
            SET title = entry.title,
                body = entry.body,
                updated_at = entry.updated_at
            WHERE id = entry.id;
        END;
    END LOOP;

    -- Return all rows where user_id = auth.uid()
    RETURN QUERY SELECT id, created_at, updated_at, title, body FROM entries WHERE user_id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;