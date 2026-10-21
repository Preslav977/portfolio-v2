import styles from "./Typewriter.module.css";

interface TypewriterProps {
  /** The text to type out. */
  text: string;
}

/**
 * The typewriter effect (DESIGN.md §5.4).
 *
 * The animation is pure CSS: the text sits in a clipped box whose width is
 * animated with a `steps()` timing function, so the browser drives it and
 * there is no timer, no `setInterval`, and no re-render (PLAN.md §2.8).
 *
 * The step count is computed from the string, so editing the text later
 * cannot desync the animation.
 *
 * The full text is always present in the DOM, marked `aria-hidden` on the
 * animated copy and repeated in a visually hidden span. Without that, a
 * screen reader would announce the line one character at a time.
 */
export function Typewriter({ text }: TypewriterProps) {
  const stepCount = Math.max(text.length, 1);

  return (
    <span className={styles.wrapper}>
      <span className={styles.animated} aria-hidden="true">
        {text}
      </span>
      <span className="visually-hidden">{text}</span>
    </span>
  );
}
