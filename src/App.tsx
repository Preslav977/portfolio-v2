import { useRef } from "react";
import { About } from "./components/about/About";
import { Contact } from "./components/contact/Contact";
import { Footer } from "./components/footer/Footer";
import { Hero } from "./components/hero/Hero";
import { Navigation } from "./components/navigation/Navigation";
import { Projects } from "./components/projects/Projects";
import { ScrollToTop } from "./components/scroll-to-top/ScrollToTop";
import { Skills } from "./components/skills/Skills";

/**
 * The page shell (PLAN.md Phase 1).
 *
 * Landmarks in order: header, main, footer. The `id="top"` anchor is the
 * target for the "back to top" controls.
 */
export function App() {
  // The scroll-to-top button watches this sentinel. It sits below the hero,
  // so the button appears once the hero has been scrolled past.
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <div id="top" />

      <Navigation />

      <main id="main">
        <Hero />

        <div ref={sentinelRef} aria-hidden="true" />

        <About />
        <Skills />
        <Projects />
        <Contact />
      </main>

      <Footer />

      <ScrollToTop sentinelRef={sentinelRef} />
    </>
  );
}
