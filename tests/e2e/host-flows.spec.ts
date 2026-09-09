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

  test("invite-only event hosts can add co-hosts", async ({ page }) => {
    await page.goto("/#/tailgates/tg-003");

    await expect(page.getByRole("heading", { name: "Co-hosts" })).toBeVisible();
    await expect(page.getByText(/help manage invites, the guest list, and the event/i)).toBeVisible();
    await expect(page.getByRole("textbox", { name: "Co-host phone number" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Text co-host" })).toBeVisible();
  });

  test("paid event details render multiple ticket types", async ({ page }) => {
    await page.goto("/#/tailgates/tg-004");

    await expect(
      page.getByRole("button", { name: /general admission \$45/i })
    ).toBeVisible();
    await expect(page.getByText("Quantity").first()).toBeVisible();
    const increaseQuantityButton = page.getByRole("button", {
      name: /increase ticket quantity/i
    });
    for (let step = 0; step < 8; step += 1) {
      await increaseQuantityButton.evaluate((button) => {
        (button as HTMLButtonElement).click();
      });
    }
    await expect(page.getByText(/^9$/).first()).toBeVisible();
    await expect(
      page.getByRole("button", { name: /buy tickets|buy more tickets|sign in to buy tickets/i })
    ).toBeVisible();
    await expect(page.getByText("From $45").first()).toBeVisible();
  });

  test("new paid tailgate success screen leads to promotion tools", async ({ page }) => {
    await page.goto("/tailgates/tg-001/created");

    await expect(page.getByRole("heading", { name: "Tailgate Successfully Created" })).toBeVisible();
    await expect(page.getByText(/share your ticket link/i)).toBeVisible();
    await expect(page.getByRole("button", { name: "Share Tailgate" })).toBeVisible();
    await expect(page.getByRole("link", { name: "View Tailgate" })).toHaveAttribute("href", "/tailgates/tg-001");
    await page.getByRole("link", { name: "Share Ticket Link & QR" }).click();
    await expect(page.getByRole("heading", { name: "Share Your Tailgate" })).toBeVisible();
    await expect(page.getByText("Open Paid")).toBeVisible();
  });

  test("open free event has attendee-focused promotion tools", async ({ page }) => {
    await page.goto("/tailgates/tg-002/promote");

    await expect(page.getByRole("heading", { name: "Share Your Tailgate" })).toBeVisible();
    await expect(page.getByText(/copy your public event link or create a QR code/i)).toBeVisible();
    await expect(page.getByText("Open Free")).toBeVisible();
  });

  test("invite-only event does not expose public promotion tools", async ({ page }) => {
    await page.goto("/tailgates/tg-003/promote");

    await expect(page.getByRole("heading", { name: "This tailgate is invite-only" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Share Your Tailgate" })).toHaveCount(0);
  });

  test("unrelated user cannot access host promotion controls", async ({ page }) => {
    await page.goto("/tailgates/tg-004/promote");

    await expect(page.getByRole("heading", { name: "You don’t have access to these tools" })).toBeVisible();
  });

  test("promotion links are attributed and QR generation remains available", async ({ page, context }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.goto("/tailgates/tg-001/promote");
    await page.getByRole("button", { name: "Copy Link" }).click();
    await expect(page.getByText("Event link copied.")).toBeVisible();

    const copied = await page.evaluate(() => navigator.clipboard.readText());
    expect(copied).toContain("/tailgates/tg-001");
    expect(copied).toContain("source=host_share");
    expect(copied).toContain("utm_campaign=host_copy_link");

    await page.getByRole("button", { name: "View QR Code" }).click();
    const qr = page.getByRole("img", { name: /QR code for Sunday Tailgate/i });
    await expect(qr).toBeVisible();
    await expect(qr).toHaveAttribute("src", /^data:image\/png;base64,/);

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
