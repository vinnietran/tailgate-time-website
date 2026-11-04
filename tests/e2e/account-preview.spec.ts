import { expect, test } from "@playwright/test";

test("demo account renders account and payout settings without a runtime error", async ({ page }) => {
  test.skip(process.env.PLAYWRIGHT_E2E_MODE === "qa", "Uses the local demo account.");
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto("/account");
  await expect(page.getByRole("heading", { level: 1, name: "Account & Payouts" })).toBeVisible();
  await expect(page.getByLabel("Display Name")).toHaveValue("Jordan Tailgater");
  await expect(page.getByRole("heading", { name: "Payout account", exact: true })).toBeVisible();
  expect(errors).toEqual([]);
});
