import { expect, test } from "@playwright/test";

test("workspace navigation highlights only the current destination", async ({ page }) => {
  await page.goto("/dashboard/host-page");
  const nav = page.getByRole("navigation", { name: "Workspace", exact: true });
  await expect(nav.locator('[aria-current="page"]')).toHaveCount(1);
  await expect(nav.getByRole("link", { name: "Host Page", exact: true })).toHaveAttribute("aria-current", "page");
  await nav.getByRole("link", { name: "My Tailgates", exact: true }).click();
  await expect(nav.locator('[aria-current="page"]')).toHaveCount(1);
  await expect(nav.getByRole("link", { name: "My Tailgates", exact: true })).toHaveAttribute("aria-current", "page");
});

test("collapsed navigation preserves accessible labels and saved preference", async ({ page, isMobile }) => {
  test.skip(isMobile, "Mobile uses horizontally scrollable navigation.");
  await page.goto("/dashboard/host-page");
  await page.getByRole("button", { name: "Collapse sidebar" }).click();
  await expect(page.getByRole("button", { name: "Expand sidebar" })).toHaveAttribute("aria-expanded", "false");
  await page.reload();
  await expect(page.getByRole("button", { name: "Expand sidebar" })).toBeVisible();
  await page.getByRole("navigation", { name: "Workspace", exact: true }).getByRole("link", { name: "My Tailgates", exact: true }).click();
  await expect(page).toHaveURL(/\/dashboard$/);
  await page.getByRole("button", { name: "Expand sidebar" }).click();
  await expect(page.locator(".sidebar .nav-item-label").first()).toBeVisible();
});
