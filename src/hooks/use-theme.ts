import { useCallback, useEffect, useState } from "react";

export type Theme = "light" | "dark";

const STORAGE_KEY = "portfolio-theme";

/** Read the stored preference, if there is a valid one. */
function readStoredPreference(): Theme | null {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored === "light" || stored === "dark" ? stored : null;
  } catch {
    // Private browsing or blocked storage — fall back to the OS preference.
    return null;
  }
}

/** The theme the OS asks for, defaulting to light. */
function readSystemTheme(): Theme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

/**
 * The light/dark theme toggle (DESIGN.md §2.4).
 *
 * The CSS handles the OS preference on its own, with no JavaScript. This
 * hook layers an *explicit* choice on top: it writes `data-theme` on the root
 * element, which the stylesheet gives higher specificity than the media
 * query.
 *
 * With no stored preference the hook writes nothing, so the page follows the
 * OS in pure CSS and keeps following it as the OS setting changes.
 */
export function useTheme() {
  /** The user's explicit choice, or null when they have not made one. */
  const [preference, setPreference] = useState<Theme | null>(
    readStoredPreference,
  );
  const [systemTheme, setSystemTheme] = useState<Theme>(readSystemTheme);

  // Track the OS preference so the toggle can flip away from it.
  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = (event: MediaQueryListEvent) => {
      setSystemTheme(event.matches ? "dark" : "light");
    };

    media.addEventListener("change", handleChange);

    return () => media.removeEventListener("change", handleChange);
  }, []);

  // Apply the explicit choice. With no choice, remove the attribute so the
  // stylesheet's media query governs.
  useEffect(() => {
    const root = document.documentElement;

    if (preference === null) {
      delete root.dataset.theme;
    } else {
      root.dataset.theme = preference;
    }
  }, [preference]);

  const theme = preference ?? systemTheme;

  const toggleTheme = useCallback(() => {
    setPreference((current) => {
      const next: Theme = (current ?? systemTheme) === "dark" ? "light" : "dark";

      try {
        window.localStorage.setItem(STORAGE_KEY, next);
      } catch {
        // Storage unavailable — the theme still applies for this session.
      }

      return next;
    });
  }, [systemTheme]);

  return { theme, toggleTheme };
}
