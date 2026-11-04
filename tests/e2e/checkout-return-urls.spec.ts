import { expect, test } from "@playwright/test";
import { checkoutReturnUrls } from "../../src/utils/checkout";

test("checkout callbacks preserve the backend replacement token and return to the selected event", () => {
  for (const origin of ["https://tailgatetime-prod.web.app", "https://www.tailgate-time.com", "https://lot-legends.web.app"]) {
    const urls = checkoutReturnUrls(origin, "event/with space");
    for (const [key, template] of Object.entries(urls)) {
      expect(template).toContain("{purchaseId}");
      const url = new URL(template.replaceAll("{purchaseId}", encodeURIComponent("purchase-123")));
      expect(url.origin).toBe(origin);
      expect(url.pathname).toBe("/tailgates/event%2Fwith%20space");
      expect(url.searchParams.get("purchaseId")).toBe("purchase-123");
      expect(url.searchParams.get("checkout")).toBe(key === "successUrl" ? "success" : "cancel");
    }
  }
});
