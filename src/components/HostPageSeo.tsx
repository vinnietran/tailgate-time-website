import { useEffect } from "react";
import type { PublicHostProfile } from "../types/hostProfile";

function upsertMeta(selector: string, attributes: Record<string, string>, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(selector);
  if (!element) {
    element = document.createElement("meta");
    Object.entries(attributes).forEach(([key, value]) => element?.setAttribute(key, value));
    document.head.appendChild(element);
  }
  element.content = content;
}

export function HostPageSeo({ profile }: { profile: PublicHostProfile }) {
  useEffect(() => {
    const title = `${profile.displayName} | TailgateTime`;
    const description =
      profile.description?.replace(/\s+/g, " ").trim().slice(0, 160) ||
      `Find upcoming tailgates hosted by ${profile.displayName} on TailgateTime. View events, tickets, locations, and more.`;
    const canonical = `${window.location.origin}/hosts/${profile.slug}`;
    const image = profile.coverImageUrl || profile.logoUrl || `${window.location.origin}/ttnobg.png`;

    document.title = title;
    upsertMeta('meta[name="description"]', { name: "description" }, description);
    upsertMeta('meta[property="og:title"]', { property: "og:title" }, title);
    upsertMeta('meta[property="og:description"]', { property: "og:description" }, description);
    upsertMeta('meta[property="og:type"]', { property: "og:type" }, "profile");
    upsertMeta('meta[property="og:url"]', { property: "og:url" }, canonical);
    upsertMeta('meta[property="og:image"]', { property: "og:image" }, image);
    upsertMeta('meta[name="twitter:card"]', { name: "twitter:card" }, "summary_large_image");
    upsertMeta('meta[name="twitter:title"]', { name: "twitter:title" }, title);
    upsertMeta('meta[name="twitter:description"]', { name: "twitter:description" }, description);
    upsertMeta('meta[name="twitter:image"]', { name: "twitter:image" }, image);

    let canonicalLink = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement("link");
      canonicalLink.rel = "canonical";
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.href = canonical;

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.dataset.hostPageSchema = "true";
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Organization",
      name: profile.displayName,
      description,
      url: canonical,
      logo: profile.logoUrl || undefined,
      image: profile.coverImageUrl || profile.logoUrl || undefined,
      address: profile.location || undefined
    });
    document.head.querySelector('script[data-host-page-schema="true"]')?.remove();
    document.head.appendChild(script);

    return () => script.remove();
  }, [profile]);

  return null;
}
