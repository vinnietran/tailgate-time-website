import { expect, test } from "@playwright/test";
import { buildEventSizeSummary, getOpenEventSizeLabel } from "../../src/utils/tailgate";

test.describe("Open event size logic", () => {
  test("uses configured capacity for the three size bands", () => {
    expect(getOpenEventSizeLabel(4)).toBe("Small");
    expect(getOpenEventSizeLabel(5)).toBe("Medium");
    expect(getOpenEventSizeLabel(19)).toBe("Medium");
    expect(getOpenEventSizeLabel(20)).toBe("Large");
  });

  test("defaults events without a capacity to large", () => {
    expect(getOpenEventSizeLabel(undefined)).toBe("Large");
    expect(getOpenEventSizeLabel(null)).toBe("Large");
    expect(
      buildEventSizeSummary({
        visibilityType: "open_free",
        confirmedCount: 2
      })
    ).toBe("Event size: Large");
  });
});
