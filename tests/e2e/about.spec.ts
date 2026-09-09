import { expect, test } from "@playwright/test";

test("About replaces the release page and preserves old links", async ({ page }) => {
  await page.goto("/release-2-0");
  await expect(page).toHaveURL(/\/about$/);
  await expect(page).toHaveTitle("About | TailgateTime");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Before kickoff.");
  await expect(page.getByRole("navigation", { name: "Public site" }).getByRole("link", { name: "About", exact: true })).toHaveClass("active");
  await expect(page.getByRole("link", { name: "Start hosting" })).toHaveAttribute("href", /\/tailgates\/new|\/login\?mode=signup/);
  await expect(page.getByRole("link", { name: "Get in touch" })).toHaveAttribute("href", "/contact.html");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.goto("/#/release-2-0");
  await expect(page).toHaveURL(/\/about$/);
});
