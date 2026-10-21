import { useScrollToTop } from "../../hooks/use-scroll-to-top";
import { ArrowUp } from "../icons/ArrowUp";
import styles from "./ScrollToTop.module.css";

interface ScrollToTopProps {
  /** The sentinel watched to decide when the button should appear. */
  sentinelRef: React.RefObject<HTMLElement | null>;
}

/**
 * The scroll-to-top button (DESIGN.md §5.10).
 *
 * A small circle on the right edge of the page, shown only once the reader
 * has scrolled past the hero. Visibility comes from an `IntersectionObserver`
 * on a sentinel rather than a scroll listener, so there is no per-scroll
 * work.
 */
export function ScrollToTop({ sentinelRef }: ScrollToTopProps) {
  const { isVisible, scrollToTop } = useScrollToTop(sentinelRef);

  return (
    <button
      className={styles.button}
      type="button"
      onClick={scrollToTop}
      aria-label="Back to top"
      data-visible={isVisible ? "true" : undefined}
    >
      <ArrowUp />
    </button>
  );
}
