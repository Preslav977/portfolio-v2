# Portfolio v2 — Implementation Plan

A plan for the portfolio site described in the brief. Follows `GUIDELINES.md`
(loaded via `CLAUDE.md`) and the hard rules in `CLAUDE.md`.

**Status:** plan only — no implementation yet. Every write still needs your
approval (rule 3).

---

## 1. Current state (verified, not assumed)

I read the repo before planning. What exists today:

| Fact                   | Value                                                                                               |
| ---------------------- | --------------------------------------------------------------------------------------------------- |
| `src/App.tsx`          | renders `<></>` — empty                                                                             |
| `src/main.tsx`         | React 19 `createRoot` + `StrictMode`                                                                |
| `src/index.css`        | empty `:root {}` — **this is where global styles go** (per your instruction)                         |
| `src/` files           | 4 (`App.tsx`, `main.tsx`, `index.css`, `tests/setup.js`)                                             |
| CSS Modules            | work natively in Vite, no plugin needed                                                             |
| `tsconfig.app.json`    | **`strict` is NOT enabled**                                                                         |
| `package.json` scripts | `dev`, `build`, `lint`, `preview`, `test`                                                           |
| Test deps              | `vitest@5.0.5`, `jsdom@30.1.3`, `@testing-library/react@16.3.3`, `jest-dom@7.0.1`, `user-event@14.6.8` |
| Test config            | `vite.config.ts` has `test: { globals: true, environment: "jsdom", setupFiles: "./src/tests/setup.js" }` |
| Icon library           | **none installed**                                                                                  |
| `DESIGN.md`            | **now written** — the design system: concept, verified palette, type scale, layout, component specs |
| Vite                   | `8.3.4`, React `19.3.1`, TypeScript `~6.0.2`                                                        |

**One gap that contradicts the brief, flagged now:**

1. **Brief #9 asks for strict TypeScript, but `"strict"` is absent from
   `tsconfig.app.json`.** TypeScript defaults `strict` to `false`, so the
   project is currently _not_ strict. Fixing this is Phase 0.

**Resolved since the plan was first written:**

- The test packages are installed and the DOM environment is configured, so
  component tests are no longer deferred to the end. Pure-function and
  component tests can both be written from Phase 0 onward.
- Global styles go in `src/index.css` (the file that already exists and is
  already imported by `main.tsx`) rather than a new `global.css`. There is no
  `src/styles/` directory — see §4.

---

## 2. Decisions I'm making, and why

Per `GUIDELINES.md` #3 and #9, here is each meaningful choice with its source.

### 2.1 Scroll animations: IntersectionObserver, not `animation-timeline`

**Decision:** reveal-on-scroll via `IntersectionObserver` + a CSS class toggle.

**Why not `animation-timeline: view()`:** MDN marks it _"not Baseline because
it does not work in some of the most widely-used browsers"_ — Chrome/Edge 115+
only, with Firefox and Safari lacking complete stable support. Vite 8's default
`build.target` is `baseline-widely-available` (Chrome 111, Firefox 114, Safari
16.4), so shipping a scroll-timeline-only animation would leave Firefox and
Safari users with no reveal at all.

`IntersectionObserver` is **Baseline since March 2019** (MDN) — it fires when
an element crosses a threshold, which is exactly "animate this section when
it enters the viewport". It also avoids the scroll-event jank that a
scroll-listener implementation would cause.

**Tradeoff:** `IntersectionObserver` needs ~15 lines of JS per hook, whereas
`animation-timeline` is pure CSS. In exchange, cross-browser correctness and
no scroll-handler cost. Correctness wins for a portfolio.

