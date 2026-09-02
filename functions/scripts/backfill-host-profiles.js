const { initializeApp, applicationDefault } = require("firebase-admin/app");
const { getFirestore, FieldValue } = require("firebase-admin/firestore");

initializeApp({ credential: applicationDefault() });
const db = getFirestore();

function firstString(...values) {
  return values.find((value) => typeof value === "string" && value.trim())?.trim();
}

function slugify(value) {
  return String(value || "tailgate-host").normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 64) || "tailgate-host";
}

async function backfillHost(hostId, eventData) {
  const profileRef = db.doc(`hostProfiles/${hostId}`);
  if ((await profileRef.get()).exists) return "existing";
  const userDoc = await db.doc(`users/${hostId}`).get();
  const user = userDoc.exists ? userDoc.data() : {};
  const displayName = firstString(eventData.hostName, user.displayName, user.name, user.fullName) || "Tailgate Host";
  const base = slugify(displayName);
  for (let suffix = 1; suffix < 10000; suffix += 1) {
    const slug = suffix === 1 ? base : `${base}-${suffix}`;
    const claimRef = db.doc(`hostSlugClaims/${slug}`);
    try {
      return await db.runTransaction(async (transaction) => {
        const [profile, claim] = await Promise.all([transaction.get(profileRef), transaction.get(claimRef)]);
        if (profile.exists) return "existing";
        if (claim.exists && claim.data().hostId !== hostId) throw new Error("claimed");
        const now = FieldValue.serverTimestamp();
        transaction.set(profileRef, { enabled: true, slug, displayName, ...(firstString(user.photoURL, user.profilePhotoURL) ? { logoUrl: firstString(user.photoURL, user.profilePhotoURL) } : {}), publicPageSetupCompleted: false, createdAt: now, updatedAt: now });
        transaction.set(claimRef, { hostId, canonicalSlug: slug, createdAt: now });
        return "created";
      });
    } catch (error) {
      if (error.message !== "claimed") throw error;
    }
  }
  throw new Error(`No slug available for ${hostId}`);
}

async function run() {
  const events = await db.collection("tailgateEvents").get();
  const hosts = new Map();
  events.docs.forEach((doc) => {
    const data = doc.data();
    const hostId = firstString(data.hostUserId, data.hostId, data.ownerId, data.createdByUid);
    if (hostId && !hosts.has(hostId)) hosts.set(hostId, data);
  });
  const summary = { created: 0, existing: 0, failed: 0 };
  for (const [hostId, eventData] of hosts) {
    try {
      const status = await backfillHost(hostId, eventData);
      summary[status] += 1;
      console.info("host_backfill", { hostId, status });
    } catch (error) {
      summary.failed += 1;
      console.error("host_backfill_failed", { hostId, message: error.message });
    }
  }
  console.info("host_backfill_complete", summary);
  if (summary.failed) process.exitCode = 1;
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
