import pages from "../data/pageMetadata.json";
export const SITE_ORIGIN = "https://tailgate-time.com";
export const SHARE_IMAGE = `${SITE_ORIGIN}/images/bt2.jpg`;
export function applyPageMetadata(pathname: string, fallbackTitle: string) {
 const key = pathname.replace(/\.html$/, "");
 const data = (pages as Record<string, string[]>)[key];
 const [title, description] = data ?? [fallbackTitle, "Manage your tailgate plans, guests, and game-day details with TailgateTime."];
 document.title = title;
 const set = (name: string, content: string, property = false) => {
  const attr = property ? "property" : "name";
  let tag = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${name}"]`);
  if (!tag) { tag = document.createElement("meta"); tag.setAttribute(attr, name); document.head.appendChild(tag); }
  tag.content = content;
 };
 set("description", description);
 for (const [name, content] of Object.entries({ title, description, url: `${SITE_ORIGIN}${key}`, image: SHARE_IMAGE, type: "website" })) set(`og:${name}`, content, true);
 set("twitter:card", "summary_large_image"); set("twitter:title", title); set("twitter:description", description); set("twitter:image", SHARE_IMAGE);
 let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
 if (!canonical) { canonical = document.createElement("link"); canonical.rel = "canonical"; document.head.appendChild(canonical); }
 canonical.href = `${SITE_ORIGIN}${key}`;
}
