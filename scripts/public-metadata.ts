import type { PluginOption } from "vite";
import pages from "../src/data/pageMetadata.json";
const origin = "https://tailgate-time.com";
const escape = (s: string) => s.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;");
function head(html: string, route: string, data: string[]) {
 const [title, description] = data;
 const url = origin + route;
 const image = origin + "/images/bt2.jpg";
 return html.replace(/<title>.*?<\/title>/s, `<title>${escape(title)}</title>`)
 .replace(/<meta name="description"[^>]*>/, `<meta name="description" content="${escape(description)}" />`)
 .replace(/<meta (?:property="og:[^"]*"|name="twitter:[^"]*")[^>]*>/g, "")
 .replace(/<link rel="canonical"[^>]*>/g, "")
 .replace("</head>", `<link rel="canonical" href="${url}" />
${Object.entries({"og:title":title,"og:description":description,"og:url":url,"og:image":image,"og:type":"website"}).map(([name,value])=>`<meta property="${name}" content="${escape(value)}" />`).join("\n")}
<meta name="twitter:card" content="summary_large_image" /><meta name="twitter:title" content="${escape(title)}" /><meta name="twitter:description" content="${escape(description)}" /><meta name="twitter:image" content="${image}" />
</head>`);
}
export function publicMetadataPlugin(): PluginOption {
 return { name: "public-page-metadata", enforce: "post",
 transformIndexHtml(html) { return head(html, "/", pages["/"]); },
 generateBundle(_options, bundle) {
  const index = bundle["index.html"];
  if (!index || index.type !== "asset") return;
  for (const [route, data] of Object.entries(pages)) {
   if (route === "/" || ["/contact", "/privacy-policy", "/terms"].includes(route)) continue;
   this.emitFile({type:"asset",fileName:`${route.slice(1)}.html`,source:head(String(index.source),route,data)});
  }
 }
 };
}
