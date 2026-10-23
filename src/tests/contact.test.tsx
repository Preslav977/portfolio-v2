import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Contact } from "../components/contact/Contact";
import { site } from "../content/site";

describe("Contact", () => {
  it("labels every form field", () => {
    render(<Contact />);

    expect(screen.getByLabelText("Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Message")).toBeInTheDocument();
  });

  it("marks the name and email as required", () => {
    render(<Contact />);

    expect(screen.getByLabelText("Name")).toBeRequired();
    expect(screen.getByLabelText("Email")).toBeRequired();
    expect(screen.getByLabelText("Message")).toBeRequired();
  });

  it("uses an email input for the email field", () => {
    render(<Contact />);

    expect(screen.getByLabelText("Email")).toHaveAttribute("type", "email");
  });

  it("requires the message to be longer than a few characters", () => {
    render(<Contact />);

    expect(screen.getByLabelText("Message")).toHaveAttribute("minlength", "10");
  });

  it("blocks submission when the form is empty", async () => {
    const user = userEvent.setup();

    render(<Contact />);

    const form = screen.getByRole("button", { name: /send message/i });
    await user.click(form);

    // Native validation prevents the submit event from firing, so the
    // success message never appears.
    expect(
      screen.queryByText(/opening your mail client/i),
    ).not.toBeInTheDocument();
  });

  it("opens a mailto link with the message when the form is valid", async () => {
    const user = userEvent.setup();

    render(<Contact />);

    await user.type(screen.getByLabelText("Name"), "Ada");
    await user.type(screen.getByLabelText("Email"), "ada@example.com");
    await user.type(screen.getByLabelText("Message"), "Hello there, how are you?");

    await user.click(screen.getByRole("button", { name: /send message/i }));

    expect(screen.getByText(/opening your mail client/i)).toBeInTheDocument();
  });

  it("links to GitHub with a new-tab warning", () => {
    render(<Contact />);

    const link = screen.getByRole("link", { name: /github/i });

    expect(link).toHaveAttribute("href", site.contact.links[0]?.href);
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noreferrer");
    expect(link).toHaveTextContent(/opens in a new tab/i);
  });
});
