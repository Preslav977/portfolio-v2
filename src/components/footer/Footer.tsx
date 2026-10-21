import { site } from "../../content/site";
import { ArrowUp } from "../icons/ArrowUp";
import styles from "./Footer.module.css";

/**
 * The footer (DESIGN.md §5.9).
 *
 * A hairline separates it from the page above. The "back to top" control is
 * a real anchor to `#top`, so it works without JavaScript.
 */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <p className={styles.copyright}>
          © {year} {site.copyright}
        </p>

        <a className={styles.backToTop} href="#top">
          {site.backToTopLabel}
          <ArrowUp />
          <span className="visually-hidden">of the page</span>
        </a>
      </div>
    </footer>
  );
}
