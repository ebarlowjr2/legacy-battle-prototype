# React/React Native Screen Architecture Guide

## 1. Feature Folder Structure
Each feature lives under `src/features/<featureName>/`:

```
featureName/
├── data/
│   ├── api/             # TanStack Query functions
│   └── store/           # Zustand stores
├── ui/
│   ├── components/      # Shared feature UI components
│   ├── hooks/           # Reusable hooks + screen-level hooks
│   └── screens/         # Screens
│       └── ScreenName/
│           ├── ScreenName.tsx          # Presentational component
│           └── ScreenNameContainer.tsx # Container component
```

---

## 2. Screen Folder Conventions
- Normal screen: `ScreenName` folder with `ScreenName.tsx` and `ScreenNameContainer.tsx`.
- Nested or CRUD cycle screens:

```
ScreenName/
└── SubScreenName/
    ├── SubScreenName.tsx
    └── SubScreenNameContainer.tsx
```

- **Do not nest more than 2–3 levels deep.**
- Presentational component consumes **props from the hook**.
- Container is thin and only passes props from the hook to the presentational component.

---

## 3. Screen-Level Hooks
- Located under `ui/hooks/`.
- Own **all business logic, state, validation, derived data, and handlers**.
- **Do not create too many tiny hooks.** Consolidate related logic.
- **Split hooks only if >200 lines** into sub-hooks for UI state vs business logic.
- Return an object containing all props for the presentational component.

---

## 4. Containers
- Imports the screen-level hook.
- Passes the hook object to the presentational component using spread syntax.
- Contains no logic.

---

## 5. Presentational Components
- Pure UI.
- Compose smaller components from `components/` folder.
- May contain local UI state only.

---

## 6. Components Folder
- For shared feature-specific UI components.
- Examples: buttons, cards, modals, list items specific to the feature.

---

## 7. Data Folder
- `api/` → TanStack Query functions (fetch/mutate).
- `store/` → Zustand state stores.
- No UI logic or screen-specific logic.
- **Mutations:** keep related `useMutation` hooks in one `api/` module (e.g. `authMutations.ts`) unless the file grows past ~200–300 lines or a mutation becomes complex—see `docs/ARCHITECTURE.md` (TanStack Query → Mutations).

---

## 8. General Rules
- Avoid prop drilling beyond container → presentational.
- Avoid double sources of truth.
- Avoid `as never` type hacks.
- Use TypeScript with explicit types.
- Debounce and side effects live in screen-level hooks.
- Only memoize expensive computations.

---

## 9. Pitfall Prevention
- **Too many tiny hooks:** consolidate related logic into one hook unless reusable across screens.
- **Over-nesting:** nested CRUD screens are fine, but avoid >2–3 levels.
- **Hook complexity:** split screen-level hooks if they exceed ~200 lines.
- **Consistency enforcement:** maintain folder and hook conventions; do not create ad-hoc structures.

---

## 10. Example Flow

```
useScreenHook.ts -> ScreenContainer.tsx -> Screen.tsx -> components/*
```

- Hook manages all state, handlers, side effects.
- Container passes hook props to screen.
- Screen renders UI using props.
- Screen composes smaller reusable components from `components/`.

---

## 11. Styling Rules

1. **Default: co-locate styles**
   - Keep styles inside the component or screen file.
2. **Extract large styles**
   - If styles exceed ~100 lines or reduce readability, move them to a separate file:
     - Example: `Receipt.styles.ts`
   - The styles file must live in the same folder as the component.
3. **Extract reusable styles**
   - If styles are reused across multiple components, move them to a shared styles folder:
     - Example: `ui/styles/` or `ui/components/shared/styles/`
4. **Do not prematurely extract**
   - Do not move styles to shared unless they are reused in multiple places.
5. **Keep styles close to usage**
   - Avoid global style folders far from components.
6. **Shared styles should be primitives**
   - Allowed: spacing, typography, colors, layout helpers
   - Avoid: full component or screen-specific styles
7. **Line count is a guideline**
   - Use ~100 lines as a guideline, not a strict rule.
   - Prioritize readability over rigid thresholds.

---

## 12. String Management Rules

1. **Avoid one giant app-wide strings file**
   - Prefer per-feature or per-screen modules; do not put every screen’s copy in a single global file.
2. **Do not hardcode strings in components**
   - Avoid inline strings unless trivial.
3. **Use screen-level or feature-level string modules**
   - Place strings close to where they are used (e.g. `features/<feature>/string.ts` for a whole feature, or co-located `*.strings.ts` where a screen owns its copy exclusively).
4. **Namespace strings**
   - Export objects like:
     - `loginStrings.title`
     - `receiptStrings.summary`
5. **Extract shared strings only when reused**
   - For auth, all copy lives in one module: `features/auth/string.ts` (named exports per area: `loginScreenStrings`, etc.).
6. **Avoid generic shared strings**
   - Do not create vague keys like `title`, `label`, etc.
7. **Prepare for localization**
   - Structure strings so they can easily map to i18n keys later.