import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { useTheme } from "../hooks/use-theme";

const STORAGE_KEY = "portfolio-theme";

function clearStorage() {
  try {
    window.localStorage.clear();
  } catch {
    // Storage unavailable in this environment.
  }
}

afterEach(() => {
  clearStorage();
  delete document.documentElement.dataset.theme;
});

describe("useTheme", () => {
  it("follows the OS preference when nothing is stored", () => {
    const { result } = renderHook(() => useTheme());

    expect(result.current.theme).toBe("light");
    // With no explicit choice the attribute is absent, so the stylesheet's
    // media query governs.
    expect(document.documentElement.dataset.theme).toBeUndefined();
  });

  it("restores a stored preference", () => {
    window.localStorage.setItem(STORAGE_KEY, "dark");

    const { result } = renderHook(() => useTheme());

    expect(result.current.theme).toBe("dark");
    expect(document.documentElement.dataset.theme).toBe("dark");
  });

  it("ignores an invalid stored value", () => {
    window.localStorage.setItem(STORAGE_KEY, "chartreuse");

    const { result } = renderHook(() => useTheme());

    expect(result.current.theme).toBe("light");
  });

  it("toggles between light and dark", () => {
    const { result } = renderHook(() => useTheme());

    act(() => result.current.toggleTheme());

    expect(result.current.theme).toBe("dark");
    expect(document.documentElement.dataset.theme).toBe("dark");

    act(() => result.current.toggleTheme());

    expect(result.current.theme).toBe("light");
    expect(document.documentElement.dataset.theme).toBe("light");
  });

  it("persists the choice so it survives a reload", () => {
    const { result } = renderHook(() => useTheme());

    act(() => result.current.toggleTheme());

    expect(window.localStorage.getItem(STORAGE_KEY)).toBe("dark");
  });

  it("toggles away from the OS preference", () => {
    window.setPrefersDark?.(true);

    const { result } = renderHook(() => useTheme());

    // The OS wants dark, so the first toggle must go to light.
    expect(result.current.theme).toBe("dark");
    act(() => result.current.toggleTheme());
    expect(result.current.theme).toBe("light");

    window.setPrefersDark?.(false);
  });
});
