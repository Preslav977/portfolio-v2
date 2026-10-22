import type { SiteConfig } from "../types";

/**
 * Page-wide copy.
 *
 * Everything here appears once on the page, so it lives in one file rather
 * than being threaded through components as props (PLAN.md §3). Replace the
 * placeholder text with your own — no component needs to change.
 */
export const site: SiteConfig = {
  name: "Preslav Tsvetanov",
  role: "Full-stack developer",
  heroEyebrow: "Portfolio V2",
  typewriterText:
    "I build things that make me take me close to real-world problem solving.",

  nav: [
    { id: "about", label: "About" },
    { id: "skills", label: "Skills" },
    { id: "projects", label: "Projects" },
    { id: "contact", label: "Contact" },
  ],

  about: {
    paragraphs: [
      "I'm a developer who enjoys turning ideas into software that people might use.",
      "I work mostly on the PERN stack, using it as a foundation - designing the interface, creating the server that handles the data, and more.",
      "My journey started on The Odin Project, from knowing almost nothing to learning a lot to get there with a lot of persistence, trial and error, and making tons of mistakes.",
      "I have worked from creating the most simple project, rock, paper, and scissors, to creating full-stack projects, integrating AI, and everyday learning something new.",
      "Away from the computer, I prefer listening to music, watching documentaries, and playing roguelike games from time to time.",
    ],
    image: "/profile picture.png",
    imageAlt: "Picture of me",
  },

  contact: {
    heading: "Get in touch",
    intro:
      "Have something in mind, or just want to say hello? Send a message and I'll get back to you.",
    email: "preslavtsvetanov97@gmail.com",
    links: [
      {
        label: "GitHub",
        href: "https://github.com/Preslav977",
        external: true,
      },
    ],
  },

  copyright: "Preslav Tsvetanov",
  backToTopLabel: "Back to top",
};
