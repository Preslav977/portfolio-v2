/**
 * WCAG 2.x contrast arithmetic.
 *
 * Pure functions with no DOM dependency, so the palette can be checked
 * without a browser (PLAN.md §2.5). The formula is the one specified by
 * WCAG 2.1:
 *
 *   ratio = (L1 + 0.05) / (L2 + 0.05)
 *
 * where L is the relative luminance of each colour.
 *
 * Sources:
 * - https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html
 * - https://www.w3.org/TR/WCAG21/#dfn-relative-luminance
 */

/** A 6-digit hex colour, e.g. `#1a1a19`. */
export type HexColor = string;

const HEX_PATTERN = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i;

/**
 * Expand a hex colour to its 0–255 channel values.
 *
 * Accepts the 3-digit shorthand (`#fff`) as well as the 6-digit form.
 * Throws on anything else — a malformed colour is a bug worth failing on,
 * not something to silently treat as black.
 */
export function hexToRgb(hex: HexColor): { r: number; g: number; b: number } {
  const match = HEX_PATTERN.exec(hex.trim());

  if (!match) {
    throw new Error(`Invalid hex colour: "${hex}"`);
  }

  const digits = match[1].toLowerCase();
  const full =
    digits.length === 3
      ? digits
          .split("")
          .map((char) => char + char)
          .join("")
      : digits;

  return {
    r: parseInt(full.slice(0, 2), 16),
    g: parseInt(full.slice(2, 4), 16),
    b: parseInt(full.slice(4, 6), 16),
  };
}

/** Linearise one sRGB channel, per the WCAG definition. */
function lineariseChannel(channel: number): number {
  const ratio = channel / 255;

  return ratio <= 0.03928
    ? ratio / 12.92
    : Math.pow((ratio + 0.055) / 1.055, 2.4);
}

/** Relative luminance of a colour, from 0 (black) to 1 (white). */
export function relativeLuminance(hex: HexColor): number {
  const { r, g, b } = hexToRgb(hex);

  return (
    0.2126 * lineariseChannel(r) +
    0.7152 * lineariseChannel(g) +
    0.0722 * lineariseChannel(b)
  );
}

/**
 * Contrast ratio between two colours, from 1 (identical) to 21 (black on
 * white). The result is order-independent.
 */
export function contrastRatio(a: HexColor, b: HexColor): number {
  const luminanceA = relativeLuminance(a);
  const luminanceB = relativeLuminance(b);

  const lighter = Math.max(luminanceA, luminanceB);
  const darker = Math.min(luminanceA, luminanceB);

  return (lighter + 0.05) / (darker + 0.05);
}

/** Minimum contrast required for body text (WCAG 2.1, 1.4.3). */
export const AA_TEXT = 4.5;

/** Minimum contrast required for large text (WCAG 2.1, 1.4.3). */
export const AA_LARGE_TEXT = 3;

/** Minimum contrast required for UI components and focus indicators (WCAG 2.1, 1.4.11). */
export const AA_NON_TEXT = 3;
