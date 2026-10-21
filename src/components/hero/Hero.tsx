import { site } from "../../content/site";
import { ArrowDown } from "../icons/ArrowDown";
import { Typewriter } from "../typewriter/Typewriter";
import styles from "./Hero.module.css";

/**
 * The hero (DESIGN.md §5.4).
 *
 * Deliberately not the stock centred-name-plus-buttons opener. The name is
 * stable, the typewriter carries the motion, and the single arrow is the
 * only action — it is a real anchor to the projects section, so it is
 * keyboard- and screen-reader accessible without extra work.
 */
export function Hero() {
  return (
    <section className={styles.hero} aria-labelledby="hero-name">
      <div className={`container ${styles.inner}`}>
        <p className={styles.eyebrow}>{site.heroEyebrow}</p>

        <h1 className={styles.name} id="hero-name">
          {site.name}
        </h1>

        <p className={styles.tagline}>
          <Typewriter text={site.typewriterText} />
        </p>

        <a className={styles.arrow} href="#projects">
          <ArrowDown />
          <span className="visually-hidden">Go to projects</span>
        </a>
      </div>
    </section>
  );
}