**Sources:** [MDN — animation-timeline](https://developer.mozilla.org/en-US/docs/Web/CSS/animation-timeline) · [MDN — Intersection Observer](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) · [Vite — build.target](https://vite.dev/config/build-options.html)

### 2.2 Motion safety: `prefers-reduced-motion` is mandatory

**Decision:** a global reduced-motion opt-out, applied to every animation.

**Why:** MDN marks `prefers-reduced-motion` as **Baseline: Widely available
since January 2020**. MDN's own guidance is to _remove_ unnecessary motion or
replace it with a subtle effect, and to keep only motion that communicates
state. Large scaling/panning motion is exactly what triggers vestibular
disorders.

**Tradeoff:** the global opt-out costs one `@media` block, but it also kills
the typewriter effect for those users. That's intended — the typewriter is
decorative, so it should collapse to the final text rather than disappear.

**Source:** [MDN — prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion)

### 2.3 Navigation: real anchors, no JS router

**Decision:** `<a href="#about">` + CSS `scroll-behavior: smooth` +
`scroll-margin-top` on sections.

**Why:** brief #10 says _"create them with HTML if possible"_. Real anchors
work with JavaScript disabled, are keyboard-accessible for free, and are
crawlable. `scroll-behavior: smooth` is Baseline (Chrome 61+, Safari 15.4+);
`scroll-margin-top` is widely available since April 2021 and is what keeps a
sticky header from covering the section you just jumped to.

**Tradeoff:** native smooth scrolling is not interruptible the way a JS
`scrollTo({ behavior: 'smooth' })` is on some browsers, and there's no
scroll-spy (auto-highlighting the current section). If you want the nav link
for the visible section to highlight, that needs an `IntersectionObserver`
too — I'll include it as optional in Phase 1, and you can say no.

**Source:** [MDN — scroll-margin-top](https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-margin-top)

### 2.4 Theme: `prefers-color-scheme` + a manual override

**Decision:** light is the default token set; `@media (prefers-color-scheme:
dark)` swaps the token values; a small toggle sets `data-theme` on `<html>` to
override, persisted in `localStorage`.

**Why:** `prefers-color-scheme` is Baseline since January 2020, so a visitor
with an OS dark-mode setting gets a dark site with zero JavaScript. The
manual toggle is layered on top because the brief mentions "light / dark
theme" as a thing to check colours against — meaning both themes must be
first-class, not an afterthought.

**Tradeoff:** three states (light / dark / system) would be more correct, but
brief #9 says don't overcomplicate a small project. Two states + "system"
as the default is the simpler cut. The toggle button is the one piece of
stateful JS in the whole plan.

### 2.5 Colours get checked, not eyeballed

**Decision:** all colours live as CSS custom properties in `src/index.css`,
and a pure `contrastRatio()` function is used to assert every
foreground/background pair in **both** themes against WCAG AA — 4.5:1 for body
text, 3:1 for large text and UI borders.

**Why:** brief #10 says _"run checks before applying a certain color (light /
dark theme)"_. A contrast function is pure arithmetic, so it is testable with
no DOM at all — the test stays fast and has no setup dependency. This turns
"run checks" into a CI-able test rather than a manual step I might skip.

**Tradeoff:** a small extra module and a test file, versus a build-time
colour linter. For ~12 token pairs, hand-rolled is simpler and has no
dependency.

### 2.6 Contact form: native validation + `mailto:`

**Decision:** a real `<form>` using HTML5 constraint validation
(`required`, `type="email"`, `minLength`), plus a `buildMailtoLink()` helper
that encodes subject and body into a `mailto:` URL.

**Why:** brief #6 wants a form you fill to send a message, and you specified
`mailto:` with no backend, no cost, and nothing to configure. Native
validation is free, accessible (browser messages are screen-reader
friendly), and needs no JS. The `mailto:` builder is a pure function, so the
encoding is testable.

**Known limitation, stated honestly:** `mailto:` requires a mail-handler
configured on the _visitor's_ device. On a machine with no mail client it
does nothing. A hosted form service (Formspree, etc.) would avoid that but
adds a third party, a dependency, and per-message cost concerns — which you
explicitly ruled out.

### 2.7 Tech icons: monogram chips, not an icon library

**Decision:** technology tags render as a small monogram badge (first letter
or short code) plus the tech name in text. Inline SVG for the handful of
interface icons that matter (arrow, GitHub, mail, external link).

