# FIFA World Cup 2026 Sweepstake - Design Brief

## Design Direction

Create a mobile-first sweepstake app that feels like a premium tournament control room, but still works naturally in a casual WhatsApp group.

The visual tone should be:

- polished
- fast
- social
- football-native
- trustworthy
- celebratory at reveal moments

It should not feel like a landing page, fantasy sports bloatware, or a betting app. The first screen should help users act immediately: create a pool or join a pool.

## Brand Feel

Public product name: FIFA World Cup 2026 Sweepstake.

The interface should be aligned with a global football tournament without cloning FIFA brand assets. Avoid official FIFA marks, tournament logos, exact typography, or any layout that looks like an official FIFA product.

Suggested positioning:

- "World Cup 2026 Sweepstake" can be used more prominently in UI if legal caution is needed.
- Flags, fixtures, ranking data, and football language carry the tournament context.
- The UI should feel global and matchday-ready rather than corporate.

## Visual Language

### Palette

Use a restrained base with energetic accents.

Suggested palette:

- Pitch green: `#0B3D2E`
- Deep charcoal: `#101418`
- Off white: `#F7F5EF`
- Soft line: `#D9D4C7`
- Gold accent: `#D7B56D`
- Electric blue accent: `#2F80ED`
- Coral alert/accent: `#E85D4F`

Flags should provide much of the color. Avoid letting the whole app become a single green, blue, or beige theme.

### Type

Use a modern, highly readable sans-serif. Recommended:

- Inter
- Geist
- Satoshi if available

Use tight, practical hierarchy:

- Large type for pool name, draw status, and reveal moments.
- Compact headings for dashboards and setup steps.
- Avoid oversized marketing hero text.

### Shape and Layout

- Cards should use 8px radius or less.
- Avoid cards inside cards.
- Use full-width bands or unframed layouts for major sections.
- Use clear tables/lists for admin and result views.
- Stable dimensions are important for draw controls, team rows, player rows, and reveal cards.

### Icons

Use lucide icons for:

- copy link
- share
- user/player
- lock/admin
- check/paid
- warning
- draw/reveal
- settings
- fixtures
- trophy

Use tooltips on less obvious admin icons.

## Mobile-First UX

Most users will arrive from WhatsApp on a phone.

Design priorities:

- One primary action per screen.
- Large tap targets.
- No dense forms on first contact.
- Clear draw state: waiting, ready, drawing, complete.
- Persistent pool identity: pool name should always be visible.
- Codes should be easy to read and save.
- Results should be scannable with flags and player names.

Desktop should feel like a richer dashboard, but mobile is the primary target.

## Core Screens

### 1. Home

Purpose: immediate routing.

Primary actions:

- Create a pool.
- Join a pool.

No marketing-heavy hero. The product should be the interface.

Suggested content:

- App name.
- Short single-line description.
- Two clear actions.
- Optional small "How it works" strip below the fold.

### 2. Create Pool - Mode Selection

Two paths:

- Quick Draw.
- Advanced Setup.

Quick Draw should feel fast and confident.
Advanced Setup should feel flexible, not intimidating.

### 3. Quick Draw Setup

Fields:

- Pool name.
- Admin name.
- Optional player cap.
- Optional deadline.

CTA:

- Create pool.

After creation:

- Show admin private access note.
- Show join link.
- Show WhatsApp-ready message.

### 4. Advanced Setup Wizard

Four steps:

1. Basics.
2. Join and visibility.
3. Money and prizes.
4. Draw rules.

UX rules:

- Each step should fit comfortably on mobile.
- Show progress.
- Save as the admin moves.
- Use sensible defaults.
- Avoid exposing unavailable V2 features as active controls.

### 5. Admin Dashboard

Purpose: manage pool readiness and run draw.

Sections:

- Pool status header.
- Join link/share controls.
- Readiness checklist.
- Player list.
- Payment tracking.
- Draw rules summary.
- Draw action.

Readiness checklist:

- Minimum players met.
- Teams per player.
- Unassigned teams.
- Payment status summary if enabled.
- Deadline if set.

Draw button:

- Disabled until minimum players met.
- Confirmation required.
- Rerun requires stronger confirmation.

### 6. Join Pool

Entry via direct join link.

Show:

