# Legacy Battle – Architecture & Refactor Documentation

This document describes the app architecture, folder structure, and patterns introduced during the refactor. It is the single source of truth for how the codebase is organized and how to add or change code.

---

## 1. Tech Stack

| Layer        | Technology        | Purpose                          |
|-------------|-------------------|----------------------------------|
| UI          | React Native      | Cross-platform mobile (Expo)      |
| Language    | TypeScript        | Type safety, strict mode          |
| Client state| **Zustand**       | Auth, feature-specific state      |
| Server state| **TanStack Query**| Caching, sync, mutations         |
| Backend     | **Supabase**      | Auth, DB, realtime, edge fns     |
| Navigation  | React Navigation  | Stack + bottom tabs               |

---

## 2. Folder Structure (Feature-First)

```
src/
├── app/                    # App wiring only
│   ├── navigation/         # Routers, stacks, tabs, types
│   │   ├── AppStack.tsx
│   │   ├── AuthStack.tsx
│   │   ├── BottomTab.tsx
│   │   ├── MainRouter.tsx
│   │   └── types.ts
│   └── providers/          # Root providers (auth, theme, toast)
│       ├── AuthProvider.tsx
│       ├── ThemeProvider.tsx
│       ├── ToastProvider.tsx
│       └── index.ts
│
├── features/               # Business domains (no cross-feature imports)
│   ├── auth/
│   │   ├── api/            # Supabase auth + session
│   │   ├── hooks/          # useAuth
│   │   ├── store/          # authStore (Zustand, persisted)
│   │   ├── screens/
│   │   └── types.ts
│   ├── battles/
│   │   ├── api/            # battles + repo (Supabase + TanStack Query)
│   │   ├── screens/
│   │   └── index.ts
│   ├── crew/
│   │   ├── api/
│   │   ├── screens/
│   │   └── index.ts
│   ├── profile/
│   │   ├── api/
│   │   ├── screens/
│   │   └── index.ts
│   └── sports/
│       ├── api/
│       ├── screens/
│       └── index.ts
│
├── shared/                 # Cross-feature; no business logic
│   ├── ui/                 # Atomic design
│   │   ├── atoms/          # AppText, Card
│   │   ├── molecules/      # Button, Input, SplashVideo, BattleNowCurvedLabel, LoadingState
│   │   ├── organisms/      # Screen, Toast, EmptyState, ErrorState
│   │   └── index.ts
│   ├── lib/                # Singletons and infra
│   │   ├── supabaseClient.ts
│   │   ├── queryClient.ts
│   │   ├── edgeFunctions.ts
│   │   ├── errors.ts
│   │   ├── result.ts
│   │   └── layout.ts
│   ├── theme/              # Design tokens + scaling
│   │   ├── tokens.ts
│   │   ├── colors.ts
│   │   ├── theme.ts
│   │   └── index.ts
│   ├── hooks/              # useCachedResources (fonts, splash)
│   ├── types/              # Domain types, interfaces
│   ├── utils/
│   └── constants/          # Backward compat (e.g. theme re-exports)
│
└── assets/
    ├── images/
    └── videos/
```

---

## 3. Architecture Rules

1. **Screens** live in `features/<feature>/screens/`. No global `screens/` folder.
2. **Feature logic** stays inside the feature. Shared code goes in `shared/`.
3. **Features must not import from other features.** Only `shared/` is the cross-feature layer.
4. **Avoid require cycles:** screens and feature code must not import from the feature barrel (`@/features/auth`). Use subpaths instead (e.g. `@/features/auth/hooks/useAuth`, `@/features/battles/api`).
5. **Supabase client** is in `shared/lib/supabaseClient.ts`. All Supabase usage goes through this singleton.
6. **TanStack Query** – `queryClient` lives in `shared/lib/queryClient.ts`. Query/mutation logic lives in `features/<feature>/api/` or `features/<feature>/hooks/`.
7. **Zustand** – Feature-scoped stores in `features/<feature>/store/`. Auth store is in `features/auth/store/authStore.ts` and is the only app-wide store (used by MainRouter and AuthProvider).
8. No global `repo/` or `services/` unless you have a clear multi-source or SDK reason.

---

## 4. App Entry & Providers

**Entry:** `App.tsx`

- Wraps the app with:
  - `QueryClientProvider` (TanStack Query)
  - `GestureHandlerRootView`
  - `ThemeProvider` → `AuthProvider` → `ToastProvider`
  - `MainRouter`
- Uses `useCachedResources()` to load fonts (Montserrat, Roboto) and gate the splash; when ready, renders `MainRouter` or `SplashVideo` until `onSplashFinish`.

**Provider order (outer → inner):**

