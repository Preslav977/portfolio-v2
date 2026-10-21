import { Footer } from "./components/footer/Footer";
import { Hero } from "./components/hero/Hero";
import { Navigation } from "./components/navigation/Navigation";

/**
 * The page shell (PLAN.md Phase 1).
 *
 * Landmarks in order: header, main, footer. The `id="top"` anchor is the
 * target for the "back to top" controls.
 */
export function App() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <div id="top" />

      <Navigation />

      <main id="main">
        <Hero />
        {/* Sections are added in the phases that follow. */}
      </main>

      <Footer />
    </>
  );
}
