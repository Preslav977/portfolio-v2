import type { CSSProperties } from "react";
import styles from "./Typewriter.module.css";

interface TypewriterProps {
  /** The text to type out. */
  text: string;
}

/** Milliseconds per character, plus a short pause at the end. */
const MS_PER_CHARACTER = 70;
const END_PAUSE_MS = 400;

/**
 * The typewriter effect (DESIGN.md §5.4).
 *
 * The animation is pure CSS: the text sits in a clipped box whose width is
 * animated with a `steps()` timing function, so the browser drives it and
 * there is no timer, no `setInterval`, and no re-render (PLAN.md §2.8).
 *
 * The step count and the timing function are computed from the string, so
 * editing the text later cannot desync the animation.
 *
 * The full text is always present in the DOM, marked `aria-hidden` on the
 * animated copy and repeated in a visually hidden span. Without that, a
 * screen reader would announce the line one character at a time.
 */
export function Typewriter({ text }: TypewriterProps) {
  const stepCount = Math.max(text.length, 1);
  const duration = text.length * MS_PER_CHARACTER + END_PAUSE_MS;

  // The timing function is passed whole rather than as `steps(var(--n))`:
  // the spec requires steps() to take a literal number token, so a bare
  // var() inside steps() is not substituted reliably.
  const style = {
    "--typewriter-steps": String(stepCount),
    "--typewriter-duration": `${duration}ms`,
    "--typewriter-timing": `steps(${stepCount}, end)`,
  } as CSSProperties;

  return (
    <span className={styles.wrapper}>
      <span className={styles.animated} style={style} aria-hidden="true">
        {text}
      </span>
      <span className="visually-hidden">{text}</span>
    </span>
  );
}