- Pool name.
- Admin name.
- Draw status.
- Joined player count.
- Deadline if set.
- Payment/prize note if relevant.
- Player list if allowed.

Action:

- Enter name.
- Join pool.

### 7. Save Code

After joining, show:

- Player name.
- 4-digit code in large readable type.
- Message: this code is needed to view your teams later.
- Copy code action.
- Continue to pool.

Do not overload this screen.

### 8. Waiting Room

Before draw.

Show:

- Pool status.
- Player list.
- Payment status if enabled.
- Draw not made yet message.
- Admin-controlled draw note.

Players can edit their name before draw if allowed.

### 9. Admin Full Reveal

Duration target: 10-20 seconds.

Suggested flow:

- Countdown.
- Fast cycling flags/teams.
- Player rows fill with teams.
- Band-by-band or player-by-player rhythm.
- Final board locks into place.

The admin reveal should show the whole pool outcome.

### 10. Player Personal Reveal

Shown once per player.

Suggested flow:

- "Your draw is ready."
- Countdown.
- Teams flip or slide in one by one.
- Each team card shows flag, team name, rank, group, confederation.
- Final "Your teams" board.
- Continue to full results.

No skip button. Keep it under 20 seconds.

### 11. Results Board

Default organization: player first.

Views/tabs:

- My teams.
- All players.
- Fixtures.
- Unassigned.

Player card/row:

- Player name.
- Paid marker if relevant and admin view.
- Assigned teams with flags.
- Team status chips.

Team display:

- Flag.
- Name.
- FIFA rank.
- Group.
- Confederation.
- Status.

### 12. Fixtures and Status

Keep V1 simple.

Show:

- Group/stage.
- Match date/time.
- Teams.
- Score/status.
- Owner players where relevant.

This lets players follow their teams without needing a complex points table.

## Reveal Experience Details

The reveal is the product's emotional peak.

It should feel:

- fast
- dramatic
- clean
- shareable
- not gimmicky

Suggested visual techniques:

- flag sweep/cycling before reveal
- subtle pitch-line background
- countdown pulse
- team card flip
- rank band accent labels
- confederation color dots
- final board snap-in

Avoid:

- long animations
- fake loading
- confetti overload
- loud casino/betting cues
- requiring everyone to be live at the same time

## Components

Core components to design/build:

- App shell.
- Pool status banner.
- Primary action button.
- Secondary action button.
- Icon button.
- Setup stepper.
- Form field.
- Toggle.
- Segmented control.
- Player row.
- Team chip.
- Team card.
- Fixture row.
- Status chip.
- Payment status chip.
- Readiness checklist item.
- Share panel.
- Reveal card.
- Result card.
- Confirmation modal.

## Content Tone

Keep copy short, warm, and direct.

Examples:

- "Your pool is ready."
- "Share this link with your players."
- "The draw has not been made yet."
- "Save your code."
- "Your teams are ready."
- "Run draw."
- "Rerun draw."
- "This will delete the current results."

Avoid:

- long explanations
- technical language
- legalistic warnings unless needed
- visible instructions explaining obvious UI mechanics

## Accessibility

- Strong contrast.
- Buttons at least 44px tall on mobile.
- Reveal must not depend only on color.
- Team flags must be paired with text names.
- Motion should be brief.
- Respect reduced-motion settings by using a simplified reveal.

## Data Visual Treatment

Use flags and status chips to make dense information scannable.

Ranking bands can be subtly indicated:

- Band 1: gold accent.
- Band 2: blue accent.
- Band 3+: neutral/accent variants.

Confederations should use small labels or dots, not large color blocks.

## Share Card

A result card should be generated for each player in V1.

Content:

- Pool name.
- Player name.
- Assigned teams with flags.
- Small app name.

Format:

- Mobile-friendly image aspect ratio, such as 4:5.
- Suitable for WhatsApp sharing.

This is part of V1 scope. If implementation needs staging, it should ship after the draw/results flow but before the first build pass is considered complete.

## Design Risks

- Over-branding could create legal risk.
- Too much setup could make admins abandon pool creation.
- Reveal can feel slow if it exceeds 20 seconds.
- Results can become cluttered on mobile if flags, ranks, groups, and statuses are not carefully laid out.
- Payment fields should not imply that money is handled by the app in V1.

## Design Decisions Still Open

- Exact reveal animation style.
- Whether public results are default or advanced-only.
