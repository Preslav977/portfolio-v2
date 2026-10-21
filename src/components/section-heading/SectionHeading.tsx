import styles from "./SectionHeading.module.css";

interface SectionHeadingProps {
  /** Section number, shown as the mono eyebrow — e.g. "01". */
  number: string;
  /** Short label for the eyebrow, e.g. "About". */
  eyebrow: string;
  /** The section title, rendered as the `h2`. */
  title: string;
  /** Optional supporting sentence under the title. */
  lede?: string;
}

/**
 * The shared section header (DESIGN.md §5.2).
 *
 * Every section uses this, so the numbered eyebrow, the title, and the lede
 * look the same everywhere. The eyebrow is `aria-hidden` — a screen reader
 * should not announce "slash zero one slash about".
 */
export function SectionHeading({
  number,
  eyebrow,
  title,
  lede,
}: SectionHeadingProps) {
  const labelId = `section-${eyebrow.toLowerCase()}-heading`;

  return (
    <div className={styles.heading}>
      <p className={styles.eyebrow} aria-hidden="true">
        {number} / {eyebrow}
      </p>
      <h2 className={styles.title} id={labelId}>
        {title}
      </h2>
      {lede ? <p className={styles.lede}>{lede}</p> : null}
    </div>
  );
}
