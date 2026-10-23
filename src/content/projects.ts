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
    name: "JobScrapper",
    description:
      "JobScrapper is a full-stack project that navigates to the companies' sites and looks for jobs. It scrapes, extracts the information about developer jobs, sanitizes it, and saves it for later.",
    image: "/job-scraper.png",
    imageAlt: "Screenshot of JobScrapper",
    technologies: [
      "TypeScript",
      "React",
      "Node.js",
      "Puppeteer",
      "MSW",
      "Prisma",
    ],
    links: [
      {
        label: "Repository",
        href: "https://github.com/Preslav977/jobscrapper-backend",
        external: true,
      },
      {
        label: "Live preview",
        href: "https://jobscrapper-frontend-sxkw.vercel.app/",
        external: true,
      },
    ],
  },
  {
    id: "project-two",
    name: "YouTube Agent",
    description:
      "YouTube Agent is a full-stack project that auto-discovers a selected channel's first uploaded video by fetching and sorting songs by using the YouTube API. Then it creates a playlist that saves the sorted songs from the channel by oldest.",
    image: "/youtube-agent.png",
    imageAlt: "Screenshot of Youtube Agent",
    technologies: ["TypeScript", "TanStack Query", "Node.js", "Prisma", "MSW"],
    links: [
      {
        label: "Repository",
        href: "https://github.com/Preslav977/youtube-agent-backend",
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
