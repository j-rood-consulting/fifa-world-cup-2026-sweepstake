# FIFA World Cup 2026 Sweepstake

Mobile-first web app for creating, joining, drawing, revealing, and following a FIFA World Cup 2026 sweepstake pool.

## Current Build

- Next.js App Router and TypeScript.
- Prisma schema with local SQLite database.
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
npm run db:reset
npm run dev
```

The local database lives at `prisma/dev.db` and is ignored by git.

## Useful Commands

```bash
npm run dev
npm run build
npm run lint
npm run db:reset
```

## Data Notes

The initial seed is based on the confirmed 48-team FIFA World Cup 2026 field, published tournament groups, and current FIFA ranking order. The fixture screen is implemented and seeded with group-stage matchups, but venue/kickoff metadata should be treated as placeholder until a final official fixture import is completed.

Before production launch, rerun a data verification pass against official FIFA pages and update `scripts/seed.ts` if dates, venues, rankings, or team display names change.

## V1 Boundaries

This build intentionally does not include real payment processing, account login, automated match-result ingestion, or deadline-triggered draws. Those are planned future extensions.
