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
});
