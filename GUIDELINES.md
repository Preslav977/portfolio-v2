# Working Guidelines

These guidelines apply to every task in this project. They are imported by
`CLAUDE.md`, so they are loaded automatically at the start of every session —
you do not need to repeat them.

**Stack:** Vite · React 19 · TypeScript · Vitest · ESLint (flat config) · Prettier

---

## 1. Always ask me questions first

Before starting work, clarify anything ambiguous about *intent*: what the
feature should do, how it should behave, what it should look like, which
approach is wanted. Ask up front rather than guessing — a question now is
cheaper than a rewrite later.

**What this does not mean:** the operations already granted in `CLAUDE.md`
(run freely, no prompt) still run freely. Do not ask permission to read a
file, build, lint, run the tests, or search the web. Ask about *what to
build*, not *whether I may use my tools*.

Ask when the task is underspecified, when two readings of the request would
lead to materially different code, or when the right home for a new file is
genuinely unclear. Do not ask about things you can determine yourself by
scanning the repo or reading the docs.

## 2. Don't hallucinate or give false information

State only what you actually know or have verified. If you are not sure
whether something works, say so and check. Do not invent:

- APIs, function signatures, or config options you have not read
- File contents, paths, or directory structures you have not looked at
- Test results, build output, or command output you did not run
- Version numbers, changelog details, or deprecation status you did not verify

If a tool call failed, say it failed. If a step was skipped, say it was
skipped. If a check was inconclusive, say that instead of implying success.
An honest "I don't know — let me check" is always better than a confident
guess.

## 3. Provide where you got the information and explain why you decided on this solution

For every non-trivial decision, state:

- **The source** — the file and line, the doc page, the error message, or the
  command output the decision rests on. Cite it concretely
  (`src/App.tsx:12`, the official Vite docs, the stack trace).
- **The reasoning** — why this approach over the alternatives, and what
  constraints drove the choice (existing patterns, the stack, the rules in
  this file).

Cite the actual evidence, not a vague "per best practice". If a choice was
made from a hunch rather than evidence, say that.

## 4. Break big tasks into smaller pieces

If a task is large, split it into ordered sub-tasks, confirm the plan, then
execute them one at a time. This keeps context small, makes progress
verifiable, and avoids burning tokens on a long chain of work built on an
unverified assumption.

A good split means each piece is independently checkable — a schema and its
types, then the hook that uses them, then the tests. If a step turns out to
be wrong, only that step needs redoing, not the whole task. Report progress
between meaningful steps rather than running silent for a long time.

## 5. Look up the documentation before Stack Overflow or forums

Check the **official** documentation first: the library's own docs site, the
API reference, the changelog, the source on GitHub, the type definitions in
`node_modules`. These are authoritative and version-accurate.

Forums (Stack Overflow, Reddit, Discord) and blog posts are a last resort,
and when you do use one, treat it as a lead to verify rather than an answer
to trust. Prefer the highest version of the library you have installed —
`node_modules/<pkg>/package.json` tells you what is actually here, and the
installed source is the final word on what the API really does.

When a behaviour is surprising, reading the installed source or types in
`node_modules` is often faster and more reliable than searching at all.

## 6. Figure out where each file belongs by scanning the folders

Before creating a file, scan the directory structure and follow the
conventions already in the repo. Match the existing layout, naming, and file
organisation rather than inventing a new structure.

In this project the current layout is:

```
src/
  main.tsx        entry point — mounts the React root
  App.tsx         root component
  index.css       global styles
```

As the project grows, follow the standard React + Vite convention: one
component per file, colocated near what it renders, with a `components/`
folder once there are enough of them to warrant it. Do not create a folder
for a single file — let the structure emerge from actual content.

## 7. Keep functions clean, small, pure, and single-purpose

Each function should do one thing, be easy to read, and be straightforward
to test. Prefer pure functions — same input, same output, no side effects —
so behaviour is predictable and tests are simple.

Keep them small enough to read in one screen. If a function needs a comment to
explain what it does, that is a sign it should be split.

No duplicated logic: if you write the same block twice, extract it. No
hidden side effects — a function that both computes and mutates is hard to
reason about. Follow single-responsibility: a function that fetches, parses,
formats, *and* renders should be several functions.

Match the surrounding style — the repo uses TypeScript, React function
components, and Prettier formatting (`npm run lint` / `npx prettier`).

## 8. Split files that get too large

When a file grows past a few hundred lines, split it. Natural seams:

- **Interfaces and types** → a dedicated `types.ts` or `*.types.ts`
- **Schemas and validators** → a `schemas.ts`
- **Constants** → a `constants.ts`
- **Pure helpers** → a `utils/` or `lib/` folder
- **Components** → one component per file under `components/`

Each extracted piece should have a clear, single responsibility and a name
that says what it holds. The parent file then reads as a short index of
concerns. Do not split preemptively — split when the file is actually too
big to read comfortably.

## 9. Give tradeoffs for each solution, and explain what was done

When there is a real choice between approaches, present the options with
their tradeoffs and a recommendation:

- **Simplicity** — how much code it takes
- **Performance** — cost at runtime
- **Maintainability** — how hard it is to change later
- **Fit** — how well it matches the existing codebase

Then, after implementing, explain what was actually done: which files
changed, what the behaviour is now, how it was verified, and anything left
out. If the implementation diverged from the original plan, say so and why.

For a task with an obvious single good approach, do not manufacture fake
alternatives — just implement it and explain the reasoning (see rule 3).

## 10. Use naming conventions that read clearly

Names should be readable and unambiguous to anyone picking up the file,
without needing context. Follow the conventions already in the repo and the
usual ones for the stack:

| Thing | Convention | Example |
|---|---|---|
| React components | PascalCase | `ProjectCard.tsx` |
| Hooks | `use` prefix, camelCase | `useProjects.ts` |
| Types & interfaces | PascalCase, no `I` prefix | `Project` |
| Functions & variables | camelCase | `formatDate()` |
| Constants | UPPER_SNAKE_CASE | `MAX_RETRY_COUNT` |
| CSS files | kebab-case | `project-card.css` |
| Folders | kebab-case | `components/` |

Pick names that describe *what it is* rather than *how it works*. Avoid
abbreviations (`usr`, `cfg`, `mgr`) and single letters except in tiny scopes.
Name files after their main export, so the file is identifiable from a
directory listing.

## 11. Write tests with Vitest

Cover **happy paths, error cases, and edge cases** for every function and
component you add or change.

- **Happy path** — the normal, expected input
- **Errors** — invalid input, thrown errors, rejected promises, failure
  responses
- **Edge cases** — empty input, `null`/`undefined`, zero, boundary values,
  very long strings, unicode

Use Vitest (`npx vitest`, `npx vitest run`). Keep tests next to the code
they cover or in a `__tests__/` folder, named after the unit under test
(`formatDate.test.ts`). Use `describe` / `it` blocks that read as sentences.
Test behaviour, not implementation details — assert on outputs, not on how
the code reaches them.

Run `npx vitest run` after writing tests and report the actual result,
including failures.

## 12. Always read this file first

Read `GUIDELINES.md` at the start of every task, and re-read it after any
mistake, so the same correction is never needed twice. It is imported by
`CLAUDE.md`, so it is already in context — but check it consciously before
acting, especially the sections relevant to the work at hand.

If a mistake traces back to a gap in these guidelines, add the missing rule
here rather than relying on memory. If a rule here is wrong, out of date, or
contradicts what you need, say so and propose the correction instead of
working around it.
