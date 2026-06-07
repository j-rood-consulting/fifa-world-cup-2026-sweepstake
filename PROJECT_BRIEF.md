# FIFA World Cup 2026 Sweepstake - Project Brief

## Purpose

Build a hosted, mobile-first web app that lets an administrator create a FIFA World Cup 2026 sweepstake pool, invite players via share link, run a fair seeded draw, and give each player a short reveal experience before showing their assigned teams.

The product should feel simple enough for a WhatsApp group but trustworthy enough that players understand the draw was fair.

## Public Name

FIFA World Cup 2026 Sweepstake

Note: the app should avoid copying FIFA branding, marks, typography, or official visual identity too closely. The public name is set, but the visual system should remain clearly independent from official FIFA tournament branding.

## Target Users

- Admin: creates and manages a pool, invites players, tracks payments, runs or reruns the draw.
- Player: joins with a name, receives a 4-digit access code, waits for the draw, watches their reveal, and later checks their teams and tournament status.
- Viewer: after the draw, can view public pool results via link if the pool allows it.

## Core Product Principles

- Joining must be extremely low friction.
- The draw must feel fair, transparent, and exciting.
- Admin setup should support both a quick path and a flexible advanced path.
- The app should be mobile-first because most usage will come from WhatsApp/shared links.
- V1 should be single-purpose and polished, while leaving room for payments, automated results, accounts, and future tournaments.

## V1 Scope

### Included

- Hosted web app.
- No user accounts.
- Pool creation.
- Quick Draw setup path.
- Advanced setup path.
- Shareable join link.
- WhatsApp-ready invite message.
- Player join flow with display name.
- Unique 4-digit player code within each pool.
- Admin dashboard.
- Admin private access link/code.
- Admin can join as a player.
- Player list visible before the draw.
- Players can edit their display name before the draw.
- Players can leave before the draw if the pool allows it.
- Admin can remove players before the draw.
- Manual admin-run draw only.
- Minimum player count enforced before draw.
- Seeded team allocation based on FIFA rankings.
- Confederation-aware balancing where possible.
- Equal number of teams per player.
- Weakest leftover teams left unassigned when player count does not divide 48 evenly.
- Unassigned teams shown after the draw where contextually useful.
- Admin draw reveal for the full pool.
- Player personal reveal, shown once per player.
- Results board by player.
- "My teams" view.
- Flags via local SVG assets.
- Team metadata: country/team name, ISO flag code, FIFA ranking, confederation, group, status.
- Fixtures/results seeded into database and updatable.
- Team status tracking: not started, group stage, qualified, knocked out, winner.
- Payment instructions captured in advanced setup.
- Entry fee/prize structure captured in advanced setup.
- Admin can mark players as paid.
- Admin can rerun draw after strong confirmation.
- Previous results can be deleted on rerun.
- Shareable result cards.
- Fixture/status screen in the first build pass.

### Excluded From V1

- Real payment gateway.
- In-app money collection/distribution.
- User accounts.
- Password login.
- Automated draw at deadline.
- Push/email/SMS notifications.
- Fully automated live match/result ingestion.
- Multi-tournament admin interface.
- Complex points scoring engine.
- Federation crests/logos.

## Recommended Stack

- Framework: Next.js with App Router.
- Language: TypeScript.
- Styling: Tailwind CSS.
- Database: Supabase Postgres.
- Hosting: Vercel.
- Auth model: code/link based for V1.
- Flags: `flag-icons` package or bundled SVG assets from it.
- Icons: lucide-react.
- Animations: Framer Motion if needed, or CSS animations for lighter implementation.

This stack supports fast iteration, good mobile UX, a real database, and future paths for auth, payments, realtime updates, and admin tooling.

## Pool Setup

### Quick Draw

Quick Draw is designed for minimum setup.

Required fields:

- Pool name.
- Admin name.

Optional fields:

- Player cap.
- Draw deadline.

Defaults:

- Admin-run draw only.
- Players can join until draw is run.
- Players can leave before draw.
- Admin can remove players before draw.
- Results public to anyone with link after draw.
- Personal reveal required once per player.
- No payment/prize setup.
- Default seeded draw rules.

### Advanced Setup

Advanced setup should be a short wizard.

Step 1: Basics

- Pool name.
- Admin name.
- Optional admin display message/rules note.
- Player cap.
- Minimum players.
- Draw deadline.

Step 2: Join and Visibility

- Allow players to leave before draw.
- Allow players to edit name before draw.
- Show player list before draw.
- Results visibility after draw: public with link or code-gated.

Step 3: Money and Prizes

- Entry fee amount.
- Currency.
- Payment instructions:
  - Account holder.
  - Bank name.
  - Account number.
  - Branch/sort code.
  - Payment reference instruction.
  - Optional free-text payment note.
- Prize structure:
  - Free-text notes.
  - Optional structured rows, for example winner 80%, runner-up 20%.
- Admin can mark players as paid.

Step 4: Draw Rules

- Use tournament defaults.
- Confirm team count and ranking data snapshot.
- Minimum players required before draw.
- Draw reveal style.
- Confirm rerun policy.

## Join Flow

Primary path:

1. Player receives a direct join link in WhatsApp or another chat.
2. Player opens `/join/[poolCode]`.
3. Player sees pool name, admin name, joined player count, deadline if set, payment/prize note if relevant, and draw status.
4. Player enters display name.
5. Player receives a unique 4-digit code.
6. Player sees a "save this code" screen.
7. Before draw, player can return via link and code to see waiting state, player list, payment status, and pool rules.

Manual fallback:

- Homepage has "Join a pool".
- Player enters pool code.
- Player follows the same join flow.

## Admin Flow

1. Admin creates pool.
2. Admin receives private admin link/code.
3. Admin shares join link or WhatsApp-ready message.
4. Admin dashboard shows:
   - Pool status.
   - Players joined.
   - Minimum players.
   - Estimated teams per player.
   - Estimated unassigned teams.
   - Payment status.
   - Deadline.
   - Readiness checklist.
   - Draw button.
5. Admin can remove players or mark paid before draw.
6. When ready, admin initiates draw.
7. Admin sees full pool reveal.
8. Results are locked unless admin chooses rerun.
9. Rerun requires strong confirmation and deletes previous draw results.

## Draw Rules

The draw is based on 48 teams.

For `playerCount` players:

- `teamsPerPlayer = floor(48 / playerCount)`.
- `assignedTeamCount = teamsPerPlayer * playerCount`.
- `unassignedTeamCount = 48 - assignedTeamCount`.
- The weakest ranked teams should be left unassigned first.
- The assigned teams should be split into `teamsPerPlayer` ranking bands.
- Each player receives one team from each ranking band.
- Within each band, assignment is randomized.
- Confederation balancing should reduce same-confederation repeats where possible.
- Ranking fairness is the primary rule; confederation diversity is secondary.

Example:

- 16 players.
- 3 teams each.
- Top 16, middle 16, bottom 16.
- Each player receives one team from each band.

Awkward count example:

- 10 players.
- 4 teams each.
- 40 teams assigned.
- 8 lowest-ranked teams left unassigned.
- The 40 assigned teams are split into 4 bands of 10.

Minimum:

- Draw should be blocked with fewer than 2 players.
- Admin should see a clear reason when draw is blocked.

## Reveal Rules

### Admin Reveal

- Admin initiates draw.
- Admin sees a full-pool reveal.
- The reveal should take roughly 10-20 seconds.
- The reveal should feel energetic but not slow.
- After reveal, admin lands on full results board.

### Player Reveal

- Each player should get a personal reveal once.
- If the player has not viewed their reveal, they see the reveal option.
- Once viewed, the reveal option is hidden and the player sees results directly.
- After personal reveal, player can see everyone else's teams.

Suggested reveal sequence:

1. Short countdown.
2. Player name appears.
3. Teams reveal one by one with flag, rank, confederation, and group.
4. Final "Your teams" board.

## Results Experience

Primary results organization: player first.

Views:

- My teams.
- All players.
- Unassigned teams.
- Fixtures.
- Team status.

Team status should be simple in V1:

- Not started.
- Group stage.
- Qualified.
- Knocked out.
- Winner.

During the tournament, the app should show whose teams are still alive. This is more important than a complex points system for V1.

## Tournament Data

V1 should seed official 2026 tournament data:

- 48 qualified teams.
- FIFA rankings.
- Confederation.
- ISO/flag code.
- Group.
- Fixtures.
- Match results/status fields.

Data should be stored in a way that can later support other tournaments.

The data import should be verified against official FIFA tournament pages before launch. If official fixture or ranking sources change, seed data should be updateable without changing the draw engine.

## Suggested Database Model

### tournaments

- id
- name
- year
- team_count
- starts_at
- ends_at
- status
- created_at
- updated_at

### teams

- id
- tournament_id
- name
- display_name
- iso_code
- flag_code
- confederation
- fifa_ranking
- group_code
- status
- created_at
- updated_at

### fixtures

- id
- tournament_id
- home_team_id
- away_team_id
- match_number
- stage
- group_code
- venue
- city
- starts_at
- home_score
- away_score
- status
- winner_team_id
- created_at
- updated_at

### pools

- id
- tournament_id
- name
- admin_name
- admin_code_hash
- join_code
- join_slug
- setup_mode
- player_cap
- minimum_players
- draw_deadline
- draw_status
- draw_started_at
- draw_completed_at
- allow_player_leave
- allow_player_name_edit
- show_player_list_before_draw
- results_visibility
- payment_enabled
- entry_fee_amount
- currency
- payment_account_holder
- payment_bank_name
- payment_account_number
- payment_branch_code
- payment_reference
- payment_note
- prize_structure_json
- rules_note
- created_at
- updated_at

### players

- id
- pool_id
- display_name
- access_code_hash
- access_code_last4_display
- is_admin
- paid_status
- has_viewed_reveal
- joined_at
- updated_at

### draws

- id
- pool_id
- draw_number
- status
- algorithm_version
- random_seed_hash
- created_by_admin
- created_at
- completed_at

### draw_assignments

- id
- draw_id
- pool_id
- player_id
- team_id
- ranking_band
- reveal_order
- created_at

### unassigned_teams

- id
- draw_id
- pool_id
- team_id
- reason
- created_at

### audit_events

- id
- pool_id
- actor_type
- actor_id
- event_type
- event_payload
- created_at

## Access Model

V1 uses lightweight access codes.

- Admin has a private admin link/code.
- Player has a 4-digit code unique within the pool.
- Codes should be stored hashed.
- Duplicate player names are allowed.
- Duplicate player codes within a pool are not allowed.
- Public result viewing can be allowed by link after draw, depending on pool setting.

## Future Enhancements

- Real payment gateway.
- Admin payout/distribution tooling.
- Accounts and persistent user profiles.
- Multiple pools per user.
- Live result ingestion.
- Notifications.
- Auto-draw at deadline.
- Future tournaments.
- Custom team lists.
- Rich scoring modes.
- Leaderboards.
- Audit/history of rerun draws.

## Open Decisions

- Whether public results should be default or advanced-only.
- Exact fixture/result data update mechanism.
- Exact legal/trademark positioning before launch.
