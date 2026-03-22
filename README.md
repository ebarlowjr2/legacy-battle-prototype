# Legacy Battle (legacy-battle-prototype)

## Project Overview
Legacy Battle is an XP-driven sports battle app where players challenge each other, form crews, and have battles auto-resolved from live sports data. The app is **XP-only engagement for now** (no wallet functionality is implemented in this repo yet). Sports events are normalized into a repository of games, and battles resolve automatically when those events finalize.

## Architecture Overview

**Full architecture and refactor documentation:** [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) — folder structure, Zustand/TanStack Query/Supabase setup, theme and scaling, navigation, and where to put new code.

This app is a mobile Expo/React Native client backed by Supabase and server-authoritative Edge Functions. Sports data is populated by a separate Lightsail microservice into Supabase `sports_*` tables.

```
[Expo Mobile App]
   |\
   | \-> [Supabase Auth / DB / Realtime]
   |      \-> [Edge Functions: award-xp, resolve-battles, crew-request, crew-respond]
   |
   \-> [Lightsail Sports Service]
           \-> [Supabase sports_events, sports_teams, sports_players]
```

Key flow:
- The client reads from Supabase tables and subscribes to realtime updates.
- Sensitive writes happen through Edge Functions (server-authoritative).
- Sports data is ingested by a separate service and stored in Supabase `sports_*` tables.

## Local Development Setup

1. Install dependencies:

```bash
npm install
```

2. Copy environment variables:

```bash
cp .env.example .env
```

3. Set required variables in `.env`:

- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`

4. Run Expo:

```bash
npx expo start
```

**Node version:** This repo expects Node 18 (see `.nvmrc`).

## Running on iOS / Android

Start the Expo dev server:

```bash
npx expo start
```

Then:
- iOS Simulator: press `i` in the Expo CLI or run `npx expo start --ios` (requires Xcode).
- Android Emulator: press `a` in the Expo CLI or run `npx expo start --android` (requires Android Studio).

## Production Build

This project uses EAS for native builds. Do not place secrets in the README.

```bash
eas build --profile preview
eas build --profile production
```

## Module Structure
The app is organized by **feature modules**:

- `auth`
- `battles`
- `crew`
- `profile`
- `sports`
- `xp`
- `shared` (ui + theme)

## Key Patterns / Rules
- The client does **not** write to sensitive tables directly.
- Server-authoritative writes happen via Edge Functions.
- Sports data comes from Supabase `sports_*` tables populated by the Lightsail service.
- Theme tokens + UI primitives are used for consistent styling.
- State is managed via React Context + hooks (no Redux in this repo).

## Where To Change What
- UI changes: `src/shared/ui` and `src/modules/*/screens`
- Sports ingestion changes: **not in this repo** (see `legacy-sports-service`)
- DB/RLS changes: Supabase migrations under `docs/sql`
