import { useCallback, useEffect, useState } from "react";

/**
 * The scroll-to-top button (DESIGN.md §5.10).
 *
 * The button appears only after the reader has scrolled past the hero. That
 * threshold comes from an `IntersectionObserver` watching a sentinel placed
 * below the hero: while the sentinel is still on screen the button stays
 * hidden, and once it scrolls out the button appears.
 *
 * Using an observer rather than a scroll listener means no per-scroll work
 * at all.
 */
export function useScrollToTop(sentinelRef: React.RefObject<HTMLElement | null>) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const sentinel = sentinelRef.current;

    if (!sentinel || typeof IntersectionObserver === "undefined") {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(!entry?.isIntersecting);
      },
      { threshold: 0 },
    );

    observer.observe(sentinel);

    return () => observer.disconnect();
  }, [sentinelRef]);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return { isVisible, scrollToTop };
}
