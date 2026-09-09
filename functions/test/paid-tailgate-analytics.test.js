const test = require("node:test");
const assert = require("node:assert/strict");
const { _test } = require("../index");

const analytics = _test.paidTailgateAnalytics;
const range = {
  preset: "last_30_days",
  start: new Date("2026-09-01T00:00:00.000Z"),
  end: new Date("2026-09-30T23:59:59.999Z")
};

function build(purchases = [], behavioral = []) {
  return analytics.buildDashboardFromRecords({
    range,
    eventDocs: [
      { id: "paid-1", data: { visibilityType: "open_paid", name: "Paid One", hostUserId: "host-1" } },
      { id: "free-1", data: { visibilityType: "open_free", name: "Free One", hostUserId: "host-1" } }
    ],
    analyticsDocs: behavioral,
    purchaseDocs: purchases
  });
}

test("conversion returns null when the denominator is zero", () => {
  assert.equal(analytics.conversion(2, 0), null);
  assert.equal(analytics.conversion(2, 8), 0.25);
});

test("dashboard access requires an authenticated administrator", async () => {
  const fakeDb = {
    doc: () => ({
      get: async () => ({ exists: true, data: () => ({ admin: true }) })
    })
  };
  await assert.rejects(() => analytics.requireAdmin(fakeDb, {}), /Sign in/);
  await assert.doesNotReject(() => analytics.requireAdmin(fakeDb, { auth: { uid: "admin-1" } }));
  const nonAdminDb = {
    doc: () => ({
      get: async () => ({ exists: true, data: () => ({ admin: false }) })
    })
  };
  await assert.rejects(
    () => analytics.requireAdmin(nonAdminDb, { auth: { uid: "host-1" } }),
    /Administrator access/
  );
});

test("dashboard includes only open paid tailgates", () => {
  const dashboard = build();
  assert.deepEqual(dashboard.events.map((event) => event.id), ["paid-1"]);
});

test("authoritative revenue counts successful purchases and excludes refunds", () => {
  const dashboard = build([
    { id: "ok", data: { tailgateId: "paid-1", status: "confirmed", quantity: 2, amountPaidCents: 7000, platformFeeCents: 700, confirmedAt: "2026-09-10" } },
    { id: "refund", data: { tailgateId: "paid-1", status: "refunded", quantity: 1, amountPaidCents: 3500, platformFeeCents: 350, updatedAt: "2026-09-11" } },
    { id: "failed", data: { tailgateId: "paid-1", status: "failed", quantity: 1, amountPaidCents: 3500, updatedAt: "2026-09-12" } }
  ]);
  assert.equal(dashboard.summary.completedOrders, 1);
  assert.equal(dashboard.summary.ticketsSold, 2);
  assert.equal(dashboard.summary.grossRevenueCents, 7000);
  assert.equal(dashboard.summary.platformFeeRevenueCents, 700);
});

test("view and checkout conversion calculations use behavioral denominators", () => {
  const behavioral = [
    ...Array.from({ length: 4 }, (_, index) => ({ id: `view-${index}`, data: { eventName: "paid_tailgate_view", tailgateId: "paid-1", occurredAt: "2026-09-09", visitorId: `visitor-${index}` } })),
    ...Array.from({ length: 2 }, (_, index) => ({ id: `checkout-${index}`, data: { eventName: "checkout_started", tailgateId: "paid-1", occurredAt: "2026-09-09", visitorId: `visitor-${index}` } }))
  ];
  const dashboard = build([
    { id: "ok", data: { tailgateId: "paid-1", status: "confirmed", amountPaidCents: 3500, confirmedAt: "2026-09-10" } }
  ], behavioral);
  assert.equal(dashboard.summary.viewConversionRate, 0.25);
  assert.equal(dashboard.summary.checkoutConversionRate, 0.5);
});
