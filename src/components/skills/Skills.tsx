import { skillGroups } from "../../content/skills";
import { useReveal } from "../../hooks/use-reveal";
import type { Skill, SkillGroup } from "../../types";
import { SectionHeading } from "../section-heading/SectionHeading";
import styles from "./Skills.module.css";

/** How many squares make a full indicator. */
const MAX_LEVEL = 5;

/**
 * A proficiency indicator: a row of squares, filled to the level.
 *
 * Deliberately not a percentage bar — a bar implies a measurement that does
 * not exist, and percentages invite pointless comparison (DESIGN.md §5.6).
 */
function LevelIndicator({ level }: { level: Skill["level"] }) {
  return (
    <span
      className={styles.indicator}
      role="img"
      aria-label={`Level ${level} of ${MAX_LEVEL}`}
    >
      {Array.from({ length: MAX_LEVEL }, (_, index) => (
        <span
          className={styles.square}
          data-filled={index < level ? "true" : undefined}
          key={index}
        />
      ))}
    </span>
  );
}

/** One group of skills — the same component at a different scale. */
function SkillGroupColumn({ group }: { group: SkillGroup }) {
  return (
    <div className={styles.group}>
      <h3 className={styles.groupLabel}>{group.label}</h3>

      <ul className={styles.list}>
        {group.skills.map((skill) => (
          <li className={styles.item} key={skill.name}>
            <span className={styles.skillName}>{skill.name}</span>
            <LevelIndicator level={skill.level} />
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * The Skills section (DESIGN.md §5.6).
 *
 * Three groups — frontend, backend, tools — from `src/content/skills.ts`.
 * Adding a skill is a one-line change to that file.
 */
export function Skills() {
  const revealRef = useReveal<HTMLElement>();

  return (
    <section
      className={styles.skills}
      id="skills"
      aria-labelledby="section-skills-heading"
      ref={revealRef}
    >
      <div className="container">
        <SectionHeading
          number="02"
          eyebrow="Skills"
          title="What I work with"
          lede="The tools and technologies I reach for most often."
        />

        <div className={styles.groups}>
          {skillGroups.map((group) => (
            <SkillGroupColumn group={group} key={group.id} />
          ))}
        </div>
      </div>
    </section>
  );
}
