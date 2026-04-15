import { expect, test } from "@playwright/test";

const isQaMode = process.env.PLAYWRIGHT_E2E_MODE === "qa";

test.describe("Host flows", () => {
  test.skip(isQaMode, "Mock-only smoke coverage.");

  test("dashboard loads with mock host data", async ({ page }) => {
    await page.goto("/#/dashboard");

    await expect(page.getByRole("heading", { name: "Your Next Tailgate" })).toBeVisible();
    await expect(page.getByText("Sunday Tailgate vs. Chiefs")).toBeVisible();
    await expect(page.getByRole("tab", { name: "Past" })).toBeVisible();

    await page.getByRole("tab", { name: "Past" }).click();
    await expect(page.getByText("Classic Rivalry Tailgate")).toBeVisible();
  });

  test("host event details render the command center", async ({ page }) => {
    await page.goto("/#/tailgates/tg-001");

    await expect(page.getByText("Event command center")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Run The Event" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Event Brief" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "What To Expect" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Meet-up Spot" })).toBeVisible();
  });

  test("create wizard can progress from type to review for a private event", async ({
    page
  }) => {
    await page.goto("/#/tailgates/new");

    await expect(
      page.getByRole("heading", { name: "Create Tailgate Event" })
    ).toBeVisible();

    await page.getByLabel(/invite only/i).check();
    await page.getByRole("button", { name: /next: event details/i }).click();

    await page.getByLabel("Tailgate Event Name").fill("Codex Private Tailgate");
    await page.getByLabel("Date").fill("2030-09-14");
    await page.getByLabel("Start Time").fill("10:00");
    await page.getByLabel("End Time").fill("13:00");
    await page
      .getByLabel("Description")
      .fill("A private tailgate flow covered by Playwright functional tests.");
    await page.getByRole("button", { name: /next: event location/i }).click();

    await page.getByLabel("Location").fill("Lot 4, Stadium Drive, Pittsburgh, PA");
    await page.getByRole("button", { name: /next: invite/i }).click();

    await expect(
      page.getByRole("heading", { name: /step 4: invite friends/i })
    ).toBeVisible();

    await page.getByRole("button", { name: /next: review and create/i }).click();

    await expect(
      page.getByRole("heading", { name: /step 5: review and create/i })
    ).toBeVisible();
    await expect(page.getByText("Codex Private Tailgate")).toBeVisible();
    await expect(
      page.getByRole("definition").filter({ hasText: /Pittsburgh\s+PA\s+USA/ }).first()
    ).toBeVisible();
  });
});