1. `QueryClientProvider` (client from `@/shared/lib/queryClient`)
2. `ThemeProvider` (theme mode, colors)
3. `AuthProvider` (syncs Supabase session to auth store)
4. `ToastProvider` (toast state + show/hide)
5. `MainRouter` (navigation)

---

## 5. Navigation

- **MainRouter** – Reads `useAuthStore` (token, isAuthenticated, _hasHydrated). Shows loading until hydrated; then either `AppStack` (authenticated) or `AuthStack` (unauthenticated).
- **AuthStack** – Login, SignUp, OTPVerification, CreateUsername. Types in `app/navigation/types.ts` (`AuthStackParamList`, `AuthScreenProps`).
- **AppStack** – Root stack: `MainTabs` + all modal/overlay screens (CreateBattle, BattleDetail, AllResults, etc.). Types: `RootStackParamList`, `RootStackScreenProps`.
- **BottomTab** – Tab navigator (Home, Battles, BattleNow, Explore, Profile). Extracted to `app/navigation/BottomTab.tsx`. Uses `TabStackParamList` and `TabScreenProps<'ScreenName'>` for tab screens. Tab bar styles use theme tokens (`verticalScale`, `horizontalScale`, `Sizes`, `FontFamily`).

**Types (in `app/navigation/types.ts`):**

- `AuthStackParamList`, `TabStackParamList`, `RootStackParamList`
- `AuthScreenProps<Name>`, `TabScreenProps<Name>`, `RootStackScreenProps<Name>`
- `CustomTabBarButtonProps`, `MainTabsScreenProps`

---

## 6. State Management

### Zustand (client state)

- **Auth:** `features/auth/store/authStore.ts`
  - Persisted with AsyncStorage (token, isAuthenticated, user).
  - `logout()` clears the auth store and calls `queryClient.clear()`.
  - Used by: MainRouter, AuthProvider, and `useAuth()` (which wraps store + auth api).
- Other feature-specific client state can live in `features/<feature>/store/`.

### TanStack Query (server state)

- **Query client:** `shared/lib/queryClient.ts` – single instance, `staleTime: Infinity` by default.
- **Usage:** Feature API modules or hooks in `features/<feature>/api/` or `features/<feature>/hooks/` should use `useQuery`, `useMutation`, etc., with this client (provided at root). No separate “repository” layer unless you need multi-source abstraction.

#### Mutations: one file vs many

- **Default:** Group related `useMutation` hooks in **one module** under the feature’s `data/api/` (e.g. `features/auth/data/api/authMutations.ts`), next to raw API calls (`authApi.ts`). Prefer **logical grouping** over one hook per file when each hook is only a thin wrapper.
- **Split into separate files only when:**
  1. The module grows beyond roughly **200–300 lines**, or
  2. A mutation gains **real complexity** (custom transforms, orchestration, heavy side effects) that makes the shared file hard to read.
- **Rule of thumb:** *Mutations should be grouped logically and split only when complexity justifies it.*

### Supabase

- **Client:** `shared/lib/supabaseClient.ts` (env: `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY`).
- **Usage:** Feature `api/` modules import `supabase` from `@/shared/lib/supabaseClient` (or re-export). Auth session is synced to Zustand in `AuthProvider`.

---

## 7. Theme, Tokens & Scaling

**Single source of truth:**

- **Data definition:** `shared/theme/`
  - `tokens.ts` – spacing, radii, fontSizes, lineHeights, **typography variants**, shadows, zIndex (all scaled with `moderateScale` / `verticalScale`).
  - `colors.ts` – dark/light palettes and `getThemeColors`.
  - `theme.ts` – `theme` object bundling colors + tokens + scaling helpers (`horizontalScale`, `verticalScale`, `RPH`, `RPW`, `FontFamily`, `Sizes`).
- **Consumption in components:** `useTheme()` from `@/app/providers`.
  - Returns the full theme: static tokens from `shared/theme` + **mode-aware `colors`**, plus `mode` and `toggleTheme`.

**Typography:**

- All text styles are driven by **`typography` tokens** in `shared/theme/tokens.ts`, not hardcoded numbers.
- `TypographyVariant` set: `h1`–`h6`, `body1`, `body2`, `buttonLg`, `buttonMd`, `label`, `inputValue`, `helper`, `error`, `captionLg`, `captionSm`.
- Each variant specifies `fontSize` (via `moderateScale`) and `lineHeight` (via `verticalScale`), and maps to Montserrat (headings) or Roboto (body/UI).
- `AppText` (in `shared/ui/atoms/AppText.tsx`) is the canonical text primitive and consumes `typography[variant]`.

**Scaling convention:**

