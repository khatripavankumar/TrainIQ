# Skill Test Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a shared `/student/skill-test` experience that lets authenticated students complete one persisted exam with single-choice, multiple-choice, and auto-scored coding questions, then view their scored results.

**Architecture:** Keep the route as an async App Router page inside the existing student dashboard, but move scoring, exam loading, and attempt persistence into dedicated server modules. Use Prisma for exam content and attempt storage, seed one active exam in the database, and use a constrained function-style coding evaluator instead of freeform arbitrary code execution.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Prisma, PostgreSQL, Supabase Auth, Vitest, Testing Library, pnpm

---

### Task 1: Add Unit Test Infrastructure

**Files:**
- Modify: `package.json`
- Create: `vitest.config.mts`
- Create: `vitest.setup.ts`

**Step 1: Add the test dependencies**

Run:

```bash
pnpm add -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/dom vite-tsconfig-paths
```

Expected: dev dependencies install successfully.

**Step 2: Add the failing test command**

Update `package.json` with:

```json
"test": "vitest run",
"test:watch": "vitest"
```

Then run:

```bash
pnpm test
```

Expected: FAIL because Vitest config and setup files do not exist yet.

**Step 3: Add minimal Vitest config**

Create `vitest.config.mts`:

```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
	plugins: [tsconfigPaths(), react()],
	test: {
		environment: "jsdom",
		setupFiles: ["./vitest.setup.ts"],
		include: ["__tests__/**/*.test.ts", "__tests__/**/*.test.tsx"],
	},
});
```

Create `vitest.setup.ts`:

```ts
import "@testing-library/jest-dom/vitest";
```

**Step 4: Verify the test runner works**

Run:

```bash
pnpm test
```

Expected: PASS with zero tests found, or FAIL only because feature tests have not been added yet.

**Step 5: Commit**

```bash
git add package.json pnpm-lock.yaml vitest.config.mts vitest.setup.ts
git commit -m "test: add vitest infrastructure"
```

---

### Task 2: Add Database Schema For Shared Exams And Student Attempts

**Files:**
- Modify: `prisma/schema.prisma`

**Step 1: Write the failing schema usage test**

Create `__tests__/skill-test/skill-test-schema-shape.test.ts`:

```ts
import { describe, expect, it } from "vitest";

describe("skill test schema names", () => {
	it("defines the expected persisted model names", async () => {
		const prismaModule = await import("@/generated/prisma/client");

		expect(prismaModule.Prisma.ModelName.SkillTest).toBe("SkillTest");
		expect(prismaModule.Prisma.ModelName.SkillTestAttempt).toBe("SkillTestAttempt");
		expect(prismaModule.Prisma.ModelName.SkillTestResponse).toBe("SkillTestResponse");
	});
});
```

**Step 2: Run test to verify it fails**

Run:

```bash
pnpm test __tests__/skill-test/skill-test-schema-shape.test.ts
```

Expected: FAIL because the Prisma client does not expose those model names yet.

**Step 3: Add the minimal Prisma models and enums**

Extend `prisma/schema.prisma` with:

- `SkillTestStatus`
- `SkillTestQuestionType`
- `SkillTestAttemptStatus`
- `SkillTest`
- `SkillTestQuestion`
- `SkillTestOption`
- `SkillTestCodingCase`
- `SkillTestAttempt`
- `SkillTestResponse`

Use descriptive field names and a foreign key from `SkillTestAttempt.studentProfileId` to `Profile.id`.

**Step 4: Regenerate Prisma client and verify**

Run:

```bash
pnpm prisma generate
pnpm test __tests__/skill-test/skill-test-schema-shape.test.ts
```

Expected: PASS.

**Step 5: Create and review the migration**

Run:

```bash
pnpm prisma migrate dev --name add-skill-test-schema
```

Expected: migration created successfully with the new exam and attempt tables.

**Step 6: Commit**

```bash
git add prisma/schema.prisma prisma/migrations generated/prisma __tests__/skill-test/skill-test-schema-shape.test.ts
git commit -m "feat: add skill test persistence schema"
```

---

### Task 3: Seed The Shared Built-In Exam

**Files:**
- Modify: `package.json`
- Create: `scripts/seed-skill-test.ts`
- Test: `__tests__/skill-test/skill-test-seed-data.test.ts`

**Step 1: Write the failing seed-shape test**

Create `__tests__/skill-test/skill-test-seed-data.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { buildSharedSkillTestSeed } from "@/scripts/seed-skill-test";

describe("shared skill test seed", () => {
	it("includes single choice, multiple choice, and coding questions", () => {
		const seed = buildSharedSkillTestSeed();
		const questionTypes = seed.questions.map((question) => question.questionType);

		expect(questionTypes).toContain("single_choice");
		expect(questionTypes).toContain("multiple_choice");
		expect(questionTypes).toContain("coding");
	});
});
```

