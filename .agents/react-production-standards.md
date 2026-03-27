## React Production Standards

All React code written in this project **MUST** follow these non-negotiable, production-ready rules.

### Modern React APIs — Use These, Not Legacy Patterns

| Task | ✅ Use | ❌ Never Use |
|---|---|---|
| Form mutations / server actions | `useActionState` | manual `useState` + `useEffect` for async state |
| Concurrent UI transitions | `useTransition` | blocking state updates without `startTransition` |
| Optimistic UI updates | `useOptimistic` | fake loading states with manual rollback logic |
| Derived / memoized values | `useMemo` | recomputing expensive values on every render |
| Stable callback references | `useCallback` | inline arrow functions passed to memoized children |
| Imperative DOM access | `useRef` | direct DOM queries (`document.querySelector`) |
| External store subscription | `useSyncExternalStore` | `useEffect` + `useState` polling external state |
| Resource data (experimental) | `use(promise)` / `use(context)` | `useEffect` data fetching in client components |

### `useActionState` — Form & Mutation Pattern

```tsx
// ✅ Correct: useActionState for all form submissions and server actions
const [formState, submitFormAction, isFormPending] = useActionState(
  serverActionHandler,
  initialFormState,
);
```

- Always derive loading UI from the `isPending` boolean — never maintain a separate `isLoading` state.
- Always type the state object explicitly; never use `any`.
- The action function must be defined as a Server Action (`"use server"`) when mutating server data.

### `useTransition` — Non-Urgent State Updates

```tsx
// ✅ Correct: wrap non-urgent updates in startTransition to keep UI responsive
const [isPending, startTransition] = useTransition();

function handleTabChange(nextTab: Tab) {
  startTransition(() => {
    setActiveTab(nextTab);
  });
}
```

- Use `startTransition` for navigation, tab switches, filter changes, and any update that does not need to be synchronous.
- Never block the main thread by performing expensive state updates outside `startTransition`.

### `useOptimistic` — Instant Perceived Performance

```tsx
// ✅ Correct: optimistic updates for mutation-heavy lists
const [optimisticItems, addOptimisticItem] = useOptimistic(
  serverItems,
  (currentItems, newItem) => [...currentItems, newItem],
);
```

- Apply `useOptimistic` for all list mutations (add, delete, reorder) where server round-trip latency would be noticeable.
- The optimistic state is automatically rolled back on server action failure — never implement manual rollback logic.

### Preventing Unnecessary Re-Renders

- **Memoize components** that receive stable props but re-render due to parent state changes: `const MemoizedComponent = memo(Component)`.
- **Colocate state** as close to where it is used as possible; never lift state higher than necessary.
- **Split contexts** by update frequency: keep frequently-changing values (e.g., mouse position) in a separate context from rarely-changing values (e.g., theme).
- **Avoid object/array literals in JSX props** — they create new references on every render:
  ```tsx
  // ❌ Bad — new array reference every render
  <Chart data={[1, 2, 3]} />
  // ✅ Good — stable reference
  const chartData = useMemo(() => [1, 2, 3], []);
  <Chart data={chartData} />
  ```
- **Never use index as key** in dynamic lists; always use a stable, unique identifier.
- **Prefer Server Components** for data-display components; push `"use client"` boundary as far down the tree as possible.

### General Production Principles

- **No `useEffect` for data fetching** in Server Component trees — fetch on the server or use Server Actions.
- **Error boundaries** must wrap every async client subtree; never let unhandled promise rejections crash the page.
- **Suspense boundaries** must wrap every lazily-loaded component and every async data source.
- **TypeScript strict mode** — all props, state, and action return types must be explicitly typed; `any` is forbidden.
- **Accessibility first** — every interactive element must have an accessible label, role, and keyboard handler.
