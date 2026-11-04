import { expect, test } from "@playwright/test";

test("public pricing and comparisons remain reachable and describe real terms", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("navigation", { name: "Public site" }).getByRole("link", { name: "Pricing", exact: true }).click();
  await expect(page).toHaveURL(/\/pricing$/);
  await expect(page).toHaveTitle("Tailgate Hosting Fees and Payouts | TailgateTime");
  await expect(page.getByText("10% standard platform fee", { exact: true })).toBeVisible();
  await page.getByText("When do I get paid?", { exact: true }).click();
  await expect(page.getByText(/Payouts are sent to your connected Stripe account within 7 days/)).toBeVisible();
  await page.getByRole("link", { name: "TailgateTime vs Gatherly", exact: true }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("TailgateTime vs Gatherly");
  await expect(page.locator('meta[property="og:url"]')).toHaveAttribute("content", "https://tailgate-time.com/vs/gatherly");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://tailgate-time.com/vs/gatherly");
});

test("public pages fit a 375px phone and keep store downloads within the first screen", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  for (const path of ["/", "/pricing", "/features", "/customers", "/vs/eventbrite", "/discover"]) {
    await page.goto(path);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    if (path === "/") {
      for (const image of await page.locator('.homepage-cta-row img').all()) {
        const box = await image.boundingBox();
        expect(box).not.toBeNull();
        expect(box!.y + box!.height).toBeLessThanOrEqual(812);
      }
    }
  }
  await page.goto("/discover");
  await page.getByText("Sunday Tailgate vs. Chiefs", { exact: true }).click();
  await expect(page).toHaveURL(/\/tailgates\//);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});
