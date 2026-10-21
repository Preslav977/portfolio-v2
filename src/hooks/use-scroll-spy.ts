import { useEffect, useState } from "react";

/**
 * Tracks which section is currently in view, for the active nav link.
 *
 * Uses one `IntersectionObserver` over the section elements rather than a
 * scroll listener, so there is no per-scroll work (PLAN.md §2.3).
 *
 * The section nearest the top of the viewport wins, which is what a reader
 * expects: the link highlights the section they are looking at, not the one
 * that merely occupies the most pixels.
 */
export function useScrollSpy(sectionIds: readonly string[]) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") {
      return;
    }

    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null);

    if (elements.length === 0) {
      return;
    }

    const visible = new Set<string>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            visible.add(entry.target.id);
          } else {
            visible.delete(entry.target.id);
          }
        }

        if (visible.size === 0) {
          return;
        }

        // Pick the visible section that comes first in the document.
        const first = sectionIds.find((id) => visible.has(id));

        if (first !== undefined) {
          setActiveId(first);
        }
      },
      // A band across the upper part of the viewport: a section counts as
      // current once it reaches the top third of the screen.
      { rootMargin: "-20% 0px -70% 0px", threshold: 0 },
    );

    for (const element of elements) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, [sectionIds]);

  return activeId;
}
