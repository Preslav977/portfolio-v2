/**
 * Type declarations for the test environment.
 *
 * `@testing-library/jest-dom` ships a `vitest` entry point that augments
 * Vitest's `Assertion` interface with its matchers. Referencing it here
 * means the matchers are typed everywhere without a per-file import.
 */
import "@testing-library/jest-dom/vitest";

declare global {
  interface Window {
    /**
     * Sets the simulated OS colour-scheme preference. Provided by the
     * `matchMedia` stub in `src/tests/setup.js`.
     */
    setPrefersDark?: (value: boolean) => void;
  }
}

export {};
