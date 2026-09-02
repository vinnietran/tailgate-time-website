const RESERVED_HOST_SLUGS = new Set([
  "admin",
  "api",
  "dashboard",
  "discover",
  "help",
  "login",
  "new",
  "signup",
  "support"
]);

export function normalizeHostSlug(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 64)
    .replace(/-$/g, "");
}

export function validateHostSlug(value: string) {
  const slug = normalizeHostSlug(value);
  if (slug.length < 3) return "Use at least 3 letters or numbers.";
  if (RESERVED_HOST_SLUGS.has(slug)) return "That URL is reserved by TailgateTime.";
  if (slug !== value.trim().toLowerCase()) {
    return `Use the normalized URL: ${slug}`;
  }
  return null;
}

export function hostSlugCandidate(displayName: string, suffix?: number) {
  const base = normalizeHostSlug(displayName) || "tailgate-host";
  return suffix && suffix > 1 ? `${base}-${suffix}` : base;
}
