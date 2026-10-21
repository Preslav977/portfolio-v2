import { projects } from "../../content/projects";
import { useReveal } from "../../hooks/use-reveal";
import { ProjectCard } from "../project-card/ProjectCard";
import { SectionHeading } from "../section-heading/SectionHeading";
import styles from "./Projects.module.css";

/**
 * The Projects section (DESIGN.md §5.7).
 *
 * The grid comes from `src/content/projects.ts` — adding a project is one
 * object, and the layout picks it up at every breakpoint.
 */
export function Projects() {
  const revealRef = useReveal<HTMLElement>();

  return (
    <section
      className={styles.projects}
      id="projects"
      aria-labelledby="section-projects-heading"
      ref={revealRef}
    >
      <div className="container">
        <SectionHeading
          number="03"
          eyebrow="Projects"
          title="Things I have built"
          lede="A selection of projects — each one started as a problem worth solving."
        />

        <div className={styles.grid}>
          {projects.map((project) => (
            <ProjectCard project={project} key={project.id} />
          ))}
        </div>
      </div>
    </section>
  );
}
