import { expect, test } from "@playwright/test";
import { dateTimeInputs, eventDateTime, eventEndDateTime, eventTimelineWindow, validTimeZone } from "../../src/utils/eventTimeZone";
import { formatDateTimeRange } from "../../src/utils/format";

test("event timezone controls the instant independently of device timezone", () => {
  expect(eventDateTime("2030-09-14", "10:00", "America/Chicago")?.toISOString()).toBe("2030-09-14T15:00:00.000Z");
  expect(eventDateTime("2030-09-14", "10:00", "America/New_York")?.toISOString()).toBe("2030-09-14T14:00:00.000Z");
  expect(eventDateTime("2030-01-14", "10:00", "America/Chicago")?.toISOString()).toBe("2030-01-14T16:00:00.000Z");
});

test("rejects invalid dates and daylight-saving gaps and folds", () => {
  expect(eventDateTime("2030-03-10", "02:30", "America/New_York")).toBeNull();
  expect(eventDateTime("2030-11-03", "01:30", "America/New_York")).toBeNull();
  expect(eventDateTime("2030-02-30", "10:00", "America/New_York")).toBeNull();
  expect(eventDateTime("", "10:00", "America/New_York")).toBeNull();
});

test("overnight end uses the next local day across DST", () => {
  const start = eventDateTime("2030-03-09", "23:00", "America/New_York")!;
  const end = eventEndDateTime("2030-03-09", "23:00", "04:00", "America/New_York")!;
  expect(end.toISOString()).toBe("2030-03-10T08:00:00.000Z");
  expect(end.getTime() - start.getTime()).toBe(4 * 3600000);
});

test("editing and schedule times round-trip in the saved event timezone", () => {
  const instant = new Date("2030-09-15T01:00:00Z");
  expect(dateTimeInputs(instant, "America/Los_Angeles")).toEqual({ date: "2030-09-14", time: "18:00" });
  expect(eventTimelineWindow(instant, "19:00", 1, 0, 0, "America/Los_Angeles")?.start.toISOString()).toBe("2030-09-15T02:00:00.000Z");
  expect(formatDateTimeRange(instant, null, "America/Los_Angeles")).toContain("6:00 PM PDT");
  expect(validTimeZone("Not/AZone")).toBeUndefined();
  expect(() => formatDateTimeRange(instant, null, "Not/AZone")).not.toThrow();
});

test.describe("Venue timezone confirmation", () => {
  test.skip(process.env.PLAYWRIGHT_E2E_MODE === "qa", "Isolated mock flow.");
  test.use({ timezoneId: "America/Los_Angeles" });

  async function openLocation(page: import("@playwright/test").Page) {
    await page.route("https://maps.googleapis.com/maps/api/geocode/json**", (route) => route.fulfill({ json: {
      status: "OK", results: [{ formatted_address: "Dallas, TX, USA", geometry: { location: { lat: 32.78, lng: -96.8 } } }]
    } }));
    await page.goto("/#/tailgates/new");
    await page.getByRole("button", { name: /next: event details/i }).click();
    await page.getByLabel("Tailgate Event Name").fill("Dallas game day");
    await page.getByLabel("Date", { exact: true }).fill("2030-09-14");
    await page.getByLabel("Start Time", { exact: true }).fill("10:00");
    await page.getByLabel("End Time", { exact: true }).fill("13:00");
    await page.getByLabel("Description", { exact: true }).fill("Meet us at the stadium.");
    await page.getByRole("button", { name: /next: event location/i }).click();
    await page.getByLabel("Location", { exact: true }).fill("Dallas stadium");
    await page.getByRole("button", { name: /next: invite/i }).click();
  }

  test("confirms a different venue zone and creates the correct instant", async ({ page }, testInfo) => {
    await page.route("**/src/lib/eventTimeZone.ts", (route) => route.fulfill({ contentType: "application/javascript", body: 'export async function lookupEventTimeZone() { return "America/Chicago"; }' }));
    await openLocation(page);
    await expect(page.getByRole("button", { name: "Use location timezone" })).toBeVisible();
    await page.locator(".create-wizard-time-zone").screenshot({ path: testInfo.outputPath("timezone-confirmation.png") });
    await page.getByRole("button", { name: /next: invite/i }).click();
    await expect(page.getByText("Confirm the event timezone before continuing.")).toBeVisible();
    await page.getByRole("button", { name: "Use location timezone" }).click();
    await page.getByRole("button", { name: /next: invite/i }).click();
    await page.getByRole("button", { name: /next: review/i }).click();
    await expect(page.getByRole("definition").filter({ hasText: "America/Chicago" })).toBeVisible();
    await page.getByRole("button", { name: "Create", exact: true }).click();
    await expect(page.getByRole("heading", { name: "Tailgate Successfully Created" })).toBeVisible();
    const created = await page.evaluate(() => window.history.state.usr.event);
    expect(created.timeZone).toBe("America/Chicago");
    expect(new Date(created.startDateTime).toISOString()).toBe("2030-09-14T15:00:00.000Z");
    expect(new Date(created.endDateTime).toISOString()).toBe("2030-09-14T18:00:00.000Z");
    await expect(page.getByText(/10:00 AM CDT/)).toBeVisible();
  });

  test("lookup failure requires an explicit manual timezone", async ({ page }) => {
    await page.route("**/src/lib/eventTimeZone.ts", (route) => route.fulfill({ contentType: "application/javascript", body: 'export async function lookupEventTimeZone() { throw new Error("Unavailable"); }' }));
    await openLocation(page);
    await expect(page.getByText(/couldn’t detect the timezone/)).toBeVisible();
    await page.getByLabel("Event timezone", { exact: true }).selectOption("America/Chicago");
    await page.getByRole("button", { name: "Confirm timezone", exact: true }).click();
    await page.getByRole("button", { name: /next: invite/i }).click();
    await expect(page.getByRole("heading", { name: /step 4: invite friends/i })).toBeVisible();
  });
  test("a changed location ignores the old lookup and requires fresh confirmation", async ({ page }) => {
    await page.route("**/src/lib/eventTimeZone.ts", (route) => route.fulfill({
      contentType: "application/javascript",
      body: `export async function lookupEventTimeZone(coords) {
        if (coords.lat < 40) return new Promise(resolve => { window.finishOldLookup = () => resolve("America/Chicago"); });
        return "America/New_York";
      }`
    }));
    await openLocation(page);
    await expect(page.getByText("Finding the timezone for this location…")).toBeVisible();
    await page.route("https://maps.googleapis.com/maps/api/geocode/json**", (route) => route.fulfill({ json: {
      status: "OK", results: [{ formatted_address: "New York, NY, USA", geometry: { location: { lat: 40.71, lng: -74 } } }]
    } }));
    await page.getByLabel("Location", { exact: true }).fill("New York stadium");
    await page.getByRole("button", { name: "Find on map", exact: true }).click();
    await expect(page.getByText(/This location uses/)).toContainText("America/New_York");
    await page.evaluate(() => (window as unknown as { finishOldLookup: () => void }).finishOldLookup());
    await page.getByRole("button", { name: "Use location timezone" }).click();
    await expect(page.getByText(/Confirmed. All event and timeline times/)).toContainText("Eastern Time");
    await page.getByRole("button", { name: /next: invite/i }).click();
    await page.getByRole("button", { name: /next: review/i }).click();
    await expect(page.getByRole("definition").filter({ hasText: "America/New_York" })).toBeVisible();
  });

});
