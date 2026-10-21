import { useCallback, useEffect, useState } from "react";

export type Theme = "light" | "dark";

const STORAGE_KEY = "portfolio-theme";

/** Read the stored preference, if there is a valid one. */
function readStoredTheme(): Theme | null {
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
 * hook only layers an explicit choice on top: it writes `data-theme` on the
 * root element, which the stylesheet gives higher specificity than the media
 * query.
 */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => readStoredTheme() ?? readSystemTheme());

  // Follow the OS preference while the user has not chosen one explicitly.
  useEffect(() => {
    if (readStoredTheme() !== null) {
      return;
    }

    const media = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = (event: MediaQueryListEvent) => {
      setTheme(event.matches ? "dark" : "light");
    };

    media.addEventListener("change", handleChange);

    return () => media.removeEventListener("change", handleChange);
  }, []);

  // Apply the theme to the document.
  useEffect(() => {
    document.documentElement.dataset.theme = theme;

    try {
      window.localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // Storage unavailable — the theme still applies for this session.
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  }, []);

  return { theme, toggleTheme };
}
