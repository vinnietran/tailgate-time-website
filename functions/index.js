const { initializeApp } = require("firebase-admin/app");
const { getFirestore, FieldValue, Timestamp } = require("firebase-admin/firestore");
const { onCall, onRequest, HttpsError } = require("firebase-functions/v2/https");
const { onDocumentCreated } = require("firebase-functions/v2/firestore");

initializeApp();
const db = getFirestore();
const REGION = "us-central1";
const PUBLIC_VISIBILITIES = new Set(["open_free", "open_paid"]);
const RESERVED_SLUGS = new Set(["admin", "api", "dashboard", "discover", "help", "login", "new", "signup", "support"]);

function firstString(...values) {
  return values.find((value) => typeof value === "string" && value.trim())?.trim();
}

function normalizeSlug(value) {
  return String(value || "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 64)
    .replace(/-$/g, "");
}

function safeUrl(value) {
  const candidate = firstString(value);
  if (!candidate) return undefined;
  if (/^https:\/\//i.test(candidate) || candidate.startsWith("/")) return candidate.slice(0, 2000);
  return undefined;
}

function safeUrlArray(value, limit = 8) {
  if (!Array.isArray(value)) return [];
  return value.map(safeUrl).filter(Boolean).slice(0, limit);
}

function publicProfile(id, data) {
  return {
    hostId: id,
    enabled: data.enabled !== false,
    slug: firstString(data.slug) || "",
    displayName: firstString(data.displayName) || "Tailgate Host",
    tagline: firstString(data.tagline),
    description: firstString(data.description),
    logoUrl: safeUrl(data.logoUrl),
    coverImageUrl: safeUrl(data.coverImageUrl),
    galleryImageUrls: safeUrlArray(data.galleryImageUrls),
    location: firstString(data.location),
    publicPageSetupCompleted: data.publicPageSetupCompleted === true
  };
}

async function initializeHostProfile(hostId, source = {}) {
  const profileRef = db.doc(`hostProfiles/${hostId}`);
  const existing = await profileRef.get();
  if (existing.exists) return publicProfile(hostId, existing.data());

  const userSnapshot = await db.doc(`users/${hostId}`).get();
  const user = userSnapshot.exists ? userSnapshot.data() : {};
  const displayName = firstString(
    source.hostName,
    source.displayName,
    user.displayName,
    user.name,
    user.fullName
  ) || "Tailgate Host";
  const logoUrl = safeUrl(firstString(user.photoURL, user.profilePhotoURL, user.avatarUrl));
  const base = normalizeSlug(displayName) || "tailgate-host";

  for (let suffix = 1; suffix < 10000; suffix += 1) {
    const slug = suffix === 1 ? base : `${base}-${suffix}`;
    if (RESERVED_SLUGS.has(slug)) continue;
    const claimRef = db.doc(`hostSlugClaims/${slug}`);
    try {
      const created = await db.runTransaction(async (transaction) => {
        const [profileDoc, claimDoc] = await Promise.all([
          transaction.get(profileRef),
          transaction.get(claimRef)
        ]);
        if (profileDoc.exists) return publicProfile(hostId, profileDoc.data());
        if (claimDoc.exists && claimDoc.data().hostId !== hostId) {
          throw new Error("slug-claimed");
        }
        const now = FieldValue.serverTimestamp();
        const record = {
          enabled: true,
          slug,
          displayName,
          ...(logoUrl ? { logoUrl } : {}),
          publicPageSetupCompleted: false,
          createdAt: now,
          updatedAt: now
        };
        transaction.set(profileRef, record);
        transaction.set(claimRef, { hostId, canonicalSlug: slug, createdAt: now });
        return { ...publicProfile(hostId, record), slug };
      });
      console.info("host_profile_initialized", { hostId, slug: created.slug });
      return created;
    } catch (error) {
      if (error.message !== "slug-claimed") throw error;
    }
  }
  throw new Error(`Unable to allocate a slug for host ${hostId}`);
}

function requireAuth(request) {
  if (!request.auth?.uid) throw new HttpsError("unauthenticated", "Sign in to manage a Host Page.");
  return request.auth.uid;
}

async function requireHostAccess(hostId) {
  const [profileDoc, userDoc] = await Promise.all([
    db.doc(`hostProfiles/${hostId}`).get(),
    db.doc(`users/${hostId}`).get()
  ]);
  if (profileDoc.exists) return;
  const user = userDoc.exists ? userDoc.data() : {};
  if (
    user.isHost === true ||
    user.host === true ||
    ["host", "admin"].includes(String(user.role || "").toLowerCase())
  ) return;
  for (const field of ["hostUserId", "hostId", "ownerId", "createdByUid"]) {
    const owned = await db.collection("tailgateEvents").where(field, "==", hostId).limit(1).get();
    if (!owned.empty) return;
  }
  throw new HttpsError("permission-denied", "Create or own a tailgate before managing a Host Page.");
}

exports.ensureHostProfile = onCall({ region: REGION }, async (request) => {
  const hostId = requireAuth(request);
  await requireHostAccess(hostId);
  return initializeHostProfile(hostId);
});

exports.saveHostProfile = onCall({ region: REGION }, async (request) => {
  const hostId = requireAuth(request);
  await requireHostAccess(hostId);
  const current = await initializeHostProfile(hostId);
  const input = request.data || {};
  const slug = normalizeSlug(input.slug);
  const displayName = firstString(input.displayName);
  if (!displayName || displayName.length > 100) {
    throw new HttpsError("invalid-argument", "Enter a host name of 100 characters or fewer.");
  }
  if (slug.length < 3 || RESERVED_SLUGS.has(slug) || slug !== String(input.slug || "").trim().toLowerCase()) {
    throw new HttpsError("invalid-argument", "Choose a valid, non-reserved Host Page URL.");
  }

  const nextClaimRef = db.doc(`hostSlugClaims/${slug}`);
  const profileRef = db.doc(`hostProfiles/${hostId}`);
  await db.runTransaction(async (transaction) => {
    const [profileDoc, nextClaimDoc] = await Promise.all([
      transaction.get(profileRef),
      transaction.get(nextClaimRef)
    ]);
    if (!profileDoc.exists) throw new HttpsError("not-found", "Host profile was not found.");
    if (nextClaimDoc.exists && nextClaimDoc.data().hostId !== hostId) {
      throw new HttpsError("already-exists", "That Host Page URL is already in use.");
    }

    const previousSlug = firstString(profileDoc.data().slug);
    const now = FieldValue.serverTimestamp();
    transaction.set(nextClaimRef, { hostId, canonicalSlug: slug, updatedAt: now }, { merge: true });
    if (previousSlug && previousSlug !== slug) {
      // Keep the old claim as a permanent alias so shared links can 301 to the new URL.
      transaction.set(db.doc(`hostSlugClaims/${previousSlug}`), {
        hostId,
        canonicalSlug: slug,
        redirectedAt: now
      }, { merge: true });
    }
    transaction.set(profileRef, {
      displayName,
      slug,
      tagline: firstString(input.tagline)?.slice(0, 140) || FieldValue.delete(),
      description: firstString(input.description)?.slice(0, 3000) || FieldValue.delete(),
      location: firstString(input.location)?.slice(0, 120) || FieldValue.delete(),
      logoUrl: safeUrl(input.logoUrl) || FieldValue.delete(),
      coverImageUrl: safeUrl(input.coverImageUrl) || FieldValue.delete(),
      galleryImageUrls: safeUrlArray(input.galleryImageUrls).length
        ? safeUrlArray(input.galleryImageUrls)
        : FieldValue.delete(),
      enabled: true,
      publicPageSetupCompleted: true,
      updatedAt: now
    }, { merge: true });
  });
  const saved = await profileRef.get();
  console.info("host_profile_saved", { hostId, previousSlug: current.slug, slug });
  return publicProfile(hostId, saved.data());
});

function asDate(value) {
  if (!value) return null;
  if (value instanceof Timestamp) return value.toDate();
  if (typeof value.toDate === "function") return value.toDate();
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function eventStart(data) {
  for (const value of [data.startDateTime, data.dateTime, data.eventTargetTime, data.startAt, data.eventDateTime, data.eventDate, data.date]) {
    const date = asDate(value);
    if (date) return date;
  }
  return null;
}

function eventVisibility(data) {
  const raw = String(data.visibilityType || "").toLowerCase();
  if (PUBLIC_VISIBILITIES.has(raw)) return raw;
  if (raw === "private" || data.isPrivate === true || String(data.accessType || "").toLowerCase() === "invite_only") return "private";
  const price = Number(data.ticketPriceCents ?? data.priceCents ?? data.ticketPrice ?? 0);
  return price > 0 ? "open_paid" : "open_free";
}

function eventStatus(data) {
  return String(data.status || data.eventStatus || "").trim().toLowerCase();
}

function normalizeEvent(snapshot) {
  const data = snapshot.data();
  const start = eventStart(data);
  const end = asDate(data.endDateTime || data.endAt || data.eventEndAt);
  return {
    id: snapshot.id,
    hostUserId: firstString(data.hostUserId, data.hostId, data.ownerId, data.createdByUid) || "",
    name: firstString(data.name, data.eventName, data.title) || "Untitled Tailgate",
    visibilityType: eventVisibility(data),
    startDateTime: start?.toISOString(),
    endDateTime: end?.toISOString(),
    coverImageUrl: safeUrl(firstString(data.coverImageUrl, data.coverPhotoUrl, data.imageUrl)),
    locationSummary: firstString(data.locationSummary, data.venueName, data.address, data.displayAddress, data.locationLabel),
    ticketPriceCents: Number(data.ticketPriceCents ?? data.priceCents ?? data.ticketPrice ?? 0),
    currency: firstString(data.currency) || "USD",
    status: eventStatus(data) || "upcoming"
  };
}

async function publicEventsForHost(hostId) {
  const snapshots = await Promise.all(
    ["hostUserId", "hostId", "ownerId", "createdByUid"].map((field) =>
      db.collection("tailgateEvents").where(field, "==", hostId).get()
    )
  );
  const unique = new Map();
  snapshots.forEach((result) => result.docs.forEach((doc) => unique.set(doc.id, doc)));
  const now = Date.now();
  return Array.from(unique.values())
    .map(normalizeEvent)
    .filter((event) => {
      const status = event.status;
      return PUBLIC_VISIBILITIES.has(event.visibilityType) &&
        event.startDateTime && new Date(event.startDateTime).getTime() >= now &&
        status !== "cancelled" && status !== "canceled" && !status.startsWith("cancel") &&
        status !== "deleted";
    })
    .sort((a, b) => new Date(a.startDateTime) - new Date(b.startDateTime));
}

async function resolvePage(slug) {
  const normalized = normalizeSlug(slug);
  if (!normalized || normalized !== slug) return null;
  const claim = await db.doc(`hostSlugClaims/${normalized}`).get();
  if (!claim.exists) return null;
  const hostId = claim.data().hostId;
  const profileDoc = await db.doc(`hostProfiles/${hostId}`).get();
  if (!profileDoc.exists || profileDoc.data().enabled === false) return null;
  const profile = publicProfile(hostId, profileDoc.data());
  return {
    profile,
    canonicalSlug: firstString(claim.data().canonicalSlug) || profile.slug,
    upcomingTailgates: await publicEventsForHost(hostId)
  };
}

exports.getPublicHostPage = onCall({ region: REGION }, async (request) => {
  const slug = normalizeSlug(request.data?.slug);
  const page = await resolvePage(slug);
  if (!page) throw new HttpsError("not-found", "Host page not found.");
  if (page.canonicalSlug !== slug) {
    throw new HttpsError("failed-precondition", `This Host Page moved to /hosts/${page.canonicalSlug}.`);
  }
  const { hostId: _hostId, ...profile } = page.profile;
  const upcomingTailgates = page.upcomingTailgates.map(
    ({ hostUserId: _eventHostId, ...event }) => event
  );
  return { profile, upcomingTailgates };
});

exports.initializeHostProfileOnFirstEvent = onDocumentCreated(
  { document: "tailgateEvents/{eventId}", region: REGION },
  async (event) => {
    const data = event.data?.data() || {};
    const hostId = firstString(data.hostUserId, data.hostId, data.ownerId, data.createdByUid);
    if (!hostId) {
      console.warn("host_profile_initialization_skipped", { eventId: event.params.eventId, reason: "missing_host_id" });
      return;
    }
    await initializeHostProfile(hostId, data);
  }
);

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[character]);
}

function formatDate(value) {
  return new Intl.DateTimeFormat("en-US", { dateStyle: "full", timeStyle: "short" }).format(new Date(value));
}

function renderHtml(page, origin) {
  const { profile, upcomingTailgates } = page;
  const canonical = `${origin}/hosts/${encodeURIComponent(profile.slug)}`;
  const description = (profile.description || `Find upcoming tailgates hosted by ${profile.displayName} on TailgateTime. View events, tickets, locations, and more.`).replace(/\s+/g, " ").slice(0, 160);
  const image = profile.coverImageUrl || profile.logoUrl || `${origin}/ttnobg.png`;
  const gallery = (profile.galleryImageUrls || []).map(
    (url, index) => `<img src="${escapeHtml(url)}" alt="${escapeHtml(profile.displayName)} gallery image ${index + 1}" loading="lazy">`
  ).join("");
  const cards = upcomingTailgates.map((event) => `<a class="event" href="/tailgates/${encodeURIComponent(event.id)}"><div class="event-image"${event.coverImageUrl ? ` style="background-image:url('${escapeHtml(event.coverImageUrl)}')"` : ""}></div><div class="event-copy"><span>${event.visibilityType === "open_free" ? "Free" : event.ticketPriceCents ? `From $${(event.ticketPriceCents / 100).toFixed(2)}` : "Paid"}</span><h3>${escapeHtml(event.name)}</h3><p>${escapeHtml(formatDate(event.startDateTime))}</p><p>${escapeHtml(event.locationSummary || "Location coming soon")}</p><strong>View tailgate →</strong></div></a>`).join("");
  const schema = JSON.stringify({ "@context": "https://schema.org", "@type": "Organization", name: profile.displayName, description, url: canonical, logo: profile.logoUrl, image }).replace(/</g, "\\u003c");
  const sharePayload = JSON.stringify({ title: profile.displayName, url: canonical }).replace(/</g, "\\u003c");

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${escapeHtml(profile.displayName)} | TailgateTime</title>
  <meta name="description" content="${escapeHtml(description)}">
  <link rel="canonical" href="${escapeHtml(canonical)}">
  <meta property="og:type" content="profile">
  <meta property="og:title" content="${escapeHtml(profile.displayName)} | TailgateTime">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:url" content="${escapeHtml(canonical)}">
  <meta property="og:image" content="${escapeHtml(image)}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(profile.displayName)} | TailgateTime">
  <meta name="twitter:description" content="${escapeHtml(description)}">
  <meta name="twitter:image" content="${escapeHtml(image)}">
  <script type="application/ld+json">${schema}</script>
  <style>
    *{box-sizing:border-box}body{margin:0;color:#172844;font-family:system-ui,-apple-system,sans-serif;background:radial-gradient(850px 520px at -4% 8%,rgba(242,201,76,.25),transparent 65%),radial-gradient(720px 480px at 102% 28%,rgba(79,209,197,.17),transparent 68%),radial-gradient(620px 420px at 48% 92%,rgba(65,100,144,.14),transparent 72%),repeating-linear-gradient(90deg,transparent 0 119px,rgba(34,56,91,.035) 120px 121px),linear-gradient(145deg,#f9fbff 0%,#edf3fb 52%,#e7eef8 100%);background-attachment:fixed}body::before{content:"";position:fixed;inset:0;pointer-events:none;background:linear-gradient(115deg,transparent 0 46%,rgba(255,255,255,.34) 46.2% 46.8%,transparent 47%),radial-gradient(circle at 50% 0,rgba(255,255,255,.72),transparent 36%);opacity:.7}body>*{position:relative}a{color:inherit}
    .public-nav-shell{padding:18px 16px 0}.public-nav{width:min(1120px,100%);min-height:70px;margin:auto;padding:14px 18px;display:flex;align-items:center;gap:18px;border:1px solid #ccd7eb;border-radius:18px;background:rgba(255,255,255,.9);box-shadow:0 10px 24px #1d2f4d14}
    .brand{display:flex;align-items:center;gap:10px;text-decoration:none;font-weight:800}.brand img{width:34px;height:34px;object-fit:contain}.nav-links{display:flex;align-items:center;gap:4px;margin-left:auto}.nav-links a{padding:7px 10px;border-radius:999px;color:#5f7194;text-decoration:none;font-size:.9rem;font-weight:700}.nav-links a:hover{color:#172844;background:#eef3ff}.dashboard-link{padding:10px 16px;border-radius:999px;background:#f2c94c;text-decoration:none;font-size:.9rem;font-weight:800;white-space:nowrap}
    main,footer{max-width:1100px;margin:auto}.hero{min-height:330px;margin-top:28px;padding:44px;border-radius:28px;background:linear-gradient(90deg,rgba(11,27,48,.92),rgba(19,42,70,.45)),url('${escapeHtml(image)}') center/cover;color:white;display:flex;align-items:end;gap:22px;box-shadow:0 26px 60px rgba(20,41,68,.25)}.logo{width:105px;height:105px;object-fit:cover;border-radius:22px;background:white}.hero h1{font-size:clamp(2.3rem,6vw,4.5rem);line-height:1;margin:0}.hero p{font-size:1.1rem}.share{margin-left:auto;border:0;border-radius:99px;padding:12px 18px;color:#172844;background:white;font:inherit;font-weight:800;cursor:pointer}.content{padding:58px 18px 80px}.content>section{padding:30px;border:1px solid rgba(255,255,255,.78);border-radius:26px;background:rgba(255,255,255,.5);box-shadow:0 18px 44px rgba(28,47,77,.075);backdrop-filter:blur(14px)}.content>section+section{margin-top:32px}.about{max-width:820px;white-space:pre-line;line-height:1.7}.gallery{display:grid;grid-template-columns:repeat(4,1fr);grid-auto-rows:180px;gap:12px}.gallery img{width:100%;height:100%;object-fit:cover;border-radius:18px}.gallery img:first-child{grid-column:span 2;grid-row:span 2}.events{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}.event{overflow:hidden;border-radius:20px;background:white;color:#172844;text-decoration:none;box-shadow:0 14px 30px #1a2b4a17}.event-image{aspect-ratio:16/9;background:#dce5f1 center/cover}.event-copy{padding:18px}.event-copy span{color:#987510;font-weight:800}.event-copy h3{margin:8px 0}.event-copy p{color:#637493;margin:6px 0}.event-copy strong{display:block;margin-top:15px}.empty{padding:32px;border:1px dashed #9aabc2;border-radius:18px;text-align:center}
    footer{padding:24px 18px 50px;color:#65758d}.footer-links{display:flex;flex-wrap:wrap;gap:18px;margin-bottom:10px}.footer-links a{text-decoration:none;font-weight:700}
    @media(max-width:850px){.public-nav{flex-wrap:wrap}.nav-links{order:3;width:100%;margin:0;overflow-x:auto}.dashboard-link{margin-left:auto}.hero{margin:18px 10px 0;min-height:420px;padding:25px;flex-direction:column;align-items:flex-start;justify-content:end}.share{margin:0;width:100%}.gallery{grid-template-columns:repeat(2,1fr);grid-auto-rows:140px}.gallery img:first-child{grid-column:span 2;grid-row:span 1}.events{grid-template-columns:1fr}}
  </style>
</head>
<body>
  <header class="public-nav-shell">
    <div class="public-nav">
      <a class="brand" href="/"><img src="/ttnobg.png" alt="TailgateTime"><strong>TailgateTime</strong></a>
      <nav class="nav-links" aria-label="Public site">
        <a href="/">Home</a><a href="/release-2-0">2.0</a><a href="/discover">Discover</a><a href="/contact.html">Contact &amp; Support</a>
      </nav>
      <a class="dashboard-link" href="/dashboard">My Dashboard</a>
    </div>
  </header>
  <main>
    <section class="hero">
      ${profile.logoUrl ? `<img class="logo" src="${escapeHtml(profile.logoUrl)}" alt="${escapeHtml(profile.displayName)} logo">` : ""}
      <div><small>TAILGATETIME HOST</small><h1>${escapeHtml(profile.displayName)}</h1>${profile.tagline ? `<p>${escapeHtml(profile.tagline)}</p>` : ""}${profile.location ? `<small>${escapeHtml(profile.location)}</small>` : ""}</div>
      <button id="share-host-page" class="share" type="button">Share Host Page</button>
    </section>
    <div class="content">
      ${profile.description ? `<section class="about"><small>ABOUT THE HOST</small><h2>Welcome to our tailgate</h2><p>${escapeHtml(profile.description)}</p></section>` : ""}
      ${gallery ? `<section><small>THE EXPERIENCE</small><h2>Tailgate gallery</h2><div class="gallery">${gallery}</div></section>` : ""}
      <section><h2>Upcoming Tailgates</h2>${cards ? `<div class="events">${cards}</div>` : `<div class="empty"><h3>No upcoming tailgates are currently listed.</h3><p>Check back soon.</p></div>`}</section>
    </div>
  </main>
  <footer><div class="footer-links"><a href="/">Home</a><a href="/release-2-0">Release 2.0</a><a href="/discover">Discover</a><a href="/contact.html">Contact &amp; Support</a><a href="/privacy-policy.html">Privacy</a><a href="/terms.html">Terms</a></div>© TailgateTime</footer>
  <script>
    (() => {
      const button = document.getElementById("share-host-page");
      const shareData = ${sharePayload};
      button.addEventListener("click", async () => {
        try {
          if (typeof navigator.share === "function") {
            await navigator.share(shareData);
          } else if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
            await navigator.clipboard.writeText(shareData.url);
            button.textContent = "Link copied";
          } else {
            const input = document.createElement("textarea");
            input.value = shareData.url;
            input.style.position = "fixed";
            input.style.opacity = "0";
            document.body.appendChild(input);
            input.select();
            document.execCommand("copy");
            input.remove();
            button.textContent = "Link copied";
          }
        } catch (error) {
          if (!error || error.name !== "AbortError") button.textContent = "Unable to share";
        }
      });
    })();
  </script>
</body>
</html>`;
}

exports.renderHostPage = onRequest({ region: REGION }, async (request, response) => {
  const slug = normalizeSlug(request.path.split("/").filter(Boolean).pop());
  const page = await resolvePage(slug);
  if (!page) {
    response.status(404).set("Cache-Control", "public, max-age=60").send("Host page not found.");
    return;
  }
  const forwardedHost = firstString(request.get("x-forwarded-host"), request.get("host")) || "tailgatetime.com";
  const origin = `https://${forwardedHost.replace(/[^a-zA-Z0-9.:-]/g, "")}`;
  if (page.canonicalSlug !== slug) {
    response.redirect(301, `${origin}/hosts/${encodeURIComponent(page.canonicalSlug)}`);
    return;
  }
  response.status(200).set({
    // Host profiles are editable. Browsers must revalidate so a saved/deployed
    // change is not hidden behind an older copy of the page.
    "Cache-Control": "public, max-age=0, s-maxage=60, must-revalidate",
    "Content-Type": "text/html; charset=utf-8",
    "X-Robots-Tag": "index, follow"
  }).send(renderHtml(page, origin));
});

exports.renderHostSitemap = onRequest({ region: REGION }, async (_request, response) => {
  const profiles = await db.collection("hostProfiles").where("enabled", "==", true).get();
  const urls = profiles.docs.map((doc) => firstString(doc.data().slug)).filter(Boolean).map((slug) => `<url><loc>https://tailgatetime.com/hosts/${escapeHtml(slug)}</loc></url>`).join("");
  response.status(200).set({ "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, max-age=3600, s-maxage=21600" }).send(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`);
});

module.exports._test = {
  normalizeSlug,
  publicProfile,
  eventVisibility,
  eventStart,
  requireAuth,
  renderHtml
};
