import { expect, test } from "@playwright/test";

test.describe("Guided tailgate creation", () => {
  test.skip(process.env.PLAYWRIGHT_E2E_MODE === "qa", "Uses isolated mock data.");

  for (const type of ["Invite Only", "Open (Free)", "Open (Paid)"]) {
    test(`${type} preserves details when navigating and editing`, async ({ page }, testInfo) => {
      if (type === "Open (Paid)") {
        // Exercise the paid UI without using a real Stripe account or changing production gates.
        await page.route("**/src/hooks/useStripeConnectAccount.ts", (route) => route.fulfill({
          contentType: "application/javascript",
          body: `export function useStripeConnectAccount() { return { status: "enabled", ready: true, loading: false, payoutsEnabled: true, hostPlatformFeePercent: 10, hostPromoEndsAtMs: null }; }`
        }));
      }
      await page.route("https://maps.googleapis.com/maps/api/geocode/json**", (route) => route.fulfill({
        json: { status: "OK", results: [{ formatted_address: "Stadium St, Pittsburgh, PA, USA", geometry: { location: { lat: 40.44, lng: -79.99 } } }] }
      }));
      await page.route("**/src/lib/eventTimeZone.ts", (route) => route.fulfill({ contentType: "application/javascript", body: "export async function lookupEventTimeZone() { return Intl.DateTimeFormat().resolvedOptions().timeZone; }" }));
      await page.goto("/#/tailgates/new");
      const nav = page.getByRole("navigation", { name: "Creation steps" });
      await expect(nav.getByRole("button", { name: /review/i })).toBeDisabled();
      await page.getByRole("radio", { name: type, exact: true }).click();
      if (type === "Open (Paid)") {
        await page.getByRole("button", { name: "I understand, continue" }).click();
        await page.getByRole("button", { name: /next: tickets/i }).click();
        await expect(page.getByRole("heading", { name: /step 2: tickets/i })).toBeVisible();
        await page.getByRole("button", { name: /next: event details/i }).click();
        // Empty ticket types must still be validated.
        await expect(page.getByRole("alert").first()).toBeVisible();
        await page.screenshot({ path: testInfo.outputPath("paid-tickets.png"), fullPage: true });
        await page.getByLabel("Ticket type name", { exact: true }).fill("General admission");
        await page.getByLabel("Price (USD)").fill("25.00");
        await page.getByLabel("Capacity for this ticket type").fill("50");
      }
      await page.getByRole("button", { name: /next: event details/i }).click();
      await page.getByRole("button", { name: /next: event location/i }).click();
      await expect(page.getByText("Event name is required.")).toBeVisible();
      await page.getByLabel("Tailgate Event Name").fill("Saturday at the stadium");
      await page.getByLabel("Date", { exact: true }).fill("2030-09-14");
      await page.getByLabel("Start Time", { exact: true }).fill("10:00");
      await page.getByLabel("End Time").fill("13:00");
      await page.getByLabel("Description", { exact: true }).fill("Food, friends, and football.");
      await page.getByRole("button", { name: "Lawn games", exact: true }).click();
      await expect(page.getByRole("button", { name: "Lawn games", exact: true })).toHaveAttribute("aria-pressed", "true");
      await page.getByRole("button", { name: /next: event location/i }).click();
      await nav.getByRole("button", { name: /details/i }).click();
      await expect(page.getByLabel("Tailgate Event Name")).toHaveValue("Saturday at the stadium");
      await expect(page.getByRole("button", { name: "Lawn games", exact: true })).toHaveAttribute("aria-pressed", "true");
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
      await page.screenshot({ path: testInfo.outputPath("details.png"), fullPage: true });
      await page.getByRole("button", { name: /next: event location/i }).click();
      await page.getByLabel("Location", { exact: true }).fill("Stadium St, Pittsburgh, PA, USA");
      await page.getByRole("button", { name: /next: (invite|optional)/i }).click();
      await page.getByRole("button", { name: /next: (invite|optional)/i }).click();
      await page.getByRole("button", { name: /next: review and create/i }).click();
      await expect(page.getByRole("definition").filter({ hasText: "Saturday at the stadium" })).toBeVisible();
      await expect(page.getByRole("definition").filter({ hasText: "Lawn games" })).toBeVisible();
      await page.getByRole("button", { name: "Edit details", exact: true }).click();
      await expect(page.getByLabel("Tailgate Event Name")).toHaveValue("Saturday at the stadium");
    });
  }

  test("paid events still require payout setup", async ({ page }) => {
    await page.goto("/#/tailgates/new");
    await page.getByRole("radio", { name: "Open (Paid)", exact: true }).click();
    await expect(page.getByRole("heading", { name: "Set up payouts for paid tailgates" })).toBeVisible();
    await page.getByRole("button", { name: "Cancel", exact: true }).click();
    await expect(page.getByRole("radio", { name: "Invite Only", exact: true })).toBeChecked();
  });
});
