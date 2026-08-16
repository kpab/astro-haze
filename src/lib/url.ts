// Prefix a root-relative path with the configured base (import.meta.env.BASE_URL)
// so internal links and assets work when the site is served from a subpath —
// e.g. a GitHub Pages project site at https://<user>.github.io/<repo>/.
//
// Astro auto-prefixes imported assets (astro:assets) and Astro.url, but NOT
// hardcoded href/src strings, so those go through withBase(). It is idempotent
// and leaves external URLs, anchors and already-prefixed paths untouched.

export type HrefKind =
  | 'external' // http(s):// or //host — another origin
  | 'contact' // mailto: / tel:
  | 'anchor' // #section — the current document
  | 'absolute' // /path — root-relative, needs the base prefix
  | 'relative' // path — resolved by the browser against the current page
  | 'unsafe'; // any other scheme (javascript:, data:, …)

// Strip the leading/trailing C0 controls and spaces the URL parser discards
// before it looks at a URL at all, so `'  javascript:…'` is still recognized as
// a scheme rather than as a relative path that happens to start with a space.
function trimUrl(path: string): string {
  // Everything at or below U+0020 — the C0 range plus the space itself.
  const stripped = (code: number) => code <= 0x20;
  let start = 0;
  let end = path.length;
  while (start < end && stripped(path.charCodeAt(start))) start++;
  while (end > start && stripped(path.charCodeAt(end - 1))) end--;
  return path.slice(start, end);
}

// The URL scheme of `path`, or '' when it has none. A scheme ends at the first
// colon and cannot contain a path separator, query, or fragment marker (so
// `/a:b` is a path, not a scheme). Only tab/CR/LF are dropped before matching,
// mirroring what the URL parser removes from anywhere inside its input: a href
// of `java\tscript:alert(1)` still runs as javascript:, while an interior space
// is kept, so `Notes 2024: draft.html` stays the relative path browsers read it
// as.
function schemeOf(path: string): string {
  const colon = path.indexOf(':');
  if (colon <= 0) return '';
  const head = path.slice(0, colon);
  if (/[/?#]/.test(head)) return '';
  const scheme = head.replace(/[\t\n\r]/g, '').toLowerCase();
  return /^[a-z][a-z0-9+.-]*$/.test(scheme) ? scheme : '';
}

// Single source of truth for what a href-like string points at, shared by
// withBase() below and the content-collection validators, so validation and
// rendering can never disagree about a value.
export function classifyHref(path: string): HrefKind {
  const value = trimUrl(path);
  // Two leading slashes mean another origin. Browsers fold a backslash into a
  // slash for http(s), so `/\host` and `\\host` leave the site like `//host` does.
  if (/^[/\\]{2}/.test(value)) return 'external';
  if (value.startsWith('#')) return 'anchor';
  const scheme = schemeOf(value);
  if (scheme === 'http' || scheme === 'https') return 'external';
  if (scheme === 'mailto' || scheme === 'tel') return 'contact';
  if (scheme) return 'unsafe';
  return value.startsWith('/') ? 'absolute' : 'relative';
}

/**
 * withBase() against an explicitly supplied base.
 *
 * Code that runs from `astro.config` — a Markdown plugin, say — sits outside
 * the app's module graph, where `import.meta.env.BASE_URL` is still the default
 * `/` rather than the configured base. Such callers pass the base in; everyone
 * inside the app should use withBase() below.
 */
export function withBaseOf(base: string, path: string): string {
  if (!path) return path;
  // Only root-relative paths need the base prefix; everything else — external
  // URLs, anchors, mailto/tel, relative paths — is already resolvable as-is.
  if (classifyHref(path) !== 'absolute') return path;
  const prefix = base.replace(/\/$/, '');
  // Prefix the same string the classifier saw, or surrounding whitespace would
  // land in the middle of the emitted URL.
  const value = trimUrl(path);
  if (prefix && (value === prefix || value.startsWith(prefix + '/'))) {
    return value; // already prefixed
  }
  return prefix + value;
}

export function withBase(path: string): string {
  return withBaseOf(import.meta.env.BASE_URL, path);
}
