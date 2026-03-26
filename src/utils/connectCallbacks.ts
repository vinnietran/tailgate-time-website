export function normalizeConnectRedirectPath(path: string): string {
  const trimmed = path.trim();
  if (!trimmed || !trimmed.startsWith("/") || trimmed.startsWith("//")) {
    return "/account";
  }
  return trimmed;
}

export function buildConnectCallbackUrl(baseUrl: string, redirectPath: string): string {
  const trimmedBaseUrl = baseUrl.trim();
  if (!trimmedBaseUrl) {
    return trimmedBaseUrl;
  }

  try {
    const url = new URL(trimmedBaseUrl);
    url.searchParams.set("redirect", normalizeConnectRedirectPath(redirectPath));
    return url.toString();
  } catch {
    return trimmedBaseUrl;
  }
}
