# TrainIQ Skill Test Design

## Context

TrainIQ needs a new student route at `/student/skill-test` where every student takes the same shared exam. The page must support:

- Multiple-choice questions
- Single-choice questions
- Coding questions
- Auto-scoring on submit
- Results summary after submit
- Persistence in the database tied to the authenticated student profile

The current app uses Next.js 16 App Router, a shared student dashboard layout, Supabase Auth for identity, and Prisma with PostgreSQL for application data. Student identity is already available through `getCurrentUserProfile()`, and `profiles.id` matches the authenticated user id.

### Decisions from brainstorming

| Decision | Choice |
|---|---|
| Route | `/student/skill-test` |
| Exam model | One built-in shared exam for all students |
| Results | Interactive page with results summary and scoring after submit |
| Persistence | Save attempts and scores in the database |
| Student linkage | Persist against `profiles.id` |
| Coding evaluation | Auto-score against expected logic/output |
| Coding execution model | Constrained evaluator, not arbitrary raw code execution inside the Next.js process |

---

## Approach: Shared Exam + Persistent Attempts + Constrained Coding Evaluator

The first version should use one active shared exam stored in the database. Every authenticated student loads the same exam definition, submits one attempt, and receives a scored result summary. The app persists the attempt, individual responses, and per-question scoring details so results remain linked to the student record.

Choice questions are scored directly from stored correct answers. Coding questions are auto-scored through a constrained evaluation model:

1. Restrict coding prompts to a fixed language shape for the first version
2. Require a fixed function signature per coding question
3. Store hidden evaluation cases in the database
4. Evaluate submitted code against expected outputs
5. Persist awarded points and evaluator feedback

This avoids a dangerous shortcut where arbitrary student code runs freely in the application server while still delivering automatic scoring behavior.

### Why this approach?

- Matches the product requirement that all students take the same exam
- Fits the existing auth and dashboard structure cleanly
- Creates a durable exam history per student
- Keeps scoring logic deterministic and testable
- Leaves room for future expansion to assigned exams or richer evaluation infrastructure

---

## Route And UX Model

The route will live under the existing dashboard group so it inherits the current student shell:

- `app/(dashboard)/student/skill-test/page.tsx`

The page will have two primary states:

1. **Active attempt state**
   - Loads the active shared exam
   - Renders question sections for single-choice, multiple-choice, and coding questions
   - Lets the student answer all questions and submit once

2. **Completed result state**
   - Shows score, percentage, and per-section summary
   - Shows per-question correctness details
   - Displays coding evaluation feedback and awarded points

If no active exam exists, the page should show a structured empty state rather than a broken or partial layout.

If a student already has a completed attempt for the active exam, the page should default to showing the latest result instead of silently creating a retake.

---

## Data Model

The schema should remain normalized so exam content, attempts, and scoring data are maintainable.

### `SkillTest`

Represents the shared exam definition.

- `id`
- `title`
- `description`
- `instructions`
- `status` (`draft`, `active`, `archived`)
- `durationInMinutes`
- `totalPoints`
- `createdAt`
- `updatedAt`

### `SkillTestQuestion`

Represents a question inside the exam.

- `id`
- `skillTestId`
- `prompt`
- `questionType` (`single_choice`, `multiple_choice`, `coding`)
- `displayOrder`
- `points`
- `codingLanguage`
- `codingFunctionName`
- `codingStarterCode`
- `createdAt`
- `updatedAt`

### `SkillTestOption`

Represents answer options for choice questions.

- `id`
- `questionId`
- `label`
- `value`
- `displayOrder`
- `isCorrect`

### `SkillTestCodingCase`

Represents hidden evaluator cases for coding questions.

- `id`
- `questionId`
- `inputPayload`
- `expectedOutputPayload`
- `displayOrder`
- `pointsWeight`

### `SkillTestAttempt`

Represents one student’s attempt for the shared exam.