**Step 2: Run test to verify it fails**

Run:

```bash
pnpm test __tests__/skill-test/skill-test-seed-data.test.ts
```

Expected: FAIL because the seed builder does not exist yet.

**Step 3: Create the shared exam seed script**

Create `scripts/seed-skill-test.ts` with:

- an exported `buildSharedSkillTestSeed()` helper used by tests
- a runnable script that upserts one active exam
- ordered questions, options, and coding cases

Use `pnpm exec tsx scripts/seed-skill-test.ts` as the execution path.

**Step 4: Add the package script and verify**

Add to `package.json`:

```json
"db:seed:skill-test": "tsx scripts/seed-skill-test.ts"
```

Run:

```bash
pnpm test __tests__/skill-test/skill-test-seed-data.test.ts
pnpm db:seed:skill-test
```

Expected: test passes and the shared exam is inserted or updated successfully.

**Step 5: Commit**

```bash
git add package.json scripts/seed-skill-test.ts __tests__/skill-test/skill-test-seed-data.test.ts
git commit -m "feat: seed shared skill test"
```

---

### Task 4: Build The Scoring Engine And Constrained Coding Evaluator

**Files:**
- Create: `lib/skill-tests/scoring.ts`
- Create: `lib/skill-tests/coding-evaluator.ts`
- Create: `lib/skill-tests/types.ts`
- Test: `__tests__/skill-test/scoring.test.ts`

**Step 1: Write the failing scoring tests**

Create `__tests__/skill-test/scoring.test.ts` with cases for:

- correct single-choice answer
- incorrect single-choice answer
- exact-match multiple-choice answer
- partial multiple-choice answer scoring zero
- coding answer passing all hidden cases
- coding answer failing one or more hidden cases

Use real scoring inputs, not mocks.

**Step 2: Run test to verify it fails**

Run:

```bash
pnpm test __tests__/skill-test/scoring.test.ts
```

Expected: FAIL because the scoring and evaluator modules do not exist yet.

**Step 3: Implement the minimal scoring code**

Create:

- `lib/skill-tests/types.ts` for input/output contracts
- `lib/skill-tests/coding-evaluator.ts` for constrained function-style evaluation
- `lib/skill-tests/scoring.ts` for total score and per-question scoring

Implementation rules:

- multiple-choice uses exact-set matching
- coding questions use stored hidden cases
- evaluator returns deterministic per-case results
- no UI concerns in these modules

**Step 4: Run tests to verify they pass**

Run:

```bash
pnpm test __tests__/skill-test/scoring.test.ts
```

Expected: PASS.

**Step 5: Commit**

```bash
git add lib/skill-tests/types.ts lib/skill-tests/coding-evaluator.ts lib/skill-tests/scoring.ts __tests__/skill-test/scoring.test.ts
git commit -m "feat: add skill test scoring engine"
```

---

### Task 5: Add Server-Side Exam Loading And Attempt Submission

**Files:**
- Create: `lib/skill-tests/repository.ts`
- Create: `app/(dashboard)/student/skill-test/actions.ts`
- Test: `__tests__/skill-test/repository.test.ts`
- Test: `__tests__/skill-test/submit-skill-test.test.ts`

**Step 1: Write the failing repository and submit tests**

Create tests that verify:

- the active exam query returns ordered questions and options
- the latest completed attempt can be fetched by `studentProfileId`
- submit creates or finalizes one attempt for the authenticated student
- per-question responses and total score are persisted

**Step 2: Run tests to verify they fail**

Run:

```bash
pnpm test __tests__/skill-test/repository.test.ts __tests__/skill-test/submit-skill-test.test.ts
```

Expected: FAIL because repository and action modules do not exist yet.

**Step 3: Implement the minimal server modules**

Create:

- `lib/skill-tests/repository.ts` for Prisma-backed reads and writes
- `app/(dashboard)/student/skill-test/actions.ts` for submission orchestration

Action requirements:

- resolve current student via `getCurrentUserProfile()`
- validate payload shape
- guard against duplicate completed submissions
- score through `lib/skill-tests/scoring.ts`
- persist attempt and response records

**Step 4: Run tests to verify they pass**

Run:

```bash
pnpm test __tests__/skill-test/repository.test.ts __tests__/skill-test/submit-skill-test.test.ts
```

Expected: PASS.

**Step 5: Commit**

```bash
git add lib/skill-tests/repository.ts app/(dashboard)/student/skill-test/actions.ts __tests__/skill-test/repository.test.ts __tests__/skill-test/submit-skill-test.test.ts
git commit -m "feat: persist skill test attempts"
```

---

### Task 6: Build The Skill Test UI Route