**Why:** no icon library is installed, and installing one needs your approval
(brief #4 / rule 4 of `CLAUDE.md`). Monogram chips need zero dependencies and
keep the bundle tiny. The tech name is always in text next to the badge, so
the information is never icon-only — better for accessibility and screen
readers.

**Tradeoff:** monograms look less polished than real logos. Swapping in real
SVGs later is a change to one `TechTag` component, and I'll note it in a
comment so it's an obvious next step.

### 2.8 The typewriter: CSS `steps()` with a computed character count

**Decision:** monospace font, `overflow: hidden`, `width` animated from `0`
to `<length>ch` with `animation-timing-function: steps(n, end)`, where `n` is
the text length computed in TypeScript and applied as an inline style.

**Why:** brief #10 says to create animations in HTML/CSS where possible, and
brief #2 says the text must be editable later. Pure CSS means no timer, no
`setInterval`, no re-render loop — the browser drives it off the compositor.
Because the step count is computed from the string in TS, editing the text
later can't desync the animation (a hand-written `steps(24)` would).

**Tradeoff:** the text must be monospace for `ch` units to map to characters
exactly, which constrains typography for that one element. Non-monospace
fallback: the `ch` unit is still proportional to the "0" glyph, so the reveal
would be slightly off. I'll set the typewriter in a monospace stack and note
it.

**Source:** [MDN — animation-timing-function (steps)](https://developer.mozilla.org/en-US/docs/Web/CSS/animation-timing-function)

---

## 3. When to use props (brief #8)

This is the decision the brief asked me to make. The rule:

> **Data-driven content → typed data + props. Page-wide text → a central
> content file. One-off presentational bits → props only if they'd otherwise
> be duplicated.**

| Content                                                                   | Mechanism                                             | Why                                                                              |
| ------------------------------------------------------------------------- | ----------------------------------------------------- | -------------------------------------------------------------------------------- |
| Name, tagline, nav labels, about paragraphs, contact details, footer text | `src/content/site.ts` — typed constants, no props     | Editing a page's text should be a one-file change, not a hunt through components |
| Projects list, skills list, social links                                  | `src/content/projects.ts`, `skills.ts` — typed arrays | Uniform, repeating data; adding a project = adding one object, no new component  |
| `ProjectCard`                                                             | takes `project: Project` prop                         | One component, rendered N times — the canonical props case                       |
| `SkillGroup`                                                              | takes `group: SkillGroup` prop                        | Same                                                                             |
| `SectionHeading`, `TechTag`, `Icon`                                       | take small props (`title`, `icon`, `label`)           | Genuinely reusable, and passing data as props beats hardcoding                   |
| Nav, Hero, About, Contact, Footer                                         | no props                                              | Each appears once; props would only add ceremony                                 |

**The rule to remember:** if a value appears once on the page, it lives in
`site.ts`. If it appears N times, it's an array plus a prop. This keeps
brief #8's "edit the text or add more things later" to a data edit.

---

## 4. File structure

Following brief #6 and #11 (separate CSS module per component) and
`GUIDELINES.md` #8 (split before files get big):

```
src/
  components/
    navigation/      Navigation.tsx      Navigation.module.css
    hero/            Hero.tsx            Hero.module.css
    typewriter/       Typewriter.tsx      Typewriter.module.css
    about/           About.tsx           About.module.css
    skills/          Skills.tsx          Skills.module.css
    project-card/    ProjectCard.tsx     ProjectCard.module.css
    contact/         Contact.tsx         Contact.module.css
    footer/          Footer.tsx          Footer.module.css
    scroll-to-top/   ScrollToTop.tsx     ScrollToTop.module.css
    section-heading/ SectionHeading.tsx  SectionHeading.module.css
    icons/           ArrowDown.tsx, ArrowUp.tsx, GitHub.tsx, Mail.tsx, ExternalLink.tsx
  content/
    site.ts          name, nav, about, contact, footer copy
    projects.ts      Project[]
    skills.ts        SkillGroup[]
  hooks/
    use-reveal.ts    IntersectionObserver reveal
    use-scroll-to-top.ts
    use-theme.ts
  lib/
    contrast.ts      contrastRatio() — pure
    mailto.ts        buildMailtoLink() — pure
    scroll.ts        scrollToSection() — pure-ish
  tests/
    setup.js         already exists — jest-dom matchers + RTL cleanup
    contrast.test.ts
    mailto.test.ts
    *.test.tsx       component tests, colocated with their subject
  index.css          THE global stylesheet: tokens, reset, base element styles
  types.ts           Project, SkillGroup, SiteConfig interfaces
  App.tsx            composes the sections
  main.tsx           entry (unchanged)
```

**There is no `src/styles/` directory and no `global.css`.** All global styles
live in `src/index.css` — the file that already exists and is already
imported by `main.tsx`. Per your instruction, global styles go there rather
than in a new file. That file holds, in order:

1. The design tokens (the block in `DESIGN.md` §9) — light, dark, and the
   `data-theme` overrides
2. The reset
3. Base element styles (`body`, headings, links, focus rings)
4. `color-scheme`, `scroll-behavior`, and the `prefers-reduced-motion` block

It is the single global stylesheet for the project, and the only file a CSS
change should touch outside a `*.module.css`.

**Test folder:** `src/tests/` — the folder you already created for `setup.js`.
Vitest's `include` default (`**/*.{test,spec}.?(c|m)[jt]s?(x)`) covers it, so
no config change is needed to pick up `src/tests/contrast.test.ts`.

Two folders rather than a flat `components/` — the project is small, but
`GUIDELINES.md` #8 says split before files get big, and each component owns a
`tsx` + a `module.css`. Grouping by section keeps related files together
without inventing a `hooks/`/`lib/` split for two functions.

**CSS Modules:** `.module.css` is the Vite convention and works with zero
configuration. Each component's styles are scoped automatically — no global
class-name collisions, and no need for BEM discipline in a project this size.

---

## 5. Phases

Per `GUIDELINES.md` #4, this is split into independently checkable phases. Each
phase ends in something you can look at and say "yes, that's right" before the
next begins. **I'll confirm the phase breakdown with you before starting
Phase 0.**

### Phase 0 — Foundations

No visual output; everything below depends on it.

- `tsconfig.app.json`: add `"strict": true` (and `"noUncheckedIndexedAccess"`)
- `src/index.css` — the single global stylesheet, written in this order:
  1. The design tokens, transcribed verbatim from `DESIGN.md` §9 (light, dark,
     and the `data-theme` overrides for the manual toggle)
  2. The reset
  3. Base element styles — `body`, headings, links, focus rings
  4. `color-scheme`, `scroll-behavior`, and the `prefers-reduced-motion` block

  `DESIGN.md` is the source of truth for every token value: the palette, type
  scale, spacing, radii, and motion tokens are all decided and
  contrast-verified. Read it before touching this file.
- `src/types.ts` + `src/content/*.ts` — the full data model, empty-ish
- `src/lib/contrast.ts` + `src/tests/contrast.test.ts` — the colour check
  harness, ready before any colour is applied

**Already done, not repeated here:** the `test` script, the `test` block in
`vite.config.ts` (`globals: true`, `environment: "jsdom"`,
`setupFiles: "./src/tests/setup.js"`), and `src/tests/setup.js` with the
jest-dom matchers and RTL cleanup. I verified `npm run build` and
`npm run lint` both pass with that setup.

**Exit criteria:** `npm run lint` and `npm run build` pass; `npm test` runs
the contrast tests; the contrast test fails if any token pair is below its
WCAG target (so it genuinely gates colour choices).

### Phase 1 — Page shell & navigation

- `index.css`: skip link, `scroll-margin-top` on `section[id]`
- `Navigation.tsx` — `<header>` + `<nav>` + `<ul>` of anchors; `aria-current`
  on the active link; sticky with a backdrop blur
- `Footer.tsx` — `<footer>`, copyright, "back to top" anchor
- `App.tsx` — semantic skeleton: `<header>`, `<main>`, `<footer>`, `<section>`
  per area with `id` + `aria-labelledby`
- Optionally: scroll-spy highlight (2.2's noted tradeoff)

**Exit criteria:** anchor links scroll to each section and the sticky header
doesn't cover the heading; tab order is sensible; the page is navigable with
the mouse alone.

### Phase 2 — Hero + typewriter

- `Typewriter.tsx` — the `steps()` typewriter, step count computed from the
  string; `aria-live="off"` on the animated text and a visually-hidden full
  copy for screen readers (otherwise SRs read it character by character)
- `Hero.tsx` — name, role, typewriter line, and the arrow link
  `<a href="#projects">` that navigates to Projects
- The arrow animates (a gentle bob) and is reduced-motion-safe

**Exit criteria:** the arrow click lands on `#projects`; the typewriter
completes; with reduced motion on, the full text shows immediately.

### Phase 3 — About & Skills

- `About.tsx` — a few sentences from `site.ts`, placeholder image with
  explicit width/height (no layout shift) and `alt` text
- `Skills.tsx` + `SkillGroup.tsx` — frontend / backend / miscellaneous
  groups from `skills.ts`
- `SectionHeading.tsx` — shared heading, used by every section

**Exit criteria:** text lives only in `site.ts`/`skills.ts`; the layout holds
at 320px, 768px, and 1440px.

### Phase 4 — Projects

- `ProjectCard.tsx` — placeholder image, project name, tech tags, what it's
  for, links to repo and live preview
- External links get `rel="noreferrer"` and a "opens in a new tab" indicator
  with a visually-hidden phrase (not icon-only)
- `projects.ts` — the data

**Exit criteria:** adding a project is a single object in `projects.ts`.

### Phase 5 — Contact & scroll-to-top

- `Contact.tsx` — GitHub icon link, and the form: `<label>` for every field,
  native validation, `buildMailtoLink()` on submit
- `ScrollToTop.tsx` — the small circle on the right edge; appears only after
  scrolling past a threshold, scrolls to top on click
  - Mechanism: an `IntersectionObserver` on a sentinel element placed below
    the hero. When the sentinel leaves the viewport the button appears. This
    gives a real threshold with **no scroll event listener** — cheaper and
    smoother than `position: fixed` + `scrollY` checks
- `use-theme.ts` + theme toggle in the header

**Exit criteria:** the button is absent at the top of the page, appears after
scrolling, and returns to the top on click; the form blocks submission on
invalid input and opens a pre-filled `mailto:` on valid input.

### Phase 6 — Motion, theming, performance

- `use-reveal.ts` — one hook, applied per section, each with its _own_
  animation (brief #12: every section animates differently, none heavy)
  - Deliberately small: opacity + a short `translateY`, 300–500ms,
    `transform`/`opacity` only so they stay on the compositor
- Verify both themes: every section legible in light and dark
- `content-visibility: auto` + `contain-intrinsic-size: auto <size>` on
  sections — MDN calls it **Baseline 2024 (newly available, Sept 2024)**.
  Note it exceeds Vite's default `build.target` (Safari 16.4 / Firefox 114),
  so it must be a _progressive enhancement_: unsupported browsers ignore the
  property and render normally
- `prefers-reduced-motion` audit: every animation has a non-motion or
  no-motion fallback
- `will-change` applied only to elements actively animating, never globally
  (permanent `will-change` costs memory)

**Exit criteria:** scrolling the full page stays smooth; with reduced motion
enabled, no animation runs except the typewriter's final state.

### Phase 7 — Test coverage sweep

The DOM environment is now installed and configured, so **tests are written
alongside each component as it is built** (Phase 1 onward) rather than
collected at the end. This phase is the final sweep: fill the gaps, and add
the tests for the interactive pieces that were stubbed earlier.

**Already covered during the build phases:**

| Test | Where | Covers |
|---|---|---|
| `contrast.test.ts` | Phase 0 | Every token pair in both themes meets WCAG |
| `mailto.test.ts` | Phase 5 | Subject/body encoding, empty fields, special characters, newlines |
| `Navigation.test.tsx` | Phase 1 | Nav anchors point at real `id`s; active link gets `aria-current` |
| `Typewriter.test.tsx` | Phase 2 | Full text is exposed to assistive tech, not typed char-by-char |
| `Contact.test.tsx` | Phase 5 | Validation blocks empty/invalid input; valid input builds the `mailto:` |
| `ScrollToTop.test.tsx` | Phase 5 | Visibility toggles; click scrolls to top |

**This phase adds:**

- `App.test.tsx` — the rendered page has one `<h1>`, every `<section>` has an
  `id` and an `<h2>`, heading levels never skip
- `use-reveal.test.ts` — the reveal hook adds and removes its class
  correctly, and cleans up its observer
- `use-theme.test.ts` — the toggle sets `data-theme`, persists to
  `localStorage`, and falls back to the OS preference when unset

Per brief #11, each covers happy path, errors, and edge cases.

**Exit criteria:** `npm test` passes with no skipped tests; the contrast test
is a real gate on colour changes.

---

## 6. Accessibility & semantics checklist (brief #10)

- Landmarks: `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`
- One `<h1>` (your name) in the hero; every section has an `<h2>`
- Heading order never skips a level
- A skip link as the first focusable element
- All images have `alt` (decorative ones get `alt=""`)
- Icons that carry meaning get a visually-hidden text label
- Visible `:focus-visible` styles on every interactive element
- Form inputs each have a real `<label>`
- Colour is never the only signal

---

## 7. Out of scope unless you ask

- CMS / blog / markdown content
- Analytics, cookie banner
- i18n
- Deploy pipeline
- Real project images (placeholders per the brief)
- Real backend for the contact form (you chose `mailto:`)

---

## 8. What I need from you

1. **Confirm the phase order** — I'll start at Phase 0 once you agree.
2. **Optional scroll-spy** — do you want the nav to highlight the section
   you're currently in? (`DESIGN.md` §5.3 assumes yes; say the word and I'll
   drop it.)
3. **Theme toggle** — I planned a light/dark toggle that overrides the OS
   setting. Keep it, or rely on `prefers-color-scheme` alone?

**No longer needed from you:** the test packages. `jsdom`,
`@testing-library/react`, `@testing-library/jest-dom`, and
`@testing-library/user-event` are installed, `vite.config.ts` has the `test`
block, and `src/tests/setup.js` registers the jest-dom matchers and the RTL
cleanup. I verified `npm run build` and `npm run lint` pass with that setup.

---

## 9. Source list

All technical claims in this plan are from official documentation, checked
during planning:

- [MDN — animation-timeline](https://developer.mozilla.org/en-US/docs/Web/CSS/animation-timeline) — not Baseline; Chrome/Edge only
- [MDN — Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) — Baseline since March 2019
- [MDN — prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion) — Baseline since January 2020
- [MDN — prefers-color-scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme) — Baseline since January 2020
- [MDN — scroll-margin-top](https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-margin-top) — `scroll-behavior: smooth` Baseline
- [MDN — animation-timing-function (steps)](https://developer.mozilla.org/en-US/docs/Web/CSS/animation-timing-function) — `steps()` typewriter pattern
- [MDN — content-visibility](https://developer.mozilla.org/en-US/docs/Web/CSS/content-visibility) — Baseline 2024, newly available
- [Vite — build.target](https://vite.dev/config/build-options.html) — default `baseline-widely-available`
- [Vite — Features (CSS Modules)](https://vite.dev/guide/features.html) — `.module.css` works natively
- [Vitest — Environments](https://vitest.dev/guide/environment.html) — `jsdom` / `happy-dom` for component tests
