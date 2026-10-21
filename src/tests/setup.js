import { expect, afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";
import * as matchers from "@testing-library/jest-dom/matchers";

expect.extend(matchers);

afterEach(() => {
  cleanup();
});

// jsdom does not implement matchMedia, which the theme hook relies on. This
// stub implements the parts we use and lets a test override the media query
// result with `setPrefersDark`.
if (!window.matchMedia) {
  let prefersDark = false;

  window.matchMedia = (query) => ({
    matches: query.includes("dark") && prefersDark,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  });

  /** Set the simulated OS colour-scheme preference. */
  window.setPrefersDark = (value) => {
    prefersDark = value;
  };
}

vi.stubGlobal("scrollTo", vi.fn());
