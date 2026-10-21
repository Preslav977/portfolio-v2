import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Typewriter } from "../components/typewriter/Typewriter";
import styles from "../components/typewriter/Typewriter.module.css";

describe("Typewriter", () => {
  it("exposes the full text to assistive technology", () => {
    const { container } = render(
      <Typewriter text="I build things that work." />,
    );

    // The animated copy is hidden from screen readers...
    const animated = container.querySelector(`.${styles.animated}`);
    expect(animated).toHaveAttribute("aria-hidden", "true");

    // ...and the full text is present once, visibly hidden.
    const hidden = container.querySelector(".visually-hidden");
    expect(hidden).toHaveTextContent("I build things that work.");
  });

  it("sets the step count from the length of the text", () => {
    const { container } = render(<Typewriter text="Hello" />);

    const animated = container.querySelector<HTMLElement>(
      `.${styles.animated}`,
    );

    expect(animated?.style.getPropertyValue("--typewriter-steps")).toBe("5");
  });

  it("builds the timing function with a literal step count", () => {
    const { container } = render(<Typewriter text="Hello" />);

    const animated = container.querySelector<HTMLElement>(
      `.${styles.animated}`,
    );

    // steps() requires a literal number token, so the whole function is
    // passed as a custom property rather than steps(var(--n)).
    expect(animated?.style.getPropertyValue("--typewriter-timing")).toBe(
      "steps(5, end)",
    );
  });

  it("handles an empty string without producing an invalid animation", () => {
    const { container } = render(<Typewriter text="" />);

    const animated = container.querySelector<HTMLElement>(
      `.${styles.animated}`,
    );

    expect(animated?.style.getPropertyValue("--typewriter-steps")).toBe("1");
    expect(animated?.style.getPropertyValue("--typewriter-timing")).toBe(
      "steps(1, end)",
    );
  });

  it("renders the text in the DOM", () => {
    render(<Typewriter text="Visible text" />);

    // Twice on purpose: once animated, once for assistive technology.
    expect(screen.getAllByText("Visible text")).toHaveLength(2);
  });
});
