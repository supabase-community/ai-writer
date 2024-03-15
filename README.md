<a href="https://demo-nextjs-with-supabase.vercel.app/">
  <h1 align="center">Next.js, Supabase, and OpenAI Starter Kit</h1>
</a>

## Features

- Offline-first writing app
- Autocomplete with OpenAI's GPT-3.5 turbo
- React 18 and Next.js 14
- Authentication and backup with Supabase

## Demo

You can view a fully working demo at [ai-writer-ruddy.vercel.app](https://ai-writer-ruddy.vercel.app/).

## Clone and run locally

1. Create a Supabase project [via the Supabase dashboard](https://database.new)

2. Create an OpenAI API key [via the OpenAI dashboard](https://platform.openai.com/account/api-keys)

3. Clone or fork this repository

4. Rename `.env.local.example` to `.env.local` and update the following:

   ```
   NEXT_PUBLIC_SUPABASE_URL=[INSERT SUPABASE PROJECT URL]
   NEXT_PUBLIC_SUPABASE_ANON_KEY=[INSERT SUPABASE PROJECT API ANON KEY]
   OPENAI_API_KEY=[INSERT OPENAI API KEY]
   ```

   Both `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` can be found in [your Supabase project's API settings](https://app.supabase.com/project/_/settings/api)

5. You can now run the Next.js local development server:

   ```bash
   pnpm turbo
   ```

   The starter kit should now be running on [localhost:3000](http://localhost:3000/).

> Check out [the docs for Local Development](https://supabase.com/docs/guides/getting-started/local-development) to also run Supabase locally.