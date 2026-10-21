/**
 * Shared domain types.
 *
 * Every piece of editable content in the portfolio is described here, so the
 * shape of the data is known in one place (GUIDELINES.md #8).
 */

export type SectionId = "about" | "skills" | "projects" | "contact";

export interface NavLink {
  /** Matches the `id` of the section it points at. */
  id: SectionId;
  label: string;
}

export interface ProjectLink {
  label: string;
  href: string;
  /** Marks links that open in a new tab, for the accessible label. */
  external?: boolean;
}

export interface Project {
  id: string;
  name: string;
  /** One or two sentences on what the project is for. */
  description: string;
  /** Path or URL of the preview image. */
  image: string;
  /** Alt text for the preview image. */
  imageAlt: string;
  /** Technology names, shown as tags. */
  technologies: string[];
  links: ProjectLink[];
}

export type SkillLevel = 1 | 2 | 3 | 4 | 5;

export interface Skill {
  name: string;
  level: SkillLevel;
}

export interface SkillGroup {
  id: string;
  label: string;
  skills: Skill[];
}

export interface SocialLink {
  label: string;
  href: string;
  external?: boolean;
}

export interface AboutContent {
  paragraphs: string[];
  image: string;
  imageAlt: string;
}

export interface ContactContent {
  heading: string;
  intro: string;
  email: string;
  links: SocialLink[];
}

export interface SiteConfig {
  name: string;
  /** Short role line, shown under the name. */
  role: string;
  /** The line the typewriter animates. */
  typewriterText: string;
  /** Label above the name in the hero. */
  heroEyebrow: string;
  nav: NavLink[];
  about: AboutContent;
  contact: ContactContent;
  /** Copyright holder and year. */
  copyright: string;
  /** Label on the "back to top" control in the footer. */
  backToTopLabel: string;
}
