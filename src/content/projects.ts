import type { Project } from "../types";

/**
 * The projects shown in the Projects section.
 *
 * Adding a project means adding one object to this array — the card
 * component, the grid, and the layout all pick it up automatically
 * (PLAN.md §3).
 */
export const projects: Project[] = [
  {
    id: "project-one",
    name: "Project One",
    description:
      "A short description of what this project does and who it was for. Two sentences at most — the card is a teaser, not a case study.",
    image: "/placeholder-project-1.svg",
    imageAlt: "Screenshot of Project One",
    technologies: ["TypeScript", "React", "Node.js"],
    links: [
      {
        label: "Repository",
        href: "https://github.com/",
        external: true,
      },
      { label: "Live preview", href: "https://example.com/", external: true },
    ],
  },
  {
    id: "project-two",
    name: "Project Two",
    description:
      "Another placeholder. Replace it with something that shows a different kind of problem from the first one, so the section reads as a range of work.",
    image: "/placeholder-project-2.svg",
    imageAlt: "Screenshot of Project Two",
    technologies: ["Python", "PostgreSQL", "Docker"],
    links: [
      {
        label: "Repository",
        href: "https://github.com/",
        external: true,
      },
      { label: "Live preview", href: "https://example.com/", external: true },
    ],
  },
  {
    id: "project-three",
    name: "Project Three",
    description:
      "A third placeholder, so the grid has something to show at every breakpoint. Two columns on small screens, three once there is room.",
    image: "/placeholder-project-3.svg",
    imageAlt: "Screenshot of Project Three",
    technologies: ["Go", "Redis", "Kubernetes"],
    links: [
      {
        label: "Repository",
        href: "https://github.com/",
        external: true,
      },
      { label: "Live preview", href: "https://example.com/", external: true },
    ],
  },
];
