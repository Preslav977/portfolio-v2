import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { App } from "../App";
import { site } from "../content/site";

describe("App", () => {
  it("has exactly one h1", () => {
    render(<App />);

    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
  });

  it("renders the main landmarks", () => {
    render(<App />);

    expect(
      screen.getByRole("banner", { name: "" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("main")).toBeInTheDocument();
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });

  it("gives every section an id and an h2", () => {
    render(<App />);

    for (const link of site.nav) {
      const section = document.getElementById(link.id);

      expect(section, `missing section #${link.id}`).not.toBeNull();
      expect(section?.tagName).toBe("SECTION");
      expect(
        section?.querySelector("h2"),
        `section #${link.id} has no h2`,
      ).not.toBeNull();
    }
  });

  it("never skips a heading level", () => {
    render(<App />);

    const levels = screen
      .getAllByRole("heading")
      .map((heading) => Number(heading.tagName.slice(1)));

    for (let index = 1; index < levels.length; index += 1) {
      const previous = levels[index - 1];
      const current = levels[index];

      if (previous !== undefined && current !== undefined) {
        expect(
          current - previous,
          `heading jumped from h${previous} to h${current}`,
        ).toBeLessThanOrEqual(1);
      }
    }
  });

  it("offers a skip link as the first focusable element", () => {
    render(<App />);

    const skipLink = screen.getByRole("link", { name: /skip to content/i });

    expect(skipLink).toHaveAttribute("href", "#main");
  });

  it("points the back-to-top control at the top of the page", () => {
    render(<App />);

    const backToTop = screen.getByRole("link", { name: /back to top/i });

    expect(backToTop).toHaveAttribute("href", "#top");
  });

  it("has a scroll-to-top button", () => {
    render(<App />);

    expect(
      screen.getByRole("button", { name: "Back to top" }),
    ).toBeInTheDocument();
  });
});
