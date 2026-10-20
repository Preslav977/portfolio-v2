# Project Instructions

@GUIDELINES.md

## Rules — these are enforced by `.claude/hooks/guard.sh`

These four rules are hard boundaries. They are enforced mechanically by a
PreToolUse hook and by the `deny` / `ask` lists in `.claude/settings.json`, not
just by convention. Do not try to work around them.

### 1. No committing

Never run `git commit`, `git commit-tree`, `git merge`, `git cherry-pick`,
`git revert`, `git am`, or `git rebase`. Stage changes with `git add` if the
user asks, then let the user run the commit themselves. If a task appears to
require a commit, stop and tell the user.

### 2. No reading or writing `.env` files

Never read, write, edit, grep, or otherwise access `.env` or any `.env.*`
file (`.env.local`, `.env.production`, …). This includes doing it indirectly
through a shell command (`cat .env`, `source .env`, `--env-file=.env`).
If the work genuinely needs a value from a `.env` file, ask the user to
provide it.

### 3. No changes without approval

Every write to a file — `Write`, `Edit`, `NotebookEdit` — requires the user's
explicit approval first. Present what you intend to change and wait for a
yes. Reading files, searching, and running read-only commands are fine without
asking.

### 4. No installing packages without approval

Never run an install or add command (`npm install`, `npm i`, `npm ci`,
`pnpm add`, `yarn add`, `bun add`, `pip install`, `uv add`, `cargo add`,
`go get`, …) without the user's explicit approval. `npx <pkg>` counts as an
install unless the package is already present in `node_modules/.bin`.
Running already-installed binaries (`npm run build`, `npx tsc`) is fine.

## Granted permissions — run these freely, without asking

These are allowed by the `allow` list in `.claude/settings.json`. Do them
directly; don't ask for approval first.

- **Read anything inside the project directory** — `Read`, `Grep`, and `Glob`
  over the project tree. The `.env` exception above still applies.
- **Build** — `npm run build`
- **Lint** — `npm run lint` (also `npx eslint`, `npx prettier`)
- **Test** — `npx vitest`, `vitest`, `npm test`
- **Run the app** — `npm run dev` (or `npx vite`). Only start it if a dev
  server is **not** already running; the guard blocks a second one. If one is
  already up, use it (http://localhost:5173) instead of starting another.
- **Web search** — `WebSearch` and `WebFetch`

Reading, searching, and running these commands needs no approval. Any *write*
still does.

## Stack

- Vite + React 19 + TypeScript
- ESLint (flat config) and Prettier
- Vitest for tests
