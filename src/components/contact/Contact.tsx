import { useState } from "react";
import { site } from "../../content/site";
import { useReveal } from "../../hooks/use-reveal";
import { buildMailtoLink } from "../../lib/mailto";
import { GitHub } from "../icons/GitHub";
import { SectionHeading } from "../section-heading/SectionHeading";
import styles from "./Contact.module.css";

/**
 * The Contact section (DESIGN.md §5.8).
 *
 * The form uses native HTML validation and a `mailto:` link — no backend,
 * no third-party service, nothing to configure (PLAN.md §2.6).
 */
export function Contact() {
  const revealRef = useReveal<HTMLElement>();
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const data = new FormData(form);

    const name = String(data.get("name") ?? "");
    const email = String(data.get("email") ?? "");
    const message = String(data.get("message") ?? "");

    // The browser has already validated the fields; this is the happy path.
    const link = buildMailtoLink({
      to: site.contact.email,
      subject: `Message from ${name}`,
      body: `${message}\n\n— ${name} (${email})`,
    });

    setSubmitted(true);
    window.location.href = link;
  }

  return (
    <section
      className={styles.contact}
      id="contact"
      aria-labelledby="section-contact-heading"
      ref={revealRef}
    >
      <div className={`container ${styles.inner}`}>
        <div className={styles.intro}>
          <SectionHeading
            number="04"
            eyebrow="Contact"
            title={site.contact.heading}
            lede={site.contact.intro}
          />

          <ul className={styles.socials}>
            {site.contact.links.map((link) => (
              <li key={link.label}>
                <a
                  className={styles.social}
                  href={link.href}
                  rel={link.external ? "noreferrer" : undefined}
                  target={link.external ? "_blank" : undefined}
                >
                  {link.label === "GitHub" ? <GitHub /> : null}
                  {link.label}
                  {link.external ? (
                    <span className="visually-hidden">(opens in a new tab)</span>
                  ) : null}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <form className={styles.form} onSubmit={handleSubmit} noValidate={false}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="contact-name">
              Name
            </label>
            <input
              className={styles.input}
              id="contact-name"
              name="name"
              type="text"
              required
              autoComplete="name"
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="contact-email">
              Email
            </label>
            <input
              className={styles.input}
              id="contact-email"
              name="email"
              type="email"
              required
              autoComplete="email"
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="contact-message">
              Message
            </label>
            <textarea
              className={styles.textarea}
              id="contact-message"
              name="message"
              rows={5}
              required
              minLength={10}
            />
          </div>

          <button className={styles.submit} type="submit">
            Send message
          </button>

          {submitted ? (
            <p className={styles.status} role="status">
              Opening your mail client…
            </p>
          ) : null}
        </form>
      </div>
    </section>
  );
}
