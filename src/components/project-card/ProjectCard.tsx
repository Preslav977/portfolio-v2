import type { Project } from "../../types";
import { ExternalLink } from "../icons/ExternalLink";
import styles from "./ProjectCard.module.css";

interface ProjectCardProps {
  project: Project;
}

/**
 * A single project card (DESIGN.md §5.7).
 *
 * The technology tags are monogram chips rather than brand logos: no icon
 * library is installed, and the tech name is always present as text, so the
 * information never depends on an image (PLAN.md §2.7).
 */
export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article className={styles.card} data-project-card>
      <img
        className={styles.image}
        src={project.image}
        alt={project.imageAlt}
        width={640}
        height={400}
        loading="lazy"
      />

      <div className={styles.body}>
        <h3 className={styles.name}>{project.name}</h3>

        <p className={styles.description}>{project.description}</p>

        <ul className={styles.tags}>
          {project.technologies.map((technology) => (
            <li className={styles.tag} key={technology}>
              {technology}
            </li>
          ))}
        </ul>

        <ul className={styles.links}>
          {project.links.map((link) => (
            <li key={link.label}>
              <a
                className={styles.link}
                href={link.href}
                rel={link.external ? "noreferrer" : undefined}
                target={link.external ? "_blank" : undefined}
              >
                {link.label}
                {link.external ? <ExternalLink /> : null}
                {link.external ? (
                  <span className="visually-hidden">(opens in a new tab)</span>
                ) : null}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
