import { expect, test } from "@playwright/test";

const isQaMode = process.env.PLAYWRIGHT_E2E_MODE === "qa";

test.describe("Public flows", () => {
  test.skip(isQaMode, "Mock-only smoke coverage.");

  test("home page routes users into discover", async ({ page }) => {
    await page.goto("/#/");

    await expect(
      page.getByRole("heading", {
        name: /host private invites, open free tailgates, or paid public events/i
      })
    ).toBeVisible();

    await page.getByRole("link", { name: /explore tailgates/i }).click();

    await expect(page).toHaveURL(/#\/discover$/);
    await expect(page.getByRole("heading", { name: "Discover" })).toBeVisible();
    await expect(page.getByText("Sunday Tailgate vs. Chiefs")).toBeVisible();
    await expect(page.getByText("Thursday Night Pre-Game Social")).toBeVisible();
  });

  test("discover page shows list and map mode controls", async ({ page }) => {
    await page.goto("/#/discover");

    await expect(page.getByRole("heading", { name: "Discover" })).toBeVisible();
    await expect(page.getByRole("button", { name: "List" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Map" })).toBeVisible();
    await expect(page.getByRole("button", { name: /use my location/i })).toBeVisible();
  });

  test("discover supports direct links to location-filtered results", async ({ page }) => {
    await page.goto(
      "/#/discover?lat=40.4468&lng=-79.9901&location=Pittsburgh%2C%20PA&utm_campaign=pittsburgh"
    );

    await expect(page.getByText("Near Pittsburgh, PA")).toBeVisible();
    await expect(page.getByPlaceholder("Search by ZIP, city, or address")).toHaveValue(
      "Pittsburgh, PA"
    );
    await expect(page.getByText("Sunday Tailgate vs. Chiefs")).toBeVisible();
    await expect(page).toHaveURL(/utm_campaign=pittsburgh/);
  });

  test("discover ignores invalid location coordinates", async ({ page }) => {
    await page.goto("/#/discover?lat=200&lng=-79.9901&location=Invalid");

    await expect(page.getByText("Set a location")).toBeVisible();
    await expect(page.getByPlaceholder("Search by ZIP, city, or address")).toHaveValue("");
  });

  test("invite RSVP hides and ignores plus-guest count when host did not allow guests", async ({
    page
  }) => {
    let savedPayload: {
      anonymousGuestCount?: number;
      additionalGuests?: unknown[];
    } | null = null;

    await page.route("**/functions/lot-legends/getEventDetails?**", async (route) => {
      await route.fulfill({
        contentType: "application/json",
        body: JSON.stringify({
          eventName: "Private No Plus Guests",
          hostName: "Codex Host",
          visibilityType: "private",
          allowGuestPlusOnInvite: false,
          maxAdditionalGuestsPerInvite: 0,
          guest: {
            id: "guest-1",
            token: "token-1",
            name: "Guest Tester",
            status: "Pending",
            allowGuestPlusOnInvite: false,
            maxAdditionalGuestsPerInvite: 0
          },
          event: {
            visibilityType: "private",
            allowGuestPlusOnInvite: false,
            maxAdditionalGuestsPerInvite: 0
          }
        })
      });
    });

    await page.route("**/functions/lot-legends/submitInviteRsvpPublic", async (route) => {
      savedPayload = route.request().postDataJSON();
      await route.fulfill({
        contentType: "application/json",
        body: JSON.stringify({ ok: true })
      });
    });

    await page.goto("/rsvp.html?eventId=private-1&guestId=guest-1&token=token-1&env=qa");

    await expect(
      page.getByText("This invite does not include guest +1 permissions.")
    ).toBeVisible();
    await expect(page.getByLabel("Total additional guests you are bringing")).toBeHidden();

    await page.locator("#inviteGuestCount").evaluate((input) => {
      const guestCountInput = input as HTMLInputElement;
      guestCountInput.value = "5";
      guestCountInput.dispatchEvent(new Event("input", { bubbles: true }));
    });
    await page.getByRole("button", { name: "Save RSVP" }).click();

    await expect(page.getByText("You're all set")).toBeVisible();
    expect(savedPayload).toEqual(
      expect.objectContaining({
        anonymousGuestCount: 0,
        additionalGuests: []
      })
    );
  });
});
