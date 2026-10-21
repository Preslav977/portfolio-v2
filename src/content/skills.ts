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
      { name: "TypeScript", level: 5 },
      { name: "React", level: 5 },
      { name: "CSS & CSS Modules", level: 4 },
      { name: "Accessibility", level: 3 },
    ],
  },
  {
    id: "backend",
    label: "Backend",
    skills: [
      { name: "Node.js", level: 4 },
      { name: "Python", level: 3 },
      { name: "PostgreSQL", level: 3 },
      { name: "REST & GraphQL", level: 4 },
    ],
  },
  {
    id: "tools",
    label: "Tools & Other",
    skills: [
      { name: "Git", level: 4 },
      { name: "Docker", level: 3 },
      { name: "CI/CD", level: 3 },
      { name: "Testing", level: 4 },
    ],
  },
];