**Files:**
- Create: `app/(dashboard)/student/skill-test/page.tsx`
- Create: `components/skill-test/skill-test-shell.tsx`
- Create: `components/skill-test/skill-test-form.tsx`
- Create: `components/skill-test/skill-test-results.tsx`
- Test: `__tests__/skill-test/skill-test-form.test.tsx`

**Step 1: Write the failing UI tests**

Create `__tests__/skill-test/skill-test-form.test.tsx` that verifies:

- single-choice questions render radio controls
- multiple-choice questions render checkbox controls
- coding questions render textareas
- submit button is disabled while pending
- results summary renders section score labels from server-provided data

**Step 2: Run test to verify it fails**

Run:

```bash
pnpm test __tests__/skill-test/skill-test-form.test.tsx
```

Expected: FAIL because the UI components do not exist yet.

**Step 3: Implement the minimal route and components**

Create:

- `app/(dashboard)/student/skill-test/page.tsx` as the async route entry
- `components/skill-test/skill-test-shell.tsx` for shared layout content
- `components/skill-test/skill-test-form.tsx` for interactive answering
- `components/skill-test/skill-test-results.tsx` for completed attempt summary

Implementation notes:

- keep the route in the existing dashboard shell
- use current design tokens from `app/globals.css`
- make form controls accessible and keyboard-friendly
- default to showing results if a completed attempt already exists

**Step 4: Run tests to verify they pass**

Run:

```bash
pnpm test __tests__/skill-test/skill-test-form.test.tsx
```

Expected: PASS.

**Step 5: Commit**

```bash
git add app/(dashboard)/student/skill-test/page.tsx components/skill-test/skill-test-shell.tsx components/skill-test/skill-test-form.tsx components/skill-test/skill-test-results.tsx __tests__/skill-test/skill-test-form.test.tsx
git commit -m "feat: add skill test route"
```

---

### Task 7: Wire Dashboard Navigation And Empty States

**Files:**
- Modify: `components/dashboard-sidebar.tsx`
- Modify: `components/dashboard-navbar.tsx`
- Test: `__tests__/skill-test/dashboard-navigation.test.tsx`

**Step 1: Write the failing navigation test**

Create `__tests__/skill-test/dashboard-navigation.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { DashboardSidebar } from "@/components/dashboard-sidebar";

vi.mock("next/navigation", () => ({
	usePathname: () => "/student/skill-test",
}));

describe("dashboard skill test navigation", () => {
	it("shows the skill test entry", () => {
		render(<DashboardSidebar userName="Student" userEmail="student@example.com" />);
		expect(screen.getByText("Skill Test")).toBeInTheDocument();
	});
});
```

**Step 2: Run test to verify it fails**

Run:

```bash
pnpm test __tests__/skill-test/dashboard-navigation.test.tsx
```

Expected: FAIL because the sidebar and navbar do not know about `/student/skill-test`.

**Step 3: Implement the minimal navigation updates**

Update:

- `components/dashboard-sidebar.tsx` to add the `Skill Test` item
- `components/dashboard-navbar.tsx` to map `/student/skill-test` to `Skill Test`

**Step 4: Run tests to verify they pass**

Run:

```bash
pnpm test __tests__/skill-test/dashboard-navigation.test.tsx
pnpm lint:ts
```

Expected: PASS.

**Step 5: Commit**

```bash
git add components/dashboard-sidebar.tsx components/dashboard-navbar.tsx __tests__/skill-test/dashboard-navigation.test.tsx
git commit -m "feat: add skill test navigation"
```

---

### Task 8: Final Verification

**Files:**
- Verify only

**Step 1: Run the focused test suite**

```bash
pnpm test
```

Expected: PASS.

**Step 2: Run static verification**

```bash
pnpm lint:ts
```

Expected: PASS.

**Step 3: Seed the shared exam**

```bash
pnpm db:seed:skill-test
```

Expected: active exam exists in the database.

**Step 4: Run the app and manually verify**

```bash
pnpm dev
```

Manual checks:

- Sign in as a student
- Open `/student/skill-test`
- Complete the exam and submit
- Confirm scoring and results summary render
- Reload the page and confirm the persisted result appears
- Confirm sidebar and breadcrumb state are correct

**Step 5: Commit**

```bash
git add .
git commit -m "feat: ship student skill test"
```

---

## Notes For Execution

- Follow TDD strictly for scoring and submission logic.
- Keep async server logic out of UI tests where possible; test pure modules and synchronous components directly.
- Because Next.js 16 docs note that Vitest does not support async Server Components well, use unit tests for scoring and client UI, then browser verification for the async route itself.
- Do not introduce a fake arbitrary-code runner. Keep coding evaluation constrained to the approved first-version scope.
