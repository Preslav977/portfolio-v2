import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useReveal } from "../hooks/use-reveal";

/** A minimal stand-in for IntersectionObserver. */
class MockIntersectionObserver implements IntersectionObserver {
  readonly root: Element | null = null;
  readonly rootMargin: string = "";
  readonly scrollMargin: string = "";
  readonly thresholds: ReadonlyArray<number> = [];

  private static instances: MockIntersectionObserver[] = [];

  private readonly callback: IntersectionObserverCallback;

  constructor(
    callback: IntersectionObserverCallback,
    options?: IntersectionObserverInit,
  ) {
    this.callback = callback;
    this.rootMargin = options?.rootMargin ?? "";
    MockIntersectionObserver.instances.push(this);
  }

  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }

  /** Fire the callback as though the target started intersecting. */
  static trigger(isIntersecting: boolean) {
    for (const instance of MockIntersectionObserver.instances) {
      instance.callback(
        [
          { isIntersecting } as IntersectionObserverEntry,
        ],
        instance as unknown as IntersectionObserver,
      );
    }
  }

  static reset() {
    MockIntersectionObserver.instances = [];
  }
}

function RevealTarget() {
  const ref = useReveal<HTMLDivElement>();

  return <div ref={ref}>Revealed content</div>;
}

describe("useReveal", () => {
  it("marks the element as pending, then visible when it intersects", async () => {
    MockIntersectionObserver.reset();
    vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);

    render(<RevealTarget />);

    const target = screen.getByText("Revealed content");
    expect(target.dataset.reveal).toBe("pending");

    MockIntersectionObserver.trigger(true);

    expect(target.dataset.reveal).toBe("visible");

    vi.unstubAllGlobals();
  });

  it("leaves the element visible when the observer is unavailable", () => {
    vi.stubGlobal("IntersectionObserver", undefined);

    render(<RevealTarget />);

    const target = screen.getByText("Revealed content");

    // No observer means no `pending` state, so the content stays visible.
    expect(target.dataset.reveal).toBeUndefined();

    vi.unstubAllGlobals();
  });
});
