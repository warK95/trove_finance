/**
 * Input sanitization utilities for form fields.
 *
 * Scope, honestly stated: these are defense-in-depth helpers for the
 * login and search inputs. They are NOT what actually stops XSS or
 * CSRF in this app - see README.md, "On the security requirements",
 * for the full reasoning. What they DO meaningfully do: strip
 * invisible/confusable Unicode that has no legitimate reason to be in
 * a login or search field, and keep obviously-malformed input out of
 * component state before it ever renders anywhere.
 */

// C0/C1 control characters, zero-width characters, and bidirectional
// override/formatting characters. None of these have a visible glyph;
// real attacks have used them to hide payloads or to make a string
// display as something other than what it actually contains.
const HIDDEN_UNICODE_PATTERN =
  // eslint-disable-next-line no-control-regex
  /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F\u200B-\u200F\u202A-\u202E\u2060-\u2064\uFEFF]/g;

export function stripHiddenUnicode(value: string): string {
  return value.replace(HIDDEN_UNICODE_PATTERN, '');
}

/**
 * For names, tickers, and other free-text display/search fields.
 * Whitelists letters (any language), numbers, spaces, and the small
 * set of punctuation that legitimately shows up in company names and
 * search terms (e.g. "Johnson & Johnson", "Berkshire Hathaway-B").
 */
export function sanitizeDisplayText(value: string, maxLength = 100): string {
  const withoutHidden = stripHiddenUnicode(value);
  const whitelisted = withoutHidden.replace(/[^\p{L}\p{N}\s&.,'-]/gu, '');
  return whitelisted.slice(0, maxLength);
}

/**
 * For the email field specifically. Narrower charset than free text -
 * only what can legally appear in an email address.
 */
export function sanitizeEmailInput(value: string, maxLength = 254): string {
  const withoutHidden = stripHiddenUnicode(value);
  const whitelisted = withoutHidden.replace(/[^a-zA-Z0-9@._+-]/g, '');
  return whitelisted.slice(0, maxLength);
}

/**
 * For the password field. Deliberately does NOT whitelist characters
 * the way the fields above do: symbols like ! " # $ % & are exactly
 * what make a password strong, so stripping them would quietly weaken
 * (or silently corrupt) a password someone meant to type. This only
 * removes characters that can never be a real, intentional keystroke -
 * everything printable is left untouched.
 */
export function sanitizePassword(value: string, maxLength = 128): string {
  return stripHiddenUnicode(value).slice(0, maxLength);
}
