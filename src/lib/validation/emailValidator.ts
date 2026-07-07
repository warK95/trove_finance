/**
 * Pragmatic email format validation.
 *
 * This is a data-quality / UX check ("is this shaped like an email
 * address"), not a security control. It intentionally does not
 * attempt full RFC 5322 compliance (that grammar permits addresses
 * almost no real mail system accepts, and a "more correct" regex is
 * usually just a slower way to reject valid addresses). Length is
 * capped up front so we never run the pattern against pathological
 * input.
 */
const EMAIL_PATTERN =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

const MAX_EMAIL_LENGTH = 254; // RFC 5321 mailbox length limit

export function isValidEmail(value: string): boolean {
  if (!value || value.length > MAX_EMAIL_LENGTH) return false;
  return EMAIL_PATTERN.test(value);
}
