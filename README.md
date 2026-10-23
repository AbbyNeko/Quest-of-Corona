
# Quest of Corona

Quest of Corona is a retro-inspired RPG. This rebuild serves the game as a static site on Netlify and uses Supabase Auth and Postgres for accounts and saved progress.

## Supabase setup

1. Create a Supabase project.
2. Run [`supabase/schema.sql`](./supabase/schema.sql) in the Supabase SQL Editor. This creates the profile and save tables, signup trigger, and row-level security policies.
3. In Supabase project settings, copy the project URL and **anon/publishable key**. Never use the `service_role` key in this browser app.
4. Add these environment variables to Netlify under **Site configuration → Environment variables**:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
5. Configure the Supabase Auth site URL and redirect allow-list for the Netlify site URL and any local development URL you use. Email confirmation can remain enabled; the app prompts new users to confirm before logging in.
6. Connect this repository to Netlify. The included `netlify.toml` sets the build command to `npm run build` and the publish directory to `public`.

The Supabase anon key is included in the generated browser configuration, which is expected for a client-side Supabase app. Database access is restricted by the row-level security policies in the schema; do not disable them.

## Local build

Copy `.env.example` to `.env`, set the Supabase project URL and anon key, then run:

```bash
npm install
npm start
```

`npm start` builds the browser app and serves it locally at `http://localhost:8888`. The build bundles the app into `public/assets/app.js` and generates `public/supabase-config.js`. These generated files are ignored by Git and recreated by Netlify during deployment.

## Game behavior

Players create an account with a character name, email, and password. Sign-in uses email and password. Each account has one saved adventure; choosing a new hero replaces that save. Battle health, enemy health, stage, and used abilities are saved after each action.

The former Express, Passport, Sequelize, and MySQL server is not used by the Netlify deployment. Its source and MySQL schema are preserved under [`archive/`](./archive/README.md). **Do not run `archive/legacy-server/db/schema.sql` in Supabase**; it is MySQL-specific and would not create the tables used by this app.

Existing MySQL accounts and saves are not imported by this rebuild; users create new Supabase accounts. Importing old records would require access to the original database and a separate migration.

## Contributors

[Abigail Limpioso](https://github.com/AbbyNeko), [Melanie Ponce](https://github.com/PONCM032), and [Robert Torres](https://github.com/rtorres61595)
