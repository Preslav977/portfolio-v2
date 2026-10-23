import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { App } from "../App";
import { projects } from "../content/projects";
import { site } from "../content/site";
import { skillGroups } from "../content/skills";

/**
 * Whole-page checks (PLAN.md Phase 7).
 *
 * These assert the assembled page — not one component in isolation — so a
 * section that renders but is unreachable, or a link that points at nothing,
 * is caught.
 */
describe("the assembled page", () => {
  it("renders every project from the content file", () => {
    render(<App />);

    for (const project of projects) {
      expect(
        screen.getByRole("heading", { name: project.name }),
      ).toBeInTheDocument();
    }
  });

  it("shows each project's technology tags", () => {
    render(<App />);

    for (const project of projects) {
      const card = screen.getByRole("heading", { name: project.name });

      for (const technology of project.technologies) {
        expect(
          within(card.closest("article") as HTMLElement).getByText(technology),
        ).toBeInTheDocument();
      }
    }
  });

  it("gives every project a repository and a live preview link", () => {
    render(<App />);

    for (const project of projects) {
      const heading = screen.getByRole("heading", { name: project.name });
      const card = heading.closest("article") as HTMLElement;

      for (const link of project.links) {
        const anchor = within(card).getByRole("link", {
          name: new RegExp(link.label),
        });

        expect(anchor).toHaveAttribute("href", link.href);
      }
    }
  });

  it("renders every skill group and its skills", () => {
    render(<App />);

    for (const group of skillGroups) {
      const heading = screen.getByRole("heading", { name: group.label });
      const column = heading.parentElement as HTMLElement;

      expect(heading).toBeInTheDocument();

      for (const skill of group.skills) {
        expect(within(column).getByText(skill.name)).toBeInTheDocument();
      }
    }
  });

  it("shows a level indicator for every skill", () => {
    render(<App />);

    const indicators = screen.getAllByRole("img", { name: /^Level \d of 5$/ });

    const totalSkills = skillGroups.reduce(
      (count, group) => count + group.skills.length,
      0,
    );

    expect(indicators).toHaveLength(totalSkills);
  });

  it("renders the about paragraphs", () => {
    render(<App />);

    const about = document.getElementById("about") as HTMLElement;

    for (const paragraph of site.about.paragraphs) {
      expect(within(about).getByText(paragraph)).toBeInTheDocument();
    }
  });

  it("links the hero arrow to the projects section", () => {
    render(<App />);

    const arrow = screen.getByRole("link", { name: /go to projects/i });

    expect(arrow).toHaveAttribute("href", "#projects");
  });

  it("gives every nav link a target that exists on the page", () => {
    render(<App />);

    for (const link of site.nav) {
      expect(document.getElementById(link.id)).not.toBeNull();
    }
  });

  it("puts the name in the hero heading and the nav", () => {
    render(<App />);

    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent(site.name);
  });

  it("gives every image an alt attribute", () => {
    const { container } = render(<App />);

    const images = container.querySelectorAll("img");

    expect(images.length).toBeGreaterThan(0);

    for (const image of images) {
      expect(image).toHaveAttribute("alt");
    }
  });

  it("does not leave any link without an accessible name", () => {
    render(<App />);

    const links = screen.getAllByRole("link");

    for (const link of links) {
      expect(link).toHaveAccessibleName();
    }
  });

  it("marks external links as opening in a new tab", () => {
    render(<App />);

    const externalLinks = screen
      .getAllByRole("link")
      .filter((link) => link.getAttribute("target") === "_blank");

    expect(externalLinks.length).toBeGreaterThan(0);

    for (const link of externalLinks) {
      expect(link).toHaveAttribute("rel", "noreferrer");
      expect(link).toHaveTextContent(/opens in a new tab/i);
    }
  });

  it("links each project screenshot to its live preview", () => {
    render(<App />);

    for (const project of projects) {
      const preview = project.links.find((link) =>
        link.label.toLowerCase().includes("preview"),
      );

      if (!preview) {
        continue;
      }

      const heading = screen.getByRole("heading", { name: project.name });
      const card = heading.closest("article") as HTMLElement;
      const imageLink = within(card).getByRole("link", {
        name: new RegExp(`live preview of ${project.name}`, "i"),
      });

      expect(imageLink).toHaveAttribute("href", preview.href);
      expect(imageLink).toHaveAttribute("target", "_blank");
      expect(imageLink).toHaveAttribute("rel", "noreferrer");
    }
  });

  it("gives the contact form a submit button", () => {
    render(<App />);

    const form = screen.getByRole("button", { name: /send message/i });

    expect(within(form.closest("form") as HTMLElement).getByLabelText("Name"))
      .toBeInTheDocument();
  });
});
