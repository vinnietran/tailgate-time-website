const test = require("node:test");
const assert = require("node:assert/strict");
const { validateCoordinates, resolveEventTimeZone } = require("../event-time-zone");

test("validates numeric coordinate bounds before contacting Google", async () => {
  for (const coords of [null, { lat: "40", lng: 1 }, { lat: NaN, lng: 1 }, { lat: 91, lng: 1 }, { lat: 0, lng: -181 }]) {
    assert.throws(() => validateCoordinates(coords), /invalid-coordinates/);
  }
  assert.deepEqual(validateCoordinates({ lat: 0, lng: 0 }), { lat: 0, lng: 0 });
});

test("returns an IANA zone only, ignoring current offsets", async () => {
  const result = await resolveEventTimeZone({ lat: 32.78, lng: -96.8 }, "test-secret", async (url, options) => {
    assert.equal(url.origin, "https://maps.googleapis.com");
    assert.equal(url.searchParams.get("location"), "32.78,-96.8");
    assert.equal(url.searchParams.get("key"), "test-secret");
    assert.ok(options.signal);
    return { ok: true, json: async () => ({ status: "OK", timeZoneId: "America/Chicago", rawOffset: -21600, dstOffset: 3600 }) };
  });
  assert.deepEqual(result, { timeZone: "America/Chicago" });
});

test("rejects missing keys, failed lookups, and invalid zone IDs", async () => {
  await assert.rejects(resolveEventTimeZone({ lat: 0, lng: 0 }, ""), /unavailable/);
  for (const payload of [{ status: "ZERO_RESULTS" }, { status: "REQUEST_DENIED" }, { status: "OK", timeZoneId: "Not/AZone" }]) {
    await assert.rejects(resolveEventTimeZone({ lat: 0, lng: 0 }, "test", async () => ({ ok: true, json: async () => payload })), /unavailable/);
  }
});
