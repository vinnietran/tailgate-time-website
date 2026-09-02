import { expect, test } from "@playwright/test";
import { hostSlugCandidate, normalizeHostSlug, validateHostSlug } from "../../src/utils/hostSlug";
import { formatHostProfileError } from "../../src/utils/hostProfileError";

test.describe("Host Page slug rules", () => {
  test("normalizes names and special characters", () => {
    expect(normalizeHostSlug("East 32 Dolphins Tailgate")).toBe("east-32-dolphins-tailgate");
    expect(normalizeHostSlug("  Buffalo & Bills!!!  ")).toBe("buffalo-bills");
    expect(normalizeHostSlug("Café  Déjà Vu")).toBe("cafe-deja-vu");
    expect(hostSlugCandidate("Tailgate Party", 2)).toBe("tailgate-party-2");
  });

  test("rejects reserved and non-normalized slugs", () => {
    expect(validateHostSlug("admin")).toMatch(/reserved/i);
    expect(validateHostSlug("My Host")).toMatch(/normalized/i);
    expect(validateHostSlug("my-host")).toBeNull();
  });

  test("turns opaque Firebase failures into an actionable message", () => {
    expect(formatHostProfileError({ code: "functions/internal", message: "internal" })).toMatch(
      /deploy the Host Page Firebase functions/i
    );
  });
});

test.describe("Public Host Page", () => {
  test("is public, shows discoverable upcoming events, and sets SEO metadata", async ({ page }) => {
    await page.goto("/hosts/demo-host");

    await expect(page.getByRole("heading", { name: "Demo Host" })).toBeVisible();
    await expect(page.getByText("Sunday Tailgate vs. Chiefs")).toBeVisible();
    await expect(page.getByText("Thursday Night Pre-Game Social")).toBeVisible();
    await expect(page.getByText("Classic Rivalry Tailgate")).toBeHidden();
    await expect(page.getByRole("heading", { name: "Tailgate gallery" })).toBeVisible();
    await expect(page.getByRole("button", { name: /open gallery image 1 of 3/i })).toBeVisible();
    await expect(page).toHaveTitle("Demo Host | TailgateTime");
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /\/hosts\/demo-host$/);
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute("content", "Demo Host | TailgateTime");
  });

  test("unknown hosts return a friendly page", async ({ page }) => {
    await page.goto("/hosts/not-a-real-host");
    await expect(page.getByRole("heading", { name: "Host page not found" })).toBeVisible();
  });

  test("host editor exposes public fields and slug warning", async ({ page }) => {
    await page.goto("/dashboard/host-page");
    await expect(page.getByRole("heading", { name: "Your TailgateTime Host Page" })).toBeVisible();
    await expect(page.getByLabel("Public host or organization name")).toHaveValue("Demo Host");
    await expect(page.getByText("Image gallery", { exact: true })).toBeVisible();
    await expect(page.getByText("3 / 8")).toBeVisible();
    await expect(page.getByText("Add gallery images")).toBeVisible();
    await page.getByLabel("Public URL slug").fill("updated-host");
    await expect(page.getByText(/changing this URL may break/i)).toBeVisible();
  });
});
