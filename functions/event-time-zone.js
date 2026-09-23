// Google credentials stay on the server; callers receive only an IANA zone ID.
function validateCoordinates(data) {
  const { lat, lng } = data || {};
  if (typeof lat !== "number" || !Number.isFinite(lat) || lat < -90 || lat > 90 ||
      typeof lng !== "number" || !Number.isFinite(lng) || lng < -180 || lng > 180) {
    throw new Error("invalid-coordinates");
  }
  return { lat, lng };
}

async function resolveEventTimeZone(data, apiKey, fetchImpl = fetch) {
  const { lat, lng } = validateCoordinates(data);
  if (!apiKey) throw new Error("unavailable");
  const url = new URL("https://maps.googleapis.com/maps/api/timezone/json");
  url.searchParams.set("location", `${lat},${lng}`);
  // Only the zone ID is used. DST offsets are resolved for each event date by the client.
  url.searchParams.set("timestamp", String(Math.floor(Date.now() / 1000)));
  url.searchParams.set("key", apiKey);
  const response = await fetchImpl(url, { signal: AbortSignal.timeout(8000) });
  if (!response.ok) throw new Error("unavailable");
  const result = await response.json();
  if (result.status !== "OK" || typeof result.timeZoneId !== "string") {
    throw new Error("unavailable");
  }
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: result.timeZoneId }).format();
  } catch {
    throw new Error("unavailable");
  }
  return { timeZone: result.timeZoneId };
}

module.exports = { validateCoordinates, resolveEventTimeZone };
