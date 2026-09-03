# Database migrations

The initial schema migration is at `migrations/001_initial_schema.sql`. It is
intended for a fresh PostgreSQL database and creates the marketplace's core
tables and indexes.

From the `server` directory, apply it manually with:

```bash
psql -U "$DB_USER" -d campus_marketplace -f database/migrations/001_initial_schema.sql
```

If your local PostgreSQL server requires a host or port, add `-h` and `-p` to
the command. PostgreSQL will prompt for the database password when needed.

The migration is transactional. If a statement fails, the transaction is not
committed. Do not run this initial migration against a database that already
contains these tables.

For an existing marketplace database, apply the follow-up migrations in order.
`003_password_resets_and_demo_services.sql` creates secure password-reset token
storage and inserts idempotent demonstration service listings. It is safe to run
once after either existing schema migration; it does not alter or duplicate
existing services.
