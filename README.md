# FIFA World Cup 2026 Sweepstake

Mobile-first web app for creating, joining, drawing, revealing, and following a FIFA World Cup 2026 sweepstake pool.

## Current Build

- Next.js App Router and TypeScript.
- Prisma schema with Postgres deployment support.
- Seeded 2026 tournament teams, ranking bands, groups, and a group-stage fixture/status screen.
- Admin pool creation and dashboard.
- Player join flow with 4-digit access code.
- Manual admin draw.
- Ranking-band draw engine with confederation balancing.
- One-time player reveal.
- Results, unassigned teams, fixtures/status, payment tracking, and share cards.

## Local Setup

```bash
npm install
npm run prisma:generate
npm run dev
```

For local database-backed development, set `DATABASE_URL` to a Postgres database URL, then run:

```bash
npm run db:migrate
npm run seed
```

## Useful Commands

```bash
npm run dev
npm run build
npm run lint
npm run db:migrate
npm run seed
```

## Railway

Railway should provide a Postgres service and the app service should define:

```bash
DATABASE_URL=${{Postgres.DATABASE_URL}}
NEXT_PUBLIC_APP_URL=https://your-railway-domain.up.railway.app
```

`railway.json` runs `prisma migrate deploy` and the production-safe seed before each deploy.

## Data Notes

The initial seed is based on the confirmed 48-team FIFA World Cup 2026 field, published tournament groups, and current FIFA ranking order. The fixture screen is implemented and seeded with group-stage matchups, but venue/kickoff metadata should be treated as placeholder until a final official fixture import is completed.

Before production launch, rerun a data verification pass against official FIFA pages and update `scripts/seed.ts` if dates, venues, rankings, or team display names change.

## V1 Boundaries

This build intentionally does not include real payment processing, account login, automated match-result ingestion, or deadline-triggered draws. Those are planned future extensions.
