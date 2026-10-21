import { describe, expect, it } from "vitest";
import { buildMailtoLink, readMessageForm } from "../lib/mailto";

describe("buildMailtoLink", () => {
  it("builds a mailto URL with a subject and body", () => {
    const link = buildMailtoLink({
      to: "hello@example.com",
      subject: "Hello",
      body: "A message",
    });

    expect(link).toBe(
      "mailto:hello@example.com?subject=Hello&body=A+message",
    );
  });

  it("percent-encodes characters that would break the URL", () => {
    const link = buildMailtoLink({
      to: "hello@example.com",
      subject: "Question & answer",
      body: "50% off #now",
    });

    expect(link).toContain("subject=Question+%26+answer");
    expect(link).toContain("body=50%25+off+%23now");

    // The raw characters must not survive into the query string.
    expect(link).not.toContain("#now");
  });

  it("encodes newlines in the body", () => {
    const link = buildMailtoLink({
      to: "hello@example.com",
      subject: "Hi",
      body: "Line one\nLine two",
    });

    expect(link).toContain("%0A");
    expect(link).not.toContain("\n");
  });

  it("handles an empty subject and body", () => {
    const link = buildMailtoLink({
      to: "hello@example.com",
      subject: "",
      body: "",
    });

    expect(link).toBe("mailto:hello@example.com?subject=&body=");
  });

  it("handles unicode", () => {
    const link = buildMailtoLink({
      to: "hello@example.com",
      subject: "Grüße 🎉",
      body: "Ünïcödé",
    });

    expect(link).toContain("Gr%C3%BC%C3%9Fe");
    expect(link).toContain("%F0%9F%8E%89");
  });
});

describe("readMessageForm", () => {
  it("appends the sender's name and email to the message", () => {
    const body = readMessageForm({
      name: "Ada",
      email: "ada@example.com",
      message: "Hello there.",
    });

    expect(body).toBe("Hello there.\n\n— Ada (ada@example.com)");
  });

  it("handles empty fields without throwing", () => {
    const body = readMessageForm({ name: "", email: "", message: "" });

    expect(body).toBe("\n\n—  ()");
  });
});
