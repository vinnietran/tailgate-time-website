import { expect, test } from "@playwright/test";
import {
  buildPromotionUrl,
  isPromotionEligible
} from "../../src/features/promotion/promotion";

test.describe("Host promotion logic", () => {
  test("attributes each public event URL to its host promotion channel", () => {
    const url = new URL(buildPromotionUrl("paid-event", "host_qr", "https://tailgatetime.com"));
    expect(url.pathname).toBe("/tailgates/paid-event");
    expect(url.searchParams.get("source")).toBe("host_share");
    expect(url.searchParams.get("utm_medium")).toBe("host_promotion");
    expect(url.searchParams.get("utm_campaign")).toBe("host_qr");
  });

  test("keeps invite-only events out of the public toolkit", () => {
    expect(isPromotionEligible("open_paid")).toBe(true);
    expect(isPromotionEligible("open_free")).toBe(true);
    expect(isPromotionEligible("private")).toBe(false);
  });
});
