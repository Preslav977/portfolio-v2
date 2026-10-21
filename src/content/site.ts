import type { SiteConfig } from "../types";

/**
 * Page-wide copy.
 *
 * Everything here appears once on the page, so it lives in one file rather
 * than being threaded through components as props (PLAN.md §3). Replace the
 * placeholder text with your own — no component needs to change.
 */
export const site: SiteConfig = {
  name: "Your Name",
  role: "Full-stack developer",
  heroEyebrow: "Portfolio",
  typewriterText: "I build things that work.",

  nav: [
    { id: "about", label: "About" },
    { id: "skills", label: "Skills" },
    { id: "projects", label: "Projects" },
    { id: "contact", label: "Contact" },
  ],

  about: {
    paragraphs: [
      "I'm a developer who enjoys turning rough ideas into software people can actually use. I work mostly across the stack — the design of an interface, the logic behind it, and the plumbing that keeps it running.",
      "My journey started with a single HTML file and a lot of curiosity. Since then I've worked on everything from small internal tools to products used by thousands of people, and I've learned that the interesting part is rarely the framework — it's the problem.",
      "Away from the keyboard you'll find me hiking, reading, or taking a photo of something that probably doesn't need photographing.",
    ],
    image: "/placeholder-about.jpg",
    imageAlt: "Portrait of me",
  },

  contact: {
    heading: "Get in touch",
    intro:
      "Have something in mind, or just want to say hello? Send a message and I'll get back to you.",
    email: "hello@example.com",
    links: [{ label: "GitHub", href: "https://github.com/", external: true }],
  },

  copyright: "Your Name",
  backToTopLabel: "Back to top",
};