- `id`
- `skillTestId`
- `studentProfileId`
- `status` (`in_progress`, `submitted`, `evaluation_failed`)
- `startedAt`
- `submittedAt`
- `earnedPoints`
- `totalPoints`
- `percentageScore`
- `createdAt`
- `updatedAt`

### `SkillTestResponse`

Represents one answer in an attempt.

- `id`
- `attemptId`
- `questionId`
- `selectedOptionIds`
- `submittedCode`
- `isCorrect`
- `earnedPoints`
- `evaluationSummary`
- `createdAt`
- `updatedAt`

### Relationship Notes

- `SkillTestAttempt.studentProfileId` must reference `Profile.id`
- The current authenticated student is resolved from `getCurrentUserProfile()`
- The first version assumes a single active shared exam, but the schema should not hardcode that assumption

---

## Scoring Model

### Single-choice questions

- One correct option
- Full points if selected option matches
- Zero otherwise

### Multiple-choice questions

- One or more correct options
- First version should use exact-match scoring for determinism
- Full points only when the selected option set equals the correct option set

### Coding questions

- Student submits code for a required function signature
- Hidden test cases are evaluated on submit
- Points are awarded from case results
- The result stores:
  - pass/fail state
  - awarded points
  - concise evaluator summary

### Coding Evaluator Constraint

The first version should not pretend to support arbitrary sandboxed execution. Instead, it should explicitly support tightly constrained function-style coding questions and clearly structure the server-side evaluator around that limitation.

If evaluation fails unexpectedly, the app should persist the attempt and mark the response with evaluation failure details instead of discarding the submission.

---

## Server Responsibilities

The server layer should provide:

- A loader to fetch the active exam with ordered questions and options
- A loader to fetch the current student’s latest attempt for that exam
- A submit action to:
  - validate the payload
  - create or finalize the attempt
  - score all responses
  - persist per-question results
  - return the completed attempt summary

The scoring logic should live in dedicated server-side modules, not inline inside the page component, so it is independently testable.

---

## UI Responsibilities

The page should follow the existing dashboard design system from `app/globals.css` and the current student dashboard shell.

### Page content

- Header section introducing the exam
- Instruction block with duration, question count, and scoring context
- Question list with section labels by question type
- Accessible controls for:
  - radio selection
  - checkbox selection
  - coding textarea/editor input
- Submit action with pending state
- Results summary card after submit
- Per-question review panel

### Navigation integration

- Add `Skill Test` to the student sidebar
- Add `/student/skill-test` label to the dashboard navbar breadcrumb mapping

---

## Error Handling

The page should handle the following cases explicitly:

- No authenticated user: existing auth redirect flow
- No active exam: show empty state
- Invalid submission payload: return field-level validation and preserve answers
- Duplicate submission: enforce idempotent submit behavior via attempt status
- Coding evaluator failure: store failure state and show a clear result message
- Missing exam content: fail safely with a structured server error path

---

## Testing Strategy

Implementation should be test-first where feasible and should cover scoring and persistence behavior, not just rendering.

### Required verification areas

- Prisma schema changes generate successfully
- Active exam query resolves correctly
- Student attempt creation links to `profiles.id`
- Single-choice scoring is correct
- Multiple-choice exact-match scoring is correct
- Coding evaluator scores hidden cases correctly
- Completed attempts render result summaries
- Existing dashboard navigation reflects the new route
- No-active-exam state renders cleanly

### Manual browser checks

- Visit `/student/skill-test`
- Complete and submit the exam
- Confirm result summary renders
- Reload and confirm the persisted result is shown
- Confirm sidebar and breadcrumb labels are correct

---

## Out Of Scope For First Version

- Multiple different exams
- Trainer or admin exam authoring UI
- Retake policy configuration
- Timed countdown enforcement
- True arbitrary sandboxed code execution infrastructure
- Cohort analytics or leaderboard reporting
