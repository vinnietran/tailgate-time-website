const GOOGLE_MAPS_SCRIPT_ID = "tailgatetime-google-maps-sdk";

let mapsLoadPromise: Promise<any> | null = null;

function getGoogleMaps() {
  return (window as { google?: { maps?: any } }).google?.maps ?? null;
}

export async function loadGoogleMapsSdk(
  mapsApiKey: string,
  libraries: string[] = ["places"]
): Promise<any> {
  const key = mapsApiKey.trim();
  if (!key) {
    throw new Error("MAPS_API_KEY is required.");
  }

  const existingMaps = getGoogleMaps();
  if (existingMaps) {
    if (libraries.length > 0 && typeof existingMaps.importLibrary === "function") {
      await Promise.all(libraries.map((library) => existingMaps.importLibrary(library)));
    }
    return existingMaps;
  }

  if (!mapsLoadPromise) {
    mapsLoadPromise = new Promise<any>((resolve, reject) => {
      const onReady = async () => {
        const maps = getGoogleMaps();
        if (!maps) {
          reject(new Error("Google Maps SDK loaded but maps object is unavailable."));
          return;
        }
        try {
          if (libraries.length > 0 && typeof maps.importLibrary === "function") {
            await Promise.all(libraries.map((library) => maps.importLibrary(library)));
          }
          resolve(maps);
        } catch (error) {
          reject(error);
        }
      };

      const onError = () => {
        reject(new Error("Failed to load Google Maps SDK."));
      };

      const existingScript = document.getElementById(
        GOOGLE_MAPS_SCRIPT_ID
      ) as HTMLScriptElement | null;
      if (existingScript) {
        existingScript.addEventListener("load", () => void onReady(), { once: true });
        existingScript.addEventListener("error", onError, { once: true });
        return;
      }

      const script = document.createElement("script");
      script.id = GOOGLE_MAPS_SCRIPT_ID;
      script.async = true;
      script.defer = true;

      const params = new URLSearchParams({
        key
      });
      if (libraries.length > 0) {
        params.set("libraries", Array.from(new Set(libraries)).join(","));
      }
      script.src = `https://maps.googleapis.com/maps/api/js?${params.toString()}`;

      script.addEventListener("load", () => void onReady(), { once: true });
      script.addEventListener("error", onError, { once: true });
      document.head.appendChild(script);
    });
  }

  return mapsLoadPromise;
}
