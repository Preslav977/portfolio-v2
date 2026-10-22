import type { SkillGroup } from "../types";

/**
 * The skills shown in the Skills section, grouped by area.
 *
 * `level` is 1–5 and drives the square indicator in the UI. It is a
 * self-assessment, not a measurement — which is why the UI shows a scale of
 * squares rather than a percentage bar (DESIGN.md §5.6).
 */
export const skillGroups: SkillGroup[] = [
  {
    id: "frontend",
    label: "Frontend",
    skills: [
      { name: "JavaScript", level: 4 },
      { name: "React", level: 4 },
      { name: "TypeScript", level: 3 },
      { name: "HTML5", level: 4 },
      { name: "CSS3 & CSS Modules", level: 4 },
      { name: "Accessibility", level: 3 },
    ],
  },
  {
    id: "backend",
    label: "Backend",
    skills: [
      { name: "Node.js", level: 4 },
      { name: "Express", level: 4 },
      { name: "Prisma", level: 3 },
      { name: "PostgreSQL", level: 4 },
      { name: "MongoDB", level: 4 },
      { name: "REST APIs", level: 4 },
    ],
  },
  {
    id: "tools",
    label: "Tools & Other",
    skills: [
      { name: "Git", level: 4 },
      { name: "ESLint", level: 4 },
      { name: "Prettier", level: 4 },
      { name: "Webpack", level: 4 },
      { name: "Postman", level: 4 },
      { name: "Testing", level: 4 },
    ],
  },
];
