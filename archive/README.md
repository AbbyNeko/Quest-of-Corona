# Archived implementation

These files belong to the original Express, Handlebars, Passport, Sequelize, and MySQL version of Quest of Corona. They are retained for reference and are not part of the current Netlify build.

- `legacy-server/` contains the old Node server, API routes, models, templates, and MySQL schema.
- `legacy-browser/` contains the replaced game scripts and standalone end screens.

The SQL in `legacy-server/db/schema.sql` uses MySQL syntax. Do not run it in Supabase; use [`../supabase/schema.sql`](../supabase/schema.sql) for the current Postgres schema.
