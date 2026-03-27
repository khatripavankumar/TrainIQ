<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->
## Design System Rule

Treat `app/globals.css` as the source of truth for the project design system.

- Always use existing design tokens, utility classes, and style patterns from `app/globals.css` first.
- If a needed style or token is not available, add it to `app/globals.css` as part of the design system, then use that new system entry in components/pages.
- Avoid one-off inline styles or ad-hoc visual patterns when the design system can be used or extended.

## Code Naming and Readability Rules

Enforce these standards in all code:

- **Naming Conventions**: Use flawless, self-descriptive names for functions, variables, classes, and modules that eliminate the need for comments.
- **Functions**: `calculateTotalTicketPrice()` instead of `calc()`.
- **Variables**: `userActiveSubscriptions` instead of `subs`.
- **Classes**: `TicketAssignmentService` instead of `TAS`.
- **Production-Ready Clarity**: Names must be instantly understandable by a junior engineer with zero context.
- **Readability First**: Prioritize names that "speak for themselves" over clever abbreviations or internal jargon.

## SOLID Principles

- Every function and class must demonstrably follow the SOLID principles:
  - **Single Responsibility**: A class or function should have one, and only one, reason to change.
  - **Open/Closed**: Entities should be open for extension, but closed for modification.
  - **Liskov Substitution**: Objects of a superclass shall be replaceable with objects of its subclasses without breaking the application.
  - **Interface Segregation**: No client should be forced to depend on methods it does not use.
  - **Dependency Inversion**: High-level modules should not depend on low-level modules. Both should depend on abstractions.

## React Production Standards

See [`.agents/react-production-standards.md`](.agents/react-production-standards.md) for the full rule set covering modern React APIs (`useActionState`, `useTransition`, `useOptimistic`), re-render prevention, and general production principles.

## Package Management

- **pnpm**: This project uses `pnpm` as the package manager. **You MUST use `pnpm` for all package management tasks** (e.g., `pnpm install`, `pnpm add`, `pnpm run`). Do not use `npm` or `yarn`.