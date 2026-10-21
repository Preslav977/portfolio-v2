/**
 * Building a `mailto:` link.
 *
 * Pure functions with no DOM dependency, so the encoding is directly
 * testable (PLAN.md §2.6).
 */

export interface MailtoOptions {
  /** The address the message is sent to. */
  to: string;
  /** The email subject. */
  subject: string;
  /** The message body. */
  body: string;
}

/**
 * Build a `mailto:` URL.
 *
 * The subject and body are percent-encoded, so characters like `&`, `?`,
 * `#` and newlines cannot break out of the URL and inject extra query
 * parameters.
 */
export function buildMailtoLink({ to, subject, body }: MailtoOptions): string {
  const query = new URLSearchParams({ subject, body });

  return `mailto:${to}?${query.toString()}`;
}

/**
 * Read the form fields into the shape `buildMailtoLink` expects.
 *
 * Newlines are normalised to CRLF, which is what a mail client expects in a
 * message body.
 */
export function readMessageForm(values: {
  name: string;
  email: string;
  message: string;
}): MailtoOptions["body"] {
  return `${values.message}\n\n— ${values.name} (${values.email})`;
}
