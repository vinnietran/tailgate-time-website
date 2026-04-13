import { defineConfig, type PluginOption } from "vite";
import react from "@vitejs/plugin-react";

const META_PIXEL_ID = "792534783287779";

function metaPixelPlugin(enabled: boolean): PluginOption {
  return {
    name: "tailgatetime-meta-pixel",
    transformIndexHtml(html) {
      if (!enabled) {
        return html;
      }

      return {
        html,
        tags: [
          {
            tag: "script",
            injectTo: "head",
            children: `!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${META_PIXEL_ID}');
fbq('track', 'PageView');`
          },
          {
            tag: "noscript",
            injectTo: "body-prepend",
            children: `<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1" />`
          }
        ]
      };
    }
  };
}

export default defineConfig(({ mode }) => ({
  plugins: [react(), metaPixelPlugin(mode === "tailgatetime-prod")],
  base: "./",
  envPrefix: ["VITE_", "MAPS_"],
  server: {
    proxy: {
      "/functions/tailgatetime-prod": {
        target: "https://us-central1-tailgatetime-prod.cloudfunctions.net",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/functions\/tailgatetime-prod/, "")
      },
      "/functions/lot-legends": {
        target: "https://us-central1-lot-legends.cloudfunctions.net",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/functions\/lot-legends/, "")
      }
    }
  }
}));
