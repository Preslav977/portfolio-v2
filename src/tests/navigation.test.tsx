import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Navigation } from "../components/navigation/Navigation";
import { site } from "../content/site";

describe("Navigation", () => {
  it("shows the site name", () => {
    render(<Navigation />);

    expect(
      screen.getByRole("link", { name: site.name }),
    ).toBeInTheDocument();
  });

  it("links to every section, and each target exists", () => {
    render(<Navigation />);

    for (const link of site.nav) {
      const anchor = screen.getByRole("link", { name: link.label });

      expect(anchor).toHaveAttribute("href", `#${link.id}`);
    }
  });

  it("marks up the nav as a labelled landmark", () => {
    render(<Navigation />);

    expect(screen.getByRole("navigation", { name: "Main" })).toBeInTheDocument();
  });

  it("offers a theme toggle", () => {
    render(<Navigation />);

    expect(
      screen.getByRole("button", { name: /switch to/i }),
    ).toBeInTheDocument();
  });

  it("does not mark any link as current before the page is scrolled", () => {
    render(<Navigation />);

    const current = screen
      .queryAllByRole("link")
      .filter((link) => link.getAttribute("aria-current") !== null);

    expect(current).toHaveLength(0);
  });
});
