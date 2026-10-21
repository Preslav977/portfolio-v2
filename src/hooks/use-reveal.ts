import { useEffect, useRef } from "react";

/**
 * Reveals an element when it scrolls into view (DESIGN.md §6.3).
 *
 * The element's *visible* state is the base state in CSS. This hook adds
 * `data-reveal="pending"` to hide it and then switches to `"visible"` once
 * it intersects. If scripts fail, the attribute is never added and the
 * content simply stays visible — the animation is an enhancement, never a
 * prerequisite for reading the page.
 *
 * `prefers-reduced-motion` is handled in CSS (the pending state is forced
 * visible), so this hook does not need to check the media query itself.
 */
export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const element = ref.current;

    if (!element) {
      return;
    }

    if (typeof IntersectionObserver === "undefined") {
      return;
    }

    element.dataset.reveal = "pending";

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            element.dataset.reveal = "visible";
            observer.disconnect();
          }
        }
      },
      { threshold: 0.15 },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return ref;
}
