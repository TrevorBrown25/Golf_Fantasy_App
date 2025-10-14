# MHS Golf Dayz

A production-ready prototype for the MHS Golf Dayz fantasy golf league. Built with Next.js 14 (App Router + TypeScript), Zustand, PostCSS modules, and fully static export for GitHub Pages.

## Getting Started

```bash
npm install
npm run dev
```

Key scripts:

- `npm run dev` – local development
- `npm run build` – static export build
- `npm run start` – serve the production build locally
- `npm run lint` – run ESLint
- `npm run typecheck` – run the TypeScript compiler
- `npm run test` – execute Jest unit tests
- `npm run format` – format with Prettier

## Data Model Overview

All canonical data lives under `/data` as JSON or markdown and is loaded statically at build time.

- `divisions.json` / `owners.json` – league structure
- `tournaments.json` – season events including majors + Calcutta flags
- `weeks.json` – 24-week regular-season schedule with lock windows
- `golfers.json` – 120 golfer pool with world ranks
- `earnings.json` – sample purse data for results calculations
- `rules.md` – league charter rendered on the `/rules` page

Type definitions are in [`lib/types.ts`](lib/types.ts) and power both server + client logic.

## League Rules Summary

- **Weekly Drafts:** Home team opens an 8-pick snake (H–A–A–H–H–A–A–H). Lock is 23:59 local time the day before Round 1.
- **Usage Caps:** Golfers capped at 3 plays unless a Save Credit is applied. Prohibited picks score $0 and trigger field fallbacks (no saves).
- **Saves:** Drafting the tournament winner grants a Save Credit for a future extra usage.
- **Escalation:** If an opponent is absent by lock day, escalate to the Commissioner. If unresolved, willing owner earns the win while the absent owner receives four field auto-plays.
- **Calcutta (Majors + JDC):** $100 budget, max eight golfers per owner. $100 ties use a marble race animation. Absent owners receive median roster auto-assignments.
- **Standings:** Track wins/losses/earnings with multi-step division and wildcard tiebreakers.
- **Playoffs:** Division winners take seeds #1/#2, wildcards based on earnings for #3/#4. Seeds grant descending Save bonuses (4/3/2/1) entering playoffs. Semis at FedEx St. Jude; finals at BMW with higher seed drafting first.
- **Loser Punishment:** Lowest season earnings owes the champion a golf + drinks outing.

## Testing

Jest + React Testing Library cover the core business rules, including usage caps, absent owner flow, tiebreakers, playoff seeding, and Calcutta logic.

```
npm run test
```

## Deploy to GitHub Pages

1. Set the repo name for project pages under **GitHub → Settings → Actions → Variables**: `REPO_NAME=your-repo`.
2. For user/org pages or custom domains, leave `REPO_NAME` empty.
3. Pages **Source** must be **GitHub Actions**. The first publish can take a minute.
4. Optional: add `public/CNAME` with your custom domain.

The workflow in [`.github/workflows/pages.yml`](.github/workflows/pages.yml) builds the app with `NEXT_PUBLIC_REPO_NAME` and deploys `./out` via `actions/deploy-pages`.

## Static Export Configuration

`next.config.mjs` is configured for static export with optional `basePath`/`assetPrefix` when `NEXT_PUBLIC_REPO_NAME` is provided. Images are unoptimized for GitHub Pages compatibility and trailing slashes are enabled.

## Accessibility & UX

- Mobile-first layout with responsive navigation (bottom tab bar on small screens, left rail on desktop).
- Keyboard focus styling, accessible labels, reduced motion support, and semantic markup.
- Clear banners, toasts, and empty states communicate rule-driven outcomes (fallbacks, escalations, saves).

## Import / Export

The Commissioner tools include JSON import/export utilities for full league snapshots that mirror local state along with the static seed data.
