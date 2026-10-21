import { describe, expect, it } from "vitest";
import {
  AA_NON_TEXT,
  AA_TEXT,
  contrastRatio,
  hexToRgb,
  relativeLuminance,
} from "../lib/contrast";
// `?inline` returns the stylesheet as a string. Vitest stubs CSS imports by
// default, so `css: { include: [/\.css/] }` in vite.config.ts is what makes
// this work — see the comment there.
import stylesheet from "../index.css?inline";

/**
 * The colour gate (PLAN.md §2.5).
 *
 * These tests read the *real* `src/index.css` rather than a copy of the
 * palette, so the CSS is the single source of truth and cannot drift away
 * from what was verified. Change a token and this test is what tells you the
 * change broke something.
 */

type TokenMap = Record<string, string>;

/** Pull every `--name: value;` pair out of a block of CSS. */
function parseTokens(block: string): TokenMap {
  const tokens: TokenMap = {};
  const pattern = /--([a-z0-9-]+)\s*:\s*([^;]+);/gi;

  for (const match of block.matchAll(pattern)) {
    const name = match[1];
    const value = match[2];

    if (name !== undefined && value !== undefined) {
      tokens[name] = value.trim();
    }
  }

  return tokens;
}

/** The light palette: the first `:root { ... }` block in the file. */
function readLightTokens(): TokenMap {
  const block = stylesheet.match(/:root\s*\{([^{}]*)\}/);

  if (!block?.[1]) {
    throw new Error("No :root block found in src/index.css");
  }

  return parseTokens(block[1]);
}

/**
 * The dark palette: the `:root` block inside the `prefers-color-scheme:
 * dark` media query.
 */
