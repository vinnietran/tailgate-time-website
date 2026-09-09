const { FieldValue, Timestamp } = require("firebase-admin/firestore");
const { HttpsError } = require("firebase-functions/v2/https");

const ANALYTICS_EVENT_NAMES = new Set([
  "paid_tailgate_impression",
  "paid_tailgate_view",
  "ticket_type_selected",
  "checkout_started",
  "purchase_completed"
]);
const SUCCESSFUL_PURCHASE_STATUSES = new Set([
  "confirmed",
  "paid",
  "succeeded",
  "completed",
  "purchase_succeeded"
]);
const SOURCE_NAMES = new Set([
  "discover",
  "search",
  "map",
  "host_page",
  "host_share",
  "game_page",
  "direct_link",
  "instagram",
  "facebook",
  "google",
  "email",
  "push_notification",
  "other"
]);
const MAX_REPORT_DAYS = 366;
const MAX_ANALYTICS_ROWS = 20000;
const MAX_PURCHASE_ROWS = 20000;

function asRecord(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

function firstString(...values) {
  return values.find((value) => typeof value === "string" && value.trim())?.trim() || "";
}

function limitedString(value, maxLength = 160) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function numberValue(value, fallback = 0) {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function normalizeToken(value) {
  return limitedString(value, 80).toLowerCase().replace(/[\s-]+/g, "_");
}

function normalizeDate(value) {
  if (!value) return null;
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value;
  if (typeof value.toDate === "function") {
    const date = value.toDate();
    return Number.isNaN(date.getTime()) ? null : date;
  }
  if (typeof value.seconds === "number") return new Date(value.seconds * 1000);
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function resolveEventDate(data) {
  for (const value of [
    data.dateTime,
    data.eventTargetTime,
    data.startDateTime,
    data.startTime,
    data.startAt,
    data.eventDateTime,
    data.tailgateStartAt,
    data.eventDate,
    data.date
  ]) {
    const date = normalizeDate(value);
    if (date) return date;
  }
  return null;
}

function resolvePurchaseDate(data) {
  for (const value of [data.confirmedAt, data.completedAt, data.paidAt, data.updatedAt, data.createdAt]) {
    const date = normalizeDate(value);
    if (date) return date;
  }
  return null;
}

function resolveTailgateId(data) {
  const event = asRecord(data.event);
  const tailgate = asRecord(data.tailgate);
  return firstString(
    data.tailgateId,
    data.tailgateEventId,
    data.eventId,
    event.tailgateId,
    event.id,
    tailgate.tailgateId,
    tailgate.id
  );
}

function resolvePurchaseStatus(data) {
  return normalizeToken(
    firstString(data.status, data.paymentStatus, data.checkoutStatus, data.purchaseStatus, data.chargeStatus)
  ) || "unknown";
}

function isSuccessfulPurchase(data) {
  return SUCCESSFUL_PURCHASE_STATUSES.has(resolvePurchaseStatus(data));
}

function resolvePurchaseAmountCents(data) {
  for (const value of [
    data.totalPaidCents,
    data.amountPaidCents,
    data.totalAmountCents,
    data.chargeAmountCents,
    data.amountCents,
    data.paymentAmountCents
  ]) {
    const amount = numberValue(value, -1);
    if (amount >= 0) return Math.round(amount);
  }
  return 0;
}

function resolvePlatformFeeCents(data) {
  for (const value of [
    data.platformFeeCents,
    data.platformFeeAmountCents,
    data.applicationFeeCents,
    data.applicationFeeAmount,
    data.tailgateTimeFeeCents
  ]) {
    const amount = numberValue(value, -1);
    if (amount >= 0) return Math.round(amount);
  }
  return 0;
}

function resolvePurchaseQuantity(data) {
  return Math.max(1, Math.round(numberValue(data.quantity, 1)));
}

function resolveTicketTypeId(data) {
  return firstString(
    data.ticketTypeId,
    data.ticket_type_id,
    asRecord(data.ticketType).id,
    asRecord(data.ticket).ticketTypeId,
    asRecord(data.metadata).ticketTypeId
  );
}

function resolveRange(input = {}, now = new Date()) {
  const preset = firstString(input.preset) || "last_30_days";
  const end = normalizeDate(input.end) || now;
  let start;
  if (preset === "last_7_days") start = new Date(end.getTime() - 6 * 86400000);
  else if (preset === "this_season") {
    const seasonYear = end.getMonth() < 7 ? end.getFullYear() - 1 : end.getFullYear();
    start = new Date(seasonYear, 7, 1);
  }
  else if (preset === "custom") start = normalizeDate(input.start);
  else start = new Date(end.getTime() - 29 * 86400000);
  if (!start || start > end) throw new HttpsError("invalid-argument", "Choose a valid analytics date range.");
  const earliest = new Date(end.getTime() - (MAX_REPORT_DAYS - 1) * 86400000);
  if (start < earliest) throw new HttpsError("invalid-argument", "Analytics ranges are limited to 366 days.");
  start.setHours(0, 0, 0, 0);
  end.setHours(23, 59, 59, 999);
  return { start, end, preset };
}

function conversion(numerator, denominator) {
  return denominator > 0 ? numerator / denominator : null;
}

function dayKey(date) {
  return date.toISOString().slice(0, 10);
}

function weekKey(date) {
  const copy = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  copy.setUTCDate(copy.getUTCDate() - ((copy.getUTCDay() + 6) % 7));
  return dayKey(copy);
}

function createFunnelStage(name) {
  return { name, eventCount: 0, visitors: new Set() };
}

function normalizeEventDoc(id, data) {
  const ticketTypes = Array.isArray(data.ticketTypes)
    ? data.ticketTypes.slice(0, 12).map((value, index) => {
        const ticket = asRecord(value);
        return {
          id: firstString(ticket.id, ticket.ticketTypeId) || `ticket-${index + 1}`,
          name: firstString(ticket.name, ticket.title) || `Ticket ${index + 1}`,
          priceCents: Math.max(0, Math.round(numberValue(ticket.priceCents, ticket.price || 0)))
        };
      })
    : [];
  return {
    id,
    eventName: firstString(data.name, data.eventName, data.title) || "Untitled tailgate",
    gameContext: firstString(data.gameName, data.gameLabel, data.teamName, data.matchup, data.gameContext) || "—",
    hostId: firstString(data.hostUserId, data.hostId, data.ownerId, data.createdByUid),
    hostName: firstString(data.hostName, data.hostDisplayName, data.createdByName) || "Unknown host",
    eventDate: resolveEventDate(data),
    ticketTypes
  };
}

function buildDashboardFromRecords({ eventDocs, analyticsDocs, purchaseDocs, range }) {
  const events = eventDocs
    .filter(({ data }) => normalizeToken(data.visibilityType) === "open_paid")
    .map(({ id, data }) => normalizeEventDoc(id, data));
  const eventsById = new Map(events.map((event) => [event.id, {
    ...event,
    impressions: 0,
    views: 0,
    ticketSelections: 0,
    checkoutStarts: 0,
    completedOrders: 0,
    ticketsSold: 0,
    grossRevenueCents: 0,
    platformFeeRevenueCents: 0,
    ticketSales: new Map(),
    sources: new Map()
  }]));
  const funnel = [
    createFunnelStage("paid_tailgate_impression"),
    createFunnelStage("paid_tailgate_view"),
    createFunnelStage("ticket_type_selected"),
    createFunnelStage("checkout_started"),
    createFunnelStage("purchase_completed")
  ];
  const funnelByName = new Map(funnel.map((stage) => [stage.name, stage]));
  const sources = new Map();
  const trends = new Map();
  const purchaseSourcesById = new Map();
  const rangeDays = Math.ceil((range.end.getTime() - range.start.getTime()) / 86400000) + 1;
  const trendKey = rangeDays > 60 ? weekKey : dayKey;
  let analyticsStartedAt = null;

  for (const row of analyticsDocs) {
    const data = row.data;
    const occurredAt = normalizeDate(data.occurredAt);
    if (!occurredAt || occurredAt < range.start || occurredAt > range.end) continue;
    if (!analyticsStartedAt || occurredAt < analyticsStartedAt) analyticsStartedAt = occurredAt;
    const event = eventsById.get(firstString(data.tailgateId));
    const eventName = firstString(data.eventName);
    const stage = funnelByName.get(eventName);
    if (!event || !stage) continue;
    const visitorId = firstString(data.userId, data.visitorId) || `event:${row.id}`;
    stage.eventCount += 1;
    stage.visitors.add(visitorId);
    if (eventName === "paid_tailgate_impression") event.impressions += 1;
    if (eventName === "paid_tailgate_view") event.views += 1;
    if (eventName === "ticket_type_selected") event.ticketSelections += 1;
    if (eventName === "checkout_started") event.checkoutStarts += 1;
    const source = SOURCE_NAMES.has(normalizeToken(data.source)) ? normalizeToken(data.source) : "other";
    const eventSource = event.sources.get(source) || { source, views: 0, checkoutStarts: 0, purchases: 0, revenueCents: 0 };
    const sourceTotal = sources.get(source) || { source, views: 0, checkoutStarts: 0, purchases: 0, revenueCents: 0 };
    if (eventName === "paid_tailgate_view") { eventSource.views += 1; sourceTotal.views += 1; }
    if (eventName === "checkout_started") { eventSource.checkoutStarts += 1; sourceTotal.checkoutStarts += 1; }
    if (eventName === "purchase_completed") {
      eventSource.purchases += 1;
      sourceTotal.purchases += 1;
      const purchaseId = firstString(data.purchaseId);
      if (purchaseId) purchaseSourcesById.set(purchaseId, source);
    }
    event.sources.set(source, eventSource);
    sources.set(source, sourceTotal);
    const key = trendKey(occurredAt);
    const bucket = trends.get(key) || { date: key, views: 0, checkoutStarts: 0, purchases: 0, grossRevenueCents: 0 };
    if (eventName === "paid_tailgate_view") bucket.views += 1;
    if (eventName === "checkout_started") bucket.checkoutStarts += 1;
    trends.set(key, bucket);
  }

  for (const row of purchaseDocs) {
    const data = row.data;
    const purchaseDate = resolvePurchaseDate(data);
    if (!purchaseDate || purchaseDate < range.start || purchaseDate > range.end || !isSuccessfulPurchase(data)) continue;
    const event = eventsById.get(resolveTailgateId(data));
    if (!event) continue;
    const amountCents = resolvePurchaseAmountCents(data);
    const platformFeeCents = resolvePlatformFeeCents(data);
    const quantity = resolvePurchaseQuantity(data);
    event.completedOrders += 1;
    event.ticketsSold += quantity;
    event.grossRevenueCents += amountCents;
    event.platformFeeRevenueCents += platformFeeCents;
    const ticketTypeId = resolveTicketTypeId(data) || "unknown";
    const ticketSale = event.ticketSales.get(ticketTypeId) || { ticketTypeId, ticketsSold: 0, revenueCents: 0 };
    ticketSale.ticketsSold += quantity;
    ticketSale.revenueCents += amountCents;
    event.ticketSales.set(ticketTypeId, ticketSale);
    const purchaseSource = normalizeToken(data.source);
    const trackedSource = purchaseSourcesById.get(row.id);
    const source = SOURCE_NAMES.has(purchaseSource) ? purchaseSource : trackedSource || "other";
    const eventSource = event.sources.get(source) || { source, views: 0, checkoutStarts: 0, purchases: 0, revenueCents: 0 };
    const sourceTotal = sources.get(source) || { source, views: 0, checkoutStarts: 0, purchases: 0, revenueCents: 0 };
    if (!trackedSource) eventSource.purchases += 1;
    eventSource.revenueCents += amountCents;
    if (!trackedSource) sourceTotal.purchases += 1;
    sourceTotal.revenueCents += amountCents;
    event.sources.set(source, eventSource);
    sources.set(source, sourceTotal);
    const key = trendKey(purchaseDate);
    const bucket = trends.get(key) || { date: key, views: 0, checkoutStarts: 0, purchases: 0, grossRevenueCents: 0 };
    bucket.purchases += 1;
    bucket.grossRevenueCents += amountCents;
    trends.set(key, bucket);
  }

  const normalizedEvents = Array.from(eventsById.values()).map((event) => {
    const ticketTypesById = new Map(event.ticketTypes.map((ticket) => [ticket.id, ticket]));
    const ticketTypePerformance = Array.from(event.ticketSales.values()).map((sale) => ({
      ...sale,
      name: ticketTypesById.get(sale.ticketTypeId)?.name || "Ticket",
      priceCents: ticketTypesById.get(sale.ticketTypeId)?.priceCents || 0,
      salesShare: conversion(sale.revenueCents, event.grossRevenueCents)
    }));
    return {
      id: event.id,
      eventName: event.eventName,
      gameContext: event.gameContext,
      hostId: event.hostId,
      hostName: event.hostName,
      eventDate: event.eventDate?.toISOString() || null,
      impressions: event.impressions,
      views: event.views,
      ticketSelections: event.ticketSelections,
      checkoutStarts: event.checkoutStarts,
      completedOrders: event.completedOrders,
      ticketsSold: event.ticketsSold,
      grossRevenueCents: event.grossRevenueCents,
      platformFeeRevenueCents: event.platformFeeRevenueCents,
      conversionRate: conversion(event.completedOrders, event.views),
      checkoutConversionRate: conversion(event.completedOrders, event.checkoutStarts),
      ticketTypePerformance,
      sources: Array.from(event.sources.values()).map((source) => ({
        ...source,
        conversionRate: conversion(source.purchases, source.views)
      }))
    };
  });

  const hostMap = new Map();
  for (const event of normalizedEvents) {
    const key = event.hostId || event.hostName;
    const host = hostMap.get(key) || {
      hostId: event.hostId,
      hostName: event.hostName,
      paidEvents: 0,
      views: 0,
      checkoutStarts: 0,
      orders: 0,
      ticketsSold: 0,
      grossRevenueCents: 0
    };
    host.paidEvents += 1;
    host.views += event.views;
    host.checkoutStarts += event.checkoutStarts;
    host.orders += event.completedOrders;
    host.ticketsSold += event.ticketsSold;
    host.grossRevenueCents += event.grossRevenueCents;
    hostMap.set(key, host);
  }
  const hosts = Array.from(hostMap.values()).map((host) => ({
    ...host,
    conversionRate: conversion(host.orders, host.views)
  }));
  const completedOrders = normalizedEvents.reduce((sum, event) => sum + event.completedOrders, 0);
  const ticketsSold = normalizedEvents.reduce((sum, event) => sum + event.ticketsSold, 0);
  const grossRevenueCents = normalizedEvents.reduce((sum, event) => sum + event.grossRevenueCents, 0);
  const platformFeeRevenueCents = normalizedEvents.reduce((sum, event) => sum + event.platformFeeRevenueCents, 0);
  const views = normalizedEvents.reduce((sum, event) => sum + event.views, 0);
  const checkoutStarts = normalizedEvents.reduce((sum, event) => sum + event.checkoutStarts, 0);

  return {
    range: { preset: range.preset, start: range.start.toISOString(), end: range.end.toISOString() },
    analyticsStartedAt: analyticsStartedAt?.toISOString() || null,
    summary: {
      views,
      checkoutStarts,
      completedOrders,
      ticketsSold,
      grossRevenueCents,
      platformFeeRevenueCents,
      viewConversionRate: conversion(completedOrders, views),
      checkoutConversionRate: conversion(completedOrders, checkoutStarts)
    },
    funnel: funnel.map((stage, index) => {
      const next = funnel[index + 1];
      return {
        name: stage.name,
        eventCount: stage.eventCount,
        uniqueUsers: stage.visitors.size,
        nextStageRate: next ? conversion(next.eventCount, stage.eventCount) : null,
        dropOffRate: next && stage.eventCount > 0 ? Math.max(0, 1 - next.eventCount / stage.eventCount) : null
      };
    }),
    events: normalizedEvents,
    hosts,
    sources: Array.from(sources.values()).map((source) => ({
      ...source,
      conversionRate: conversion(source.purchases, source.views)
    })),
    trends: Array.from(trends.values()).sort((a, b) => a.date.localeCompare(b.date)),
    truncated: analyticsDocs.length >= MAX_ANALYTICS_ROWS || purchaseDocs.length >= MAX_PURCHASE_ROWS
  };
}

async function requireAdmin(db, request) {
  if (!request.auth?.uid) throw new HttpsError("unauthenticated", "Sign in to view paid-event analytics.");
  const userDoc = await db.doc(`users/${request.auth.uid}`).get();
  if (!userDoc.exists || userDoc.data().admin !== true) {
    throw new HttpsError("permission-denied", "Administrator access is required.");
  }
}

function sanitizeSource(value) {
  const normalized = normalizeToken(value);
  return SOURCE_NAMES.has(normalized) ? normalized : "other";
}

async function recordPaidTailgateAnalyticsEvent(db, request) {
  const input = asRecord(request.data);
  const eventName = firstString(input.eventName);
  const tailgateId = limitedString(input.tailgateId, 180);
  if (!ANALYTICS_EVENT_NAMES.has(eventName) || !tailgateId) {
    throw new HttpsError("invalid-argument", "A supported event name and tailgate ID are required.");
  }
  const eventDoc = await db.doc(`tailgateEvents/${tailgateId}`).get();
  if (!eventDoc.exists || normalizeToken(eventDoc.data().visibilityType) !== "open_paid") {
    throw new HttpsError("failed-precondition", "Analytics are recorded only for open paid tailgates.");
  }
  const eventData = eventDoc.data();
  const record = {
    eventName,
    tailgateId,
    hostId: firstString(eventData.hostUserId, eventData.hostId, eventData.ownerId, eventData.createdByUid),
    gameId: limitedString(input.gameId, 180),
    ticketTypeId: limitedString(input.ticketTypeId, 180),
    source: sanitizeSource(input.source),
    campaign: limitedString(input.campaign, 160),
    medium: limitedString(input.medium, 80),
    platform: limitedString(input.platform, 40) || "web",
    price: Math.max(0, numberValue(input.price, 0)),
    quantity: Math.max(0, Math.round(numberValue(input.quantity, 0))),
    purchaseId: limitedString(input.purchaseId, 180),
    visitorId: limitedString(input.visitorId, 180),
    userId: request.auth?.uid || "",
    occurredAt: FieldValue.serverTimestamp()
  };
  await db.collection("paidTailgateAnalyticsEvents").add(record);
  return { recorded: true };
}

async function getPaidTailgateAnalyticsDashboard(db, request) {
  await requireAdmin(db, request);
  const range = resolveRange(asRecord(request.data));
  const [eventSnapshot, analyticsSnapshot, earliestAnalyticsSnapshot, purchaseSnapshot] = await Promise.all([
    db.collection("tailgateEvents").where("visibilityType", "==", "open_paid").get(),
    db.collection("paidTailgateAnalyticsEvents")
      .where("occurredAt", ">=", Timestamp.fromDate(range.start))
      .where("occurredAt", "<=", Timestamp.fromDate(range.end))
      .limit(MAX_ANALYTICS_ROWS)
      .get(),
    db.collection("paidTailgateAnalyticsEvents").orderBy("occurredAt", "asc").limit(1).get(),
    db.collection("ticketPurchases").limit(MAX_PURCHASE_ROWS).get()
  ]);
  const dashboard = buildDashboardFromRecords({
    eventDocs: eventSnapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() })),
    analyticsDocs: analyticsSnapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() })),
    purchaseDocs: purchaseSnapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() })),
    range
  });
  const earliestAnalyticsDate = earliestAnalyticsSnapshot.empty
    ? null
    : normalizeDate(earliestAnalyticsSnapshot.docs[0].data().occurredAt);
  return {
    ...dashboard,
    analyticsStartedAt: earliestAnalyticsDate?.toISOString() || dashboard.analyticsStartedAt
  };
}

module.exports = {
  ANALYTICS_EVENT_NAMES,
  buildDashboardFromRecords,
  conversion,
  getPaidTailgateAnalyticsDashboard,
  isSuccessfulPurchase,
  requireAdmin,
  recordPaidTailgateAnalyticsEvent,
  resolveRange
};
