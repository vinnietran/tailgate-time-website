const test = require("node:test");
const assert = require("node:assert/strict");
const { _test } = require("../index");

test("normalizes host slugs deterministically", () => {
  assert.equal(_test.normalizeSlug("East 32 Dolphins Tailgate"), "east-32-dolphins-tailgate");
  assert.equal(_test.normalizeSlug("Café & Crew!!!"), "cafe-crew");
  assert.equal(_test.normalizeSlug("one---two"), "one-two");
});

test("preserves only intentionally public profile fields", () => {
  const profile = _test.publicProfile("host-1", {
    enabled: true,
    slug: "safe-host",
    displayName: "Safe Host",
    email: "private@example.com",
    phone: "555-555-5555",
    stripeAccountId: "acct_private"
    ,galleryImageUrls: [
      "https://example.com/one.jpg",
      "javascript:alert(1)",
      ...Array.from({ length: 9 }, (_, index) => `https://example.com/${index + 2}.jpg`)
    ]
  });
  assert.equal(profile.displayName, "Safe Host");
  assert.equal("email" in profile, false);
  assert.equal("phone" in profile, false);
  assert.equal("stripeAccountId" in profile, false);
  assert.equal(profile.galleryImageUrls.length, 8);
  assert.equal(profile.galleryImageUrls.includes("javascript:alert(1)"), false);
});

test("recognizes free, paid, and private event visibility", () => {
  assert.equal(_test.eventVisibility({ visibilityType: "open_free" }), "open_free");
  assert.equal(_test.eventVisibility({ ticketPriceCents: 2500 }), "open_paid");
  assert.equal(_test.eventVisibility({ isPrivate: true }), "private");
});

test("requires authentication for Host Page writes", () => {
  assert.throws(() => _test.requireAuth({}), /Sign in to manage a Host Page/);
  assert.equal(_test.requireAuth({ auth: { uid: "host-1" } }), "host-1");
});

test("renders host-specific SEO metadata server-side", () => {
  const html = _test.renderHtml({
    profile: {
      hostId: "private-id",
      enabled: true,
      slug: "buffalo-tailgates",
      displayName: "Buffalo Tailgates",
      description: "The best game-day traditions in Buffalo.",
      galleryImageUrls: ["https://example.com/gallery.jpg"],
      publicPageSetupCompleted: true
    },
    upcomingTailgates: []
  }, "https://tailgatetime.com");
  assert.match(html, /<title>Buffalo Tailgates \| TailgateTime<\/title>/);
  assert.match(html, /rel="canonical" href="https:\/\/tailgatetime.com\/hosts\/buffalo-tailgates"/);
  assert.match(html, /application\/ld\+json/);
  assert.match(html, /Tailgate gallery/);
  assert.match(html, /https:\/\/example.com\/gallery.jpg/);
  assert.doesNotMatch(html, /private-id/);
});

test("renders the full navigation and a quote-safe share handler", () => {
  const html = _test.renderHtml({
    profile: {
      hostId: "private-id",
      enabled: true,
      slug: "quoted-host",
      displayName: "Vinnie's \"Best\" Tailgate",
      publicPageSetupCompleted: true
    },
    upcomingTailgates: []
  }, "https://tailgatetime.com");

  assert.match(html, /class="public-nav"/);
  assert.match(html, />Discover<\/a>/);
  assert.match(html, />My Dashboard<\/a>/);
  assert.match(html, /id="share-host-page"/);
  assert.match(html, /button\.addEventListener\("click"/);
  assert.match(html, /Vinnie's \\"Best\\" Tailgate/);
  assert.doesNotMatch(html, /onclick=/);
  assert.doesNotMatch(html, /this\.textContent/);
});