- **Vertical layout** (marginTop/Bottom, marginVertical, paddingVertical, height): use **`verticalScale(n)`** with design value `n`.
- **Horizontal layout** (marginLeft/Right, marginHorizontal, paddingHorizontal, width): use **`horizontalScale(n)`**.
- **Font sizes and line heights** for text: use **typography variants via `AppText`** wherever possible; fall back to `fontSizes` / `lineHeights` only for non-`AppText` use cases.
- **Radii and general sizes:** use **`radii`** from tokens or `Sizes.*` (which are also scaled).

**Theme exports (commonly used):**

- From `@/shared/theme`: `colors`, `COLORS`, `Sizes`, `SIZES`, `FontFamily`, `spacing`, `radii`, `fontSizes`, `lineHeights`, `typography`, `shadows`, `zIndex`, `horizontalScale`, `verticalScale`, `RPH`, `RPW`.
- From `@/app/providers`: `useTheme` (full theme), `useAppTheme`, `useThemeColors`.

**Fonts:** Montserrat + Roboto are loaded in `shared/hooks/useCachedResources.ts` via `@expo-google-fonts/montserrat` and `@expo-google-fonts/roboto`. `FontFamily` in `shared/theme/theme.ts` maps to these font names; `AppText` uses those aliases via typography variants.

---

## 8. Shared UI (Atomic Design)

- **Atoms:** `AppText`, `Card` – minimal, theme-aware.
- **Molecules:** `Button`, `Input`, `SplashVideo`, `BattleNowCurvedLabel`, `LoadingState` – use theme tokens and `AppText` where applicable.
- **Organisms:** `Screen`, `Toast`, `EmptyState`, `ErrorState` – layout and composition.

Screens and feature components import from `@/shared/ui` or specific paths (e.g. `@/shared/ui/atoms/AppText`). Avoid importing from a feature barrel from inside that same feature to prevent require cycles (use subpaths like `@/features/auth/hooks/useAuth`).

---

## 9. Path Aliases (tsconfig)

| Alias           | Path                |
|-----------------|---------------------|
| `@/app/*`       | `src/app/*`         |
| `@/features/*`  | `src/features/*`     |
| `@/shared/*`    | `src/shared/*`       |
| `@/assets/*`    | `src/assets/*`       |
| `@theme`        | `src/shared/theme`   |
| `@atoms`        | `src/shared/ui/atoms`|
| `@molecules`    | `src/shared/ui`      |
| `@organisms`    | `src/shared/ui`      |
| `@hooks`        | `src/shared/hooks`   |
| `@utils/*`      | `src/shared/utils/*` |

Use `@/` for app and features so it’s clear where code lives.

---

## 10. Where to Put New Code

| Need                         | Placement                                      |
|-----------------------------|-------------------------------------------------|
| New screen                  | `features/<feature>/screens/`                   |
| New API call / query        | `features/<feature>/api/` (or hooks)           |
| New client state (feature)  | `features/<feature>/store/` (Zustand)          |
| Reusable UI component       | `shared/ui/` (atoms → molecules → organisms)   |
| New font / global hook       | `shared/hooks/` or theme                        |
| New design token            | `shared/theme/tokens.ts` or `theme.ts`         |
| New route or tab             | `app/navigation/` + `types.ts`                 |
| New root provider           | `app/providers/` + wire in `App.tsx`           |

---

## 11. Cursor Rule

The same structure and rules are encoded in `.cursor/rules/react-native-architecture.mdc` (always applied) so that AI-assisted edits follow this architecture.

---

## 12. Summary of Refactor (What Changed)

- **Folder structure:** Feature-first layout; screens and API per feature; shared UI, lib, theme, hooks, types under `shared/`.
- **Navigation:** App/auth stacks and bottom tab in `app/navigation/`; bottom tab extracted to `BottomTab.tsx`; navigation types and no `any` for tab/stack screens.
- **Require cycles:** Removed by having screens and feature code import from subpaths (e.g. `@/features/auth/hooks/useAuth`, `@/features/battles/api`) instead of the feature barrel.
- **Theme:** Single theme in `shared/theme`; tokens use scaling; vertical/horizontal convention; `FontFamily` with Montserrat + Roboto; `AppText` and shared UI updated to use theme and `AppText` where appropriate.
- **Zustand:** Auth store in `features/auth/store/authStore.ts`; persisted; logout clears `queryClient`.
- **TanStack Query:** Single `queryClient` in `shared/lib/queryClient.ts`; used at root; feature API/hooks own query/mutation logic.
- **Supabase:** Single client in `shared/lib/supabaseClient.ts`; used by feature `api/` modules.

This doc and the Cursor rule together define how to work in this codebase going forward.