function readDarkTokens(): TokenMap {
  const mediaIndex = stylesheet.indexOf(
    "@media (prefers-color-scheme: dark)",
  );

  if (mediaIndex === -1) {
    throw new Error(
      "No prefers-color-scheme: dark block found in src/index.css",
    );
  }

  const block = stylesheet
    .slice(mediaIndex)
    .match(/:root[^{]*\{([^{}]*)\}/);

  if (!block?.[1]) {
    throw new Error("No :root block inside the dark media query");
  }

  return parseTokens(block[1]);
}

const light = readLightTokens();
const dark = readDarkTokens();

/**
 * Read a token, failing loudly if it is missing.
 *
 * `noUncheckedIndexedAccess` makes every index lookup `string | undefined`;
 * this narrows it and turns a missing token into a clear error rather than a
 * confusing `NaN` ratio further down.
 */
function token(tokens: TokenMap, name: string): string {
  const value = tokens[name];

  if (value === undefined) {
    throw new Error(`Missing --${name} in src/index.css`);
  }

  return value;
}

/** Every text-on-surface pair the design relies on. */
const TEXT_PAIRS: Array<[string, string]> = [
  ["text", "bg"],
  ["text", "surface"],
  ["text", "surface-2"],
  ["text-muted", "bg"],
  ["text-muted", "surface"],
  ["text-muted", "surface-2"],
  ["text-dim", "bg"],
  ["text-dim", "surface"],
  ["text-dim", "surface-2"],
  ["syntax-keyword", "bg"],
  ["syntax-keyword", "surface"],
  ["syntax-keyword", "surface-2"],
  ["syntax-fn", "bg"],
  ["syntax-fn", "surface"],
  ["syntax-fn", "surface-2"],
  ["syntax-type", "bg"],
  ["syntax-type", "surface"],
  ["syntax-string", "surface"],
  ["syntax-string", "surface-2"],
  ["syntax-comment", "surface"],
  ["danger", "bg"],
  ["danger", "surface"],
];

/** Non-text pairs: borders and focus rings need 3:1. */
const NON_TEXT_PAIRS: Array<[string, string]> = [
  ["border-strong", "bg"],
  ["border-strong", "surface"],
  ["border-strong", "surface-2"],
];

/** Filled buttons put the page background on top of an accent. */
const INVERSE_PAIRS: Array<[string, string]> = [
  ["bg", "syntax-keyword"],
  ["bg", "syntax-fn"],
];

describe("hexToRgb", () => {
  it("parses a six-digit hex colour", () => {
    expect(hexToRgb("#1a1a19")).toEqual({ r: 26, g: 26, b: 25 });
  });

  it("parses a three-digit shorthand", () => {
    expect(hexToRgb("#fff")).toEqual({ r: 255, g: 255, b: 255 });
  });

  it("accepts a colour without the leading hash", () => {
    expect(hexToRgb("ffffff")).toEqual({ r: 255, g: 255, b: 255 });
  });

  it("is case-insensitive", () => {
    expect(hexToRgb("#AABBCC")).toEqual({ r: 170, g: 187, b: 204 });
  });

  it("throws on a malformed colour", () => {
    expect(() => hexToRgb("#12345")).toThrow(/Invalid hex colour/);
    expect(() => hexToRgb("not-a-colour")).toThrow(/Invalid hex colour/);
    expect(() => hexToRgb("#gg0000")).toThrow(/Invalid hex colour/);
  });
});

describe("relativeLuminance", () => {
  it("returns 0 for black", () => {
    expect(relativeLuminance("#000000")).toBe(0);
  });

  it("returns 1 for white", () => {
    expect(relativeLuminance("#ffffff")).toBeCloseTo(1, 5);
  });
});

describe("contrastRatio", () => {
  it("gives 21 for black on white", () => {
    expect(contrastRatio("#000000", "#ffffff")).toBeCloseTo(21, 5);
  });

  it("gives 1 for a colour against itself", () => {
    expect(contrastRatio("#1a1a19", "#1a1a19")).toBeCloseTo(1, 5);
  });

  it("is order-independent", () => {
    expect(contrastRatio("#1a1a19", "#ffffff")).toBeCloseTo(
      contrastRatio("#ffffff", "#1a1a19"),
      10,
    );
  });
});

describe.each([
  ["light", light],
  ["dark", dark],
])("the %s theme palette", (_name, tokens) => {
  it("defines every token the design relies on", () => {
    const required = [
      "bg",
      "surface",
      "surface-2",
      "text",
      "text-muted",
      "text-dim",
      "border",
      "border-strong",
      "syntax-keyword",
      "syntax-fn",
      "syntax-type",
      "syntax-string",
      "syntax-comment",
      "danger",
    ];

    for (const token of required) {
      expect(tokens[token], `missing --${token}`).toBeDefined();
    }
  });

  it.each(TEXT_PAIRS)(
    "keeps --%s on --%s at or above 4.5:1",
    (foreground, background) => {
      const ratio = contrastRatio(
        token(tokens, foreground),
        token(tokens, background),
      );

      expect(
        ratio,
        `--${foreground} on --${background} is ${ratio.toFixed(2)}:1`,
      ).toBeGreaterThanOrEqual(AA_TEXT);
    },
  );

  it.each(NON_TEXT_PAIRS)(
    "keeps --%s on --%s at or above 3:1",
    (foreground, background) => {
      const ratio = contrastRatio(
        token(tokens, foreground),
        token(tokens, background),
      );

      expect(
        ratio,
        `--${foreground} on --${background} is ${ratio.toFixed(2)}:1`,
      ).toBeGreaterThanOrEqual(AA_NON_TEXT);
    },
  );

  it.each(INVERSE_PAIRS)(
    "keeps --%s readable on the filled --%s button",
    (foreground, background) => {
      const ratio = contrastRatio(
        token(tokens, foreground),
        token(tokens, background),
      );

      expect(
        ratio,
        `--${foreground} on --${background} is ${ratio.toFixed(2)}:1`,
      ).toBeGreaterThanOrEqual(AA_TEXT);
    },
  );
});

describe("the two themes", () => {
  it("are genuinely different, not one inverted", () => {
    expect(token(light, "bg")).not.toBe(token(dark, "bg"));
    expect(token(light, "text")).not.toBe(token(dark, "text"));
  });

  it("give the light theme a light background and a dark foreground", () => {
    expect(relativeLuminance(token(light, "bg"))).toBeGreaterThan(
      relativeLuminance(token(light, "text")),
    );
  });

  it("give the dark theme a dark background and a light foreground", () => {
    expect(relativeLuminance(token(dark, "bg"))).toBeLessThan(
      relativeLuminance(token(dark, "text")),
    );
  });

  it("declare the same set of colour tokens", () => {
    const colourTokens = (tokens: TokenMap) =>
      Object.keys(tokens).filter(
        (key) =>
          key.startsWith("syntax-") ||
          key === "bg" ||
          key === "surface" ||
          key === "surface-2" ||
          key === "text" ||
          key === "text-muted" ||
          key === "text-dim" ||
          key === "border" ||
          key === "border-strong" ||
          key === "danger",
      );

    expect(colourTokens(dark).sort()).toEqual(colourTokens(light).sort());
  });
});
