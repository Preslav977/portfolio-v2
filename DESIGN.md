# Design System — portfolio-v2

**This file is the source of truth for all visual decisions.** Read it before
touching any CSS (rule #11 in `GUIDELINES.md`). If a value here and a value in
the CSS disagree, the CSS is wrong — fix the CSS, or change this file first.

Companion docs: `PLAN.md` (implementation plan) · `GUIDELINES.md` (how to work)

---

## 1. The design idea

**A developer's portfolio, drawn the way a developer thinks about systems.**

Not "dark mode with purple gradients" — that's the template every generator
produces. The concept here is **an instrument panel**: a calm, precise, technical
surface where the content is the signal and the chrome is deliberately quiet.

Three ideas drive every decision below:

### 1.1 Syntax as the visual language

Colours are named after the parts of a programming language, not after
adjectives. `--syntax-keyword`, `--syntax-string`, `--syntax-comment`,
`--syntax-fn`, `--syntax-type`, `--syntax-constant`. This is the single most
important thing keeping the design from looking generated: the palette has a
_reason_ that exists outside of aesthetics.

It also means the colour roles are self-documenting. When you need a new
element, you don't ask "what colour should this be?" — you ask "what does this
element _mean_?" and pick the token for that meaning. That's a rule, not a
palette, and rules are what keep a design coherent as it grows.

### 1.2 Editorial, not dashboard

Developers' portfolios usually fail into one of two extremes: a corporate
résumé rendered as a LinkedIn card, or a "dashboard" of stat tiles. This is
neither. It reads like **a well-typeset technical document** — a paper or a
manual — that happens to be interactive.

Concretely: generous measure, a strong type hierarchy, real whitespace, and
rules and hairlines instead of boxes-and-shadows. Chrome stays at the edges;
the centre stays empty enough to read.

### 1.3 The layout is a system, not a set of sections

One centred column is the spine. Everything hangs off it, and every repeated
element is the _same_ element at a different scale — the section header, the
row, the chip, the hairline. Brief #3 asks to reuse styles wherever possible;
the rule here is:

> **A new visual element is either a scale of an existing one, or it doesn't
> belong.**

That single rule is what keeps a portfolio from looking like a pile of
different components.

### 1.4 Explicitly not doing

Naming these because the default is the enemy of a distinctive result:

| Not doing                                         | Because                                     |
| ------------------------------------------------- | ------------------------------------------- |
| Purple/indigo→pink gradients                      | The universal AI-portfolio signature        |
| Glassmorphism (heavy `backdrop-filter`)           | Costly, and reads as template               |
| Neon glow shadows                                 | Cheap-looking; fights the "instrument" idea |
| Rounded-everything (`border-radius: 999px` pills) | Suggestive, not technical                   |
| Hero with a centred name + 3 pill buttons         | The stock portfolio opener                  |
| Animated gradient blobs / particles               | Distracts from content; hurts perf          |
| Big display font for everything                   | Hurts readability at length                 |
| Icon-only buttons                                 | Unlabelled for screen readers               |
| Fake "terminal" with `>` prompts everywhere       | Costume, not design                         |

**On the "terminal" question specifically:** a portfolio styled as a terminal
is the _other_ obvious thing. A real developer recognises a real terminal — no
rounded corners on a `bash` prompt, no fake cursor blinking in a text box. So
the terminal reference is present but _restrained_: monospace is used for code
identifiers, file paths, and metadata — the places where a monospace font is
genuinely correct — not as a costume for all copy.

---

## 2. Colour

### 2.1 How the palette works

Two themes, both defined in `src/index.css` — the project's single global
stylesheet.

- **Light** is the default. Warm off-white, near-black warm ink.
- **Dark** is a cool near-black with slightly warm off-white text.

Both are _warm-neutral_ rather than pure grey. Pure `#000`/`#fff` on screen is
harsh; a hint of warmth in the neutrals makes long text easier on the eyes
(brief #2, and brief #10's "easy on the eyes").

The accent hues are chosen to sit **apart** from each other on the wheel so
they never read as one blurry brand colour:

| Role                     | Light     | Dark      | Hue         |
| ------------------------ | --------- | --------- | ----------- |
| keyword (primary accent) | `#8a5a00` | `#e0a83a` | amber/ochre |
| fn (secondary accent)    | `#0a6a72` | `#3fbcc4` | teal        |
| type (tertiary accent)   | `#5b3fa8` | `#a78bfa` | violet      |
| string                   | `#2f6a2f` | `#7ec87e` | green       |
| danger                   | `#a02020` | `#e06c75` | red         |

The amber is deliberately the primary: it's the one colour that reads as
"attention without urgency", and it's the colour of a keyword in most
syntax themes — the thing your eye lands on first when reading code.

### 2.2 Token reference

Complete list. **Only these names may appear in component CSS.**

#### Surfaces

| Token         | Light     | Dark      | Use                                               |
| ------------- | --------- | --------- | ------------------------------------------------- |
| `--bg`        | `#faf9f6` | `#0a0b0d` | Page background                                   |
| `--surface`   | `#ffffff` | `#111317` | Cards, panels, the centred column                 |
| `--surface-2` | `#f1efea` | `#171a1f` | Inset: gutters, chips, code blocks, table stripes |

#### Text

| Token          | Light     | Dark      | Use                                     |
| -------------- | --------- | --------- | --------------------------------------- |
| `--text`       | `#1a1a19` | `#e8e6e1` | Body copy, headings                     |
| `--text-muted` | `#55534e` | `#9a978f` | Secondary copy, captions, metadata      |
| `--text-dim`   | `#6b6963` | `#85827b` | Tertiary: timestamps, decorative labels |

#### Lines

| Token             | Light     | Dark      | Use                                      |
| ----------------- | --------- | --------- | ---------------------------------------- |
| `--border`        | `#e2dfd8` | `#24272d` | Hairlines, table rules, card outlines    |
| `--border-strong` | `#8a8781` | `#666b74` | Focus rings, active rules, input borders |

#### Syntax accents

| Token              | Light     | Dark      | Use                                              |
| ------------------ | --------- | --------- | ------------------------------------------------ |
| `--syntax-keyword` | `#8a5a00` | `#e0a83a` | Primary accent: links, active nav, key emphasis  |
| `--syntax-fn`      | `#0a6a72` | `#3fbcc4` | Secondary accent: tags, project links, hover     |
| `--syntax-type`    | `#5b3fa8` | `#a78bfa` | Tertiary accent: skill categories, rare emphasis |
| `--syntax-string`  | `#2f6a2f` | `#7ec87e` | Quoted text, file paths, success states          |
| `--syntax-comment` | `#6b6963` | `#85827b` | Comments, decorative monospace labels            |
| `--danger`         | `#a02020` | `#e06c75` | Error text, form validation messages             |

#### Utility

| Token         | Value   | Use                                    |
| ------------- | ------- | -------------------------------------- |
| `--radius`    | `2px`   | Everything. Deliberately almost-square |
| `--radius-lg` | `4px`   | Panels only                            |
| `--measure`   | `68ch`  | Max line length for prose              |
| `--container` | `68rem` | Centred column max-width               |

### 2.3 Measured contrast — every pair, verified

The plan promised a contrast gate (`src/lib/contrast.ts` + Vitest). These are
the **measured** WCAG 2.x ratios for the palette above, computed from the
WCAG relative-luminance formula. All 46 pairs pass.

**Light theme**

| Pair                                  | Ratio | Required |     |
| ------------------------------------- | ----- | -------- | --- |
| `--text` on `--bg`                    | 16.54 | 4.5      | ✅  |
| `--text` on `--surface`               | 16.47 | 4.5      | ✅  |
| `--text` on `--surface-2`             | 15.16 | 4.5      | ✅  |
| `--text-muted` on `--bg`              | 7.30  | 4.5      | ✅  |
| `--text-muted` on `--surface`         | 7.68  | 4.5      | ✅  |
| `--text-muted` on `--surface-2`       | 6.69  | 4.5      | ✅  |
| `--text-dim` on `--bg`                | 5.21  | 4.5      | ✅  |
| `--text-dim` on `--surface`           | 5.49  | 4.5      | ✅  |
| `--text-dim` on `--surface-2`         | 4.78  | 4.5      | ✅  |
| `--syntax-keyword` on `--bg`          | 5.63  | 4.5      | ✅  |
| `--syntax-keyword` on `--surface`     | 5.93  | 4.5      | ✅  |
| `--syntax-keyword` on `--surface-2`   | 5.16  | 4.5      | ✅  |
| `--syntax-fn` on `--surface`          | 6.33  | 4.5      | ✅  |
| `--syntax-fn` on `--surface-2`        | 5.51  | 4.5      | ✅  |
| `--syntax-type` on `--surface`        | 7.72  | 4.5      | ✅  |
| `--syntax-string` on `--surface-2`    | 5.67  | 4.5      | ✅  |
| `--syntax-comment` on `--surface`     | 5.49  | 4.5      | ✅  |
| `--danger` on `--surface`             | 7.71  | 4.5      | ✅  |
| `--border-strong` on `--bg`           | 3.40  | 3.0      | ✅  |
| `--border-strong` on `--surface`      | 3.58  | 3.0      | ✅  |
| `--border-strong` on `--surface-2`    | 3.12  | 3.0      | ✅  |
| `--bg` on `--syntax-keyword` (button) | 5.63  | 4.5      | ✅  |
| `--bg` on `--syntax-fn` (button)      | 6.01  | 4.5      | ✅  |

**Dark theme**

| Pair                                  | Ratio | Required |     |
| ------------------------------------- | ----- | -------- | --- |
| `--text` on `--bg`                    | 15.79 | 4.5      | ✅  |
| `--text` on `--surface`               | 15.34 | 4.5      | ✅  |
| `--text` on `--surface-2`             | 13.98 | 4.5      | ✅  |
| `--text-muted` on `--bg`              | 6.75  | 4.5      | ✅  |
| `--text-muted` on `--surface`         | 6.37  | 4.5      | ✅  |
| `--text-muted` on `--surface-2`       | 5.98  | 4.5      | ✅  |
| `--text-dim` on `--bg`                | 5.13  | 4.5      | ✅  |
| `--text-dim` on `--surface`           | 4.85  | 4.5      | ✅  |
| `--text-dim` on `--surface-2`         | 4.55  | 4.5      | ✅  |
| `--syntax-keyword` on `--bg`          | 9.22  | 4.5      | ✅  |
| `--syntax-keyword` on `--surface`     | 8.71  | 4.5      | ✅  |
| `--syntax-keyword` on `--surface-2`   | 8.17  | 4.5      | ✅  |
| `--syntax-fn` on `--surface`          | 8.15  | 4.5      | ✅  |
| `--syntax-fn` on `--surface-2`        | 7.64  | 4.5      | ✅  |
| `--syntax-type` on `--surface`        | 6.83  | 4.5      | ✅  |
| `--syntax-string` on `--surface-2`    | 8.68  | 4.5      | ✅  |
| `--syntax-comment` on `--surface`     | 4.85  | 4.5      | ✅  |
| `--danger` on `--surface`             | 5.82  | 4.5      | ✅  |
| `--border-strong` on `--bg`           | 3.68  | 3.0      | ✅  |
| `--border-strong` on `--surface`      | 3.47  | 3.0      | ✅  |
| `--border-strong` on `--surface-2`    | 3.26  | 3.0      | ✅  |
| `--bg` on `--syntax-keyword` (button) | 9.22  | 4.5      | ✅  |
| `--bg` on `--syntax-fn` (button)      | 8.63  | 4.5      | ✅  |

**Rules that follow from the numbers:**

- `--text-dim` is the _lowest_ text token and it still clears 4.5:1 on every
  surface. There is no "decorative" grey that fails contrast.
- `--border` (1.24–1.33) is **non-text** only — hairlines, table rules, card
  outlines. It must never carry meaning on its own.
- `--border-strong` (3.12–3.68) is the only border permitted for focus rings,
  active indicators, and input outlines, because those need 3:1 as UI
  components.
- Buttons use `--bg` on a filled accent, so they inherit the accent's
  4.5–9.2 ratio automatically.
- Any new colour must be added to `contrast.test.ts` with its measured ratio
  before it is used. **The test is the gate, not a review step.**

### 2.4 Theme switching

- `prefers-color-scheme` provides the default. `prefers-color-scheme` is
  **Baseline since January 2020** (MDN), so an OS-level dark preference is
  honoured with zero JavaScript.
- A manual toggle sets `data-theme="light|dark"` on `<html>`, persisted in
  `localStorage`, and overrides the media query.
- Both themes are **first-class**. Every colour is defined twice; there is no
  "dark is just light inverted". A design that only works in one theme is a
  design that only works once.
- `color-scheme: light dark` is set on `:root` so native UI (scrollbars,
  form controls) matches the theme.

**Source:** [MDN — prefers-color-scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme)

---

## 3. Typography

### 3.1 Scale

One scale, used everywhere. Sizes are `clamp()`-based so they fluidly
respond between 360px and 1280px without media-query jumps.

| Token         | Value      | Use                           |
| ------------- | ---------- | ----------------------------- |
| `--text-xs`   | `0.75rem`  | Labels, tags, metadata        |
| `--text-sm`   | `0.875rem` | Secondary text, captions, nav |
| `--text-base` | `1rem`     | Body                          |
| `--text-lg`   | `1.125rem` | Lead paragraph                |
| `--text-xl`   | `1.375rem` | H3, card titles               |
| `--text-2xl`  | `1.75rem`  | H2, section titles            |
| `--text-3xl`  | `2.5rem`   | H1, hero name                 |
| `--text-4xl`  | `3.5rem`   | Hero display, once per page   |

### 3.2 Families

- **Body/UI:** a system sans stack. Zero webfont bytes, zero FOUT, instant
  paint.
- **Mono:** `ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas,
monospace` — used _only_ where monospace is semantically right: code
  identifiers, file paths, tech names, section eyebrows, the typewriter.

**Why no webfont:** a portfolio that loads a 120KB variable font to say
"Hello, I'm a developer" is spending its performance budget on nothing. A
system stack looks native on every OS and costs nothing. If a distinctive
face later proves worth it, self-host one subset — never a third-party CDN.

### 3.3 Rules

- **Measure:** prose is capped at `--measure` (68ch). Line length is the
  single biggest readability factor; nothing in the layout should exceed it.
- **Weight:** three only — `400` body, `500` emphasis, `600` headings.
  Nothing at 700+.
- **Line height:** `1.6` body, `1.15` headings, `1.4` tight UI.
- **Letter spacing:** `-0.02em` on `--text-3xl`/`--text-4xl` (large text
  needs negative tracking or it looks loose), `0` elsewhere, `0.04em` on
  uppercase eyebrows.
- **Case:** sentence case for headings. Uppercase _only_ for small
  monospace eyebrows like `01 / ABOUT`.

### 3.4 The hero name

Rendered at `--text-4xl`, weight `600`, `--text`, with tight tracking. Not
gradient-filled, not animated per-character. The typewriter carries the
motion; the name should be stable and legible.

---

## 4. Layout

### 4.1 The centred spine

Brief #3 asks for centring, with flex and grid where each fits.

**The page has one centred column. Everything else hangs off it.**

```
┌──────────────────────────────────────────┐
│  header (sticky, full-bleed, hairline)   │
├──────────────────────────────────────────┤
│                                          │
│         ┌────────────────────┐           │
│         │  centred column    │           │
│         │  max 68rem         │           │
│         │  padding-inline    │           │
│         └────────────────────┘           │
│                                          │
├──────────────────────────────────────────┤
│  footer (hairline top, full-bleed)       │
└──────────────────────────────────────────┘
```

The column is centred with `margin-inline: auto` and a fluid max-width:
`width: min(100% - 2 * var(--gutter), var(--container))`.

### 4.2 Flex vs grid — the rule

> **Grid for two-dimensional layout (page regions, card grids, alignment of
> siblings across rows). Flex for one-dimensional arrangement (a row of
> things, a stack of things).**

Applied concretely:

| Context                                    | Display         | Why                                                                                                         |
| ------------------------------------------ | --------------- | ----------------------------------------------------------------------------------------------------------- |
| Page shell (header/main/footer)            | `grid`          | Rows stack, but the column must be centred _across_ them — grid's `justify-items` handles that in one place |
| Centred column                             | `grid`          | `justify-content: center` + `minmax(0, 1fr)`                                                                |
| Section internal layout                    | `grid`          | Sections align their sub-parts to a shared baseline grid                                                    |
| Project card grid                          | `grid`          | Genuinely 2D; `repeat(auto-fit, minmax(...))`                                                               |
| Nav link list                              | `flex`          | One row of items                                                                                            |
| Hero stack (eyebrow → name → line → arrow) | `flex`          | One column of items                                                                                         |
| Tech tag list                              | `flex` + `wrap` | One row that wraps                                                                                          |
| About section (text + image)               | `grid`          | Two columns, side by side                                                                                   |
| Footer row                                 | `flex`          | One row, space-between                                                                                      |
| Contact form                               | `grid`          | Label + field pairs align in two columns                                                                    |

**The most common mistake** — using flexbox to centre a column and then
discovering that a child's width doesn't respect the container. The fix is
`minmax(0, 1fr)` on grid tracks and `min-width: 0` on flex children, so
overflow is clipped rather than pushed.

### 4.3 Breakpoints

Three, mobile-first. Minimal by intent — every breakpoint is a decision
someone has to maintain.

| Name      | Min width        | What changes                               |
| --------- | ---------------- | ------------------------------------------ |
| `--bp-sm` | `40rem` (640px)  | 2-up project grid, About goes side-by-side |
| `--bp-md` | `64rem` (1024px) | Hero display size, project grid 3-up       |
| `--bp-lg` | `80rem` (1280px) | Column reaches max width                   |

Below 640px everything is a single column. No horizontal scroll, ever.

### 4.4 Spacing

A 4px base, named by intent rather than number.

| Token        | Value     | Use                        |
| ------------ | --------- | -------------------------- |
| `--space-1`  | `0.25rem` | Chip padding               |
| `--space-2`  | `0.5rem`  | Tight gaps                 |
| `--space-3`  | `0.75rem` | Default gap                |
| `--space-4`  | `1rem`    | Standard padding           |
| `--space-6`  | `1.5rem`  | Between blocks             |
| `--space-8`  | `2rem`    | Card padding               |
| `--space-12` | `3rem`    | Between sections (mobile)  |
| `--space-16` | `4rem`    | Between sections (desktop) |

Section vertical rhythm: `padding-block: var(--space-12)`, stepping to
`--space-16` at `--bp-md`.

---

## 5. Components

Reuse is the rule (brief #3). These are the patterns; everything else is a
composition of them.

### 5.1 The hairline divider

One rule, `--border`, 1px. Separates sections and groups content. Not a
shadow, not a box. This is the single most reused element on the page.

### 5.2 Section header

The same structure at every level, scaled:

```
01 / ABOUT                    ← eyebrow: mono, --text-xs, --syntax-comment
A few words about me.         ← title: --text-2xl, 600, --text
Supporting sentence that      ← lede: --text-lg, --text-muted, max 60ch
frames the section.
```

The numbered eyebrow is a _system_ detail: every section is numbered, which
gives the page the feel of a document with a table of contents. It is also
`aria-hidden` — a screen reader shouldn't announce "slash zero one slash
about".

### 5.3 Nav

Sticky, full-bleed, hairline bottom. Name on the left at `--text-sm` weight
`600`; links on the right in `--text-sm`.

- Active link: `--syntax-keyword`, with a 2px `--syntax-keyword` underline.
  Active state is tracked by scroll-spy (`IntersectionObserver`) — see
  `PLAN.md` §2.3.
- Hover: `--text` from `--text-muted`. 150ms.
- Focus: 2px `--border-strong` outline, 2px offset.
- On mobile: links collapse to a disclosure button. The button carries
  `aria-expanded` and `aria-controls`.

### 5.4 Hero

Centred, generous vertical space, but **not** the stock centred-hero layout:

```
              [ eyebrow: mono, --syntax-comment ]
                        Your Name                     ← --text-4xl, 600
              I build things that work.              ← typewriter
                          ↓                          ← arrow, animated
```

- The typewriter is the only thing that moves on load.
- The arrow is an inline SVG chevron in `--syntax-keyword`, bobbing 4px on a
  2s ease-in-out loop. It is a real `<a href="#projects">`, so it is
  keyboard- and screen-reader-accessible, with a visually-hidden "Go to
  projects" label.
- **Not** centred pill buttons. The arrow is the single action.

### 5.5 About

Two columns at `--bp-sm`: text left (7fr), image right (5fr). Below that,
stacked with the image first.

- Image: `<img>` with explicit `width`/`height` (no layout shift) and
  `loading="lazy"`. Placeholder is a `--surface-2` block with a
  monospace filename label — it should look intentional while empty, so it
  reads as "awaiting asset" rather than "broken".
- The image is `border-radius: var(--radius)` and gets a hairline border.

### 5.6 Skills

Three groups — Frontend, Backend, Tools & Other — as a 3-column grid at
`--bp-md`, stacked below.

- Group label: mono eyebrow, `--syntax-type`.
- Each skill is a row: name in `--text`, and a right-aligned level indicator.
- The level indicator is **not** a percentage bar. A bar implies
  measurement that doesn't exist. Instead: a row of small squares, filled to
  represent proficiency — a scale, not a gauge. Filled squares use
  `--syntax-keyword`; empty use `--border`.

### 5.7 Project card

A `--surface` panel with `--border` outline, `--radius`, `--space-8` padding.

- Preview image on top, 16:10, `loading="lazy"`, explicit dimensions.
- Name: `--text-xl`, 600.
- Description: `--text-muted`, clamped to 3 lines.
- Tech tags: `--surface-2` chips, `--text-xs`, mono. `--radius`, not pills.
- Two links: **Repository** (`--syntax-fn`) and **Live preview**
  (`--syntax-keyword`), each with a small inline SVG and a visually-hidden
  "(opens in a new tab)".

**Screenshots must be cropped to their content before use.** A full-window
capture (1920px wide) of an app whose interface occupies a narrow centred
column leaves ~75% of the image empty. Scaled into a 340px card, the actual
interface lands at 50–90px wide and is unreadable — no aspect ratio or
container width fixes that, because the problem is the _source_ image, not
the layout.

Crop each screenshot to the part of the app worth showing, at 16:10, and
export it at roughly 2× its display size. The crop is what makes the card
legible; the container width is not the lever. The image itself links to the
live preview, so it is a way in rather than a dead end.

### 5.8 Contact

- GitHub link: inline SVG icon + visible text (never icon-only).
- Form: real `<form>`, native validation, `<label>` for every field, inputs
  styled with `--surface` background, `--border-strong` border, `--radius`.
- Focus: border goes `--syntax-keyword`, plus a 2px outline.
- Error text: `--danger`, `--text-sm`, tied to the input with
  `aria-describedby` and `aria-invalid`.
- Submit button: `--syntax-keyword` background, `--bg` text.

### 5.9 Footer

Hairline top border. One row: copyright on the left, "back to top" on the
right. At `--text-sm`, `--text-muted`.

### 5.10 Scroll-to-top button

Brief #13: a small circle, right side, appearing only after scrolling past a
threshold.

- `position: fixed`, right gutter, vertically centred-low (not bottom-right
  corner — that collides with chat widgets and reads as generic).
- 40px circle, `--surface` background, `--border-strong` border,
  `--text` chevron. `--radius: 50%` — the one exception to the
  almost-everything-else rule, because a circle was specified.
- Appears via `IntersectionObserver` on a sentinel below the hero; hidden
  otherwise. No scroll listener.
- `aria-label="Back to top"`.

---

## 6. Motion

Brief #12: every section animates, but nothing heavy.

### 6.1 Principles

- **Transform and opacity only.** Both are compositor properties; animating
  `width`, `height`, `top`, or `box-shadow` forces layout or paint on every
  frame and is what makes a page feel sluggish.
- **Short.** 400–600ms for reveals. Nothing over 700ms.
- **One movement per section.** Different sections move differently, but
  never two at once on the same element.
- **No infinite animation** except the hero arrow's bob.

### 6.2 Per-section motion

| Section       | Motion                                       |
| ------------- | -------------------------------------------- |
| Hero          | Typewriter reveal; arrow bobs 4px, 2s loop   |
| Nav           | Active underline slides 200ms                |
| About         | Text rises 12px + fades, image scales 0.98→1 |
| Skills        | Group rises 12px, staggered 60ms per group   |
| Projects      | Cards rise 16px, staggered 60ms per card     |
| Contact       | Fields fade in, staggered 50ms               |
| Footer        | No animation — it's the end of the page      |
| Scroll-to-top | Fades + slides 8px in, 150ms                 |

### 6.3 Reveal mechanism

`IntersectionObserver` (Baseline since March 2019) toggling a class;
CSS does the animation. `translateY` + `opacity`, `cubic-bezier(0.16, 1, 0.3, 1)`
(ease-out-expo-ish) for reveals — fast start, long settle, which reads as
responsive rather than slow.

`content-visibility: auto` with `contain-intrinsic-size: auto 500px` on
sections. MDN marks it **Baseline 2024 (newly available)** — newer than Vite
8's default `baseline-widely-available` target, so it must be a progressive
enhancement: browsers that don't support it ignore the property and render
normally.

### 6.4 Reduced motion — mandatory

`prefers-reduced-motion: reduce` (Baseline since January 2020):

- All reveals collapse to **no movement** — elements are simply visible.
- The typewriter shows its **final text immediately**.
- The arrow stops bobbing.
- The scroll-to-top button fades without sliding.
- `scroll-behavior` becomes `auto`.

The reveal must not leave content **invisible** when motion is reduced. The
base state is the visible state; the animation is an enhancement layered on
top. This is the failure mode to watch for.

**Sources:** [MDN — prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion) · [MDN — Intersection Observer](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) · [MDN — content-visibility](https://developer.mozilla.org/en-US/docs/Web/CSS/content-visibility)

---

## 7. Accessibility

Not a checklist at the end — these are design constraints.

- **Contrast:** verified above, enforced by test. 4.5:1 for text, 3:1 for UI
  components and focus indicators.
- **Focus is always visible:** 2px `--border-strong` outline, 2px offset,
  never `outline: none` without a replacement.
- **Colour is never the only signal.** The active nav link has an underline,
  not just a colour change. The skill indicator has shape (filled squares),
  not just colour. The error message has text, not just a red border.
- **Every icon has a text label** — either visible or visually-hidden.
- **Landmarks:** `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`.
- **One `<h1>`** (the name in the hero); every section has an `<h2>`.
- **Headings never skip a level.**
- **Skip link** is the first focusable element.
- **Touch targets** ≥ 44×44px on mobile (the scroll-to-top circle grows to
  44px there, even though it's 40px on desktop).
- **Zoom to 200%** must not break the layout — hence `rem`/`ch` sizing and
  no fixed pixel heights on text containers.

---

## 8. Performance

Brief #10: "focus on performance for the animations."

- **No webfonts** → no FOUT, no layout shift, no font request.
- **No animation libraries.** `IntersectionObserver` + CSS covers everything.
- **Transform/opacity only** → animations stay off the main thread.
- **`content-visibility: auto`** on sections → off-screen sections skip
  layout and paint.
- **`will-change` never set globally** — only on the element actively
  animating, and removed afterwards. A permanent `will-change` permanently
  costs memory.
- **`loading="lazy"`** on every below-the-fold image, with explicit
  `width`/`height` to prevent layout shift.
- **No background images**; all decoration is CSS.
- Target: LCP under 2.0s, CLS under 0.1, no long tasks over 50ms during
  scroll.

---

## 9. Tokens → CSS

The mechanical contract. The token block below goes at the top of
`src/index.css` — the project's single global stylesheet:

```css
:root {
  color-scheme: light;

  /* Surfaces */
  --bg: #faf9f6;
  --surface: #ffffff;
  --surface-2: #f1efea;

  /* Text */
  --text: #1a1a19;
  --text-muted: #55534e;
  --text-dim: #6b6963;

  /* Lines */
  --border: #e2dfd8;
  --border-strong: #8a8781;

  /* Syntax accents */
  --syntax-keyword: #8a5a00;
  --syntax-fn: #0a6a72;
  --syntax-type: #5b3fa8;
  --syntax-string: #2f6a2f;
  --syntax-comment: #6b6963;
  --danger: #a02020;

  /* Shape & measure */
  --radius: 2px;
  --radius-lg: 4px;
  --measure: 68ch;
  --container: 68rem;
  --gutter: 1.25rem;

  /* Type scale */
  --text-xs: 0.75rem;
  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-lg: 1.125rem;
  --text-xl: 1.375rem;
  --text-2xl: 1.75rem;
  --text-3xl: 2.5rem;
  --text-4xl: 3.5rem;

  /* Spacing */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-12: 3rem;
  --space-16: 4rem;

  /* Motion */
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --duration-fast: 150ms;
  --duration-base: 250ms;
  --duration-slow: 500ms;
}

@media (prefers-color-scheme: dark) {
  :root {
    color-scheme: dark;

    --bg: #0a0b0d;
    --surface: #111317;
    --surface-2: #171a1f;

    --text: #e8e6e1;
    --text-muted: #9a978f;
    --text-dim: #85827b;

    --border: #24272d;
    --border-strong: #666b74;

    --syntax-keyword: #e0a83a;
    --syntax-fn: #3fbcc4;
    --syntax-type: #a78bfa;
    --syntax-string: #7ec87e;
    --syntax-comment: #85827b;
    --danger: #e06c75;
  }
}
```

The manual toggle overrides by setting `data-theme` on `<html>`; the
implementation sets the same variables under `:root[data-theme="dark"]` and
`:root[data-theme="light"]` so the toggle wins over the media query.

**Type scale values** are the `clamp()`-fluid versions used in CSS:

```css
--text-3xl: clamp(1.75rem, 1.2rem + 2.2vw, 2.5rem);
--text-4xl: clamp(2.25rem, 1.4rem + 3.4vw, 3.5rem);
--text-2xl: clamp(1.5rem, 1.25rem + 1.1vw, 1.75rem);
```

---

## 10. Open items for you

1. **The name and role** — the hero eyebrow/name and the typewriter line are
   placeholders in `site.ts`. Replace them; the layout doesn't change.
2. **Real images** — the About photo and project previews are placeholders.
   The card aspect ratio (16:10) is fixed so the layout won't shift when
   you drop real images in.
3. **Skill levels** — the square indicators need a proficiency judgement
   from you. The design supports 1–5.
4. **A real type signature** — if you later want a distinctive font, the
   system stack stays as the fallback; the type scale and measure stay valid.

---

## 11. Source list

- [MDN — prefers-color-scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme) — Baseline since Jan 2020
- [MDN — prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion) — Baseline since Jan 2020
- [MDN — Intersection Observer](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) — Baseline since March 2019
- [MDN — content-visibility](https://developer.mozilla.org/en-US/docs/Web/CSS/content-visibility) — Baseline 2024, newly available
- [MDN — animation-timing-function (steps)](https://developer.mozilla.org/en-US/docs/Web/CSS/animation-timing-function) — `steps()` for the typewriter
- [MDN — scroll-margin-top](https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-margin-top) — sticky-header offset for anchors
- [Vite — build.target](https://vite.dev/config/build-options.html) — default `baseline-widely-available`
- [Vite — Features](https://vite.dev/guide/features.html) — CSS Modules, no configuration needed
- WCAG 2.x contrast ratios — computed with the WCAG relative-luminance
  formula and encoded in `src/test/contrast.test.ts`
