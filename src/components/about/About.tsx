import { site } from "../../content/site";
import { useReveal } from "../../hooks/use-reveal";
import { SectionHeading } from "../section-heading/SectionHeading";
import styles from "./About.module.css";

/**
 * The About section (DESIGN.md §5.5).
 *
 * Text on the left, portrait on the right at wider sizes; the image comes
 * first on narrow screens.
 */
export function About() {
  const revealRef = useReveal<HTMLElement>();

  return (
    <section
      className={styles.about}
      id="about"
      aria-labelledby="section-about-heading"
      ref={revealRef}
    >
      <div className={`container ${styles.inner}`}>
        <div className={styles.text}>
          <SectionHeading
            number="01"
            eyebrow="About"
            title="A short introduction"
            lede="Who I am, how I got here, and what I do when I am not working."
          />

          {site.about.paragraphs.map((paragraph) => (
            <p className={styles.paragraph} key={paragraph.slice(0, 24)}>
              {paragraph}
            </p>
          ))}
        </div>

        <figure className={styles.figure}>
          <img
            className={styles.image}
            src={site.about.image}
            alt={site.about.imageAlt}
            width={480}
            height={600}
            loading="lazy"
          />
          <figcaption className={styles.caption}>
            {/* Placeholder portrait — replace with your own photo */}
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
