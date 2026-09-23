import { expect, test } from "@playwright/test";
import { scheduleTargetUpdate, scheduleTimeRemaining } from "../../src/utils/schedule";

test("changing the countdown target preserves tailgate dates and schedule activities", () => {
  const start = new Date("2030-09-14T13:00:00Z");
  const end = new Date("2030-09-14T15:53:00Z");
  const step = { timestampStart: new Date("2030-09-14T15:23:00Z"), timestampEnd: new Date("2030-09-14T15:25:00Z") };
  const original = { dateTime: start, startDateTime: start, endDateTime: end, endAt: end, eventTargetTime: start, schedule: [step] };
  const updated = { ...original, ...scheduleTargetUpdate(original.eventTargetTime, "13:00", "America/New_York") };
  expect(updated.eventTargetTime.toISOString()).toBe("2030-09-14T17:00:00.000Z");
  expect({ ...updated, eventTargetTime: original.eventTargetTime }).toEqual(original);
  expect(scheduleTimeRemaining(updated.eventTargetTime, step.timestampEnd)).toBe(95 * 60 * 1000);
  const later = { ...updated, ...scheduleTargetUpdate(updated.eventTargetTime, "14:00", "America/New_York") };
  expect(later.startDateTime).toEqual(start);
  expect(later.endDateTime).toEqual(end);
  expect(later.schedule).toEqual([step]);
  expect(scheduleTimeRemaining(later.eventTargetTime, step.timestampEnd)).toBe(155 * 60 * 1000);
});

test("invalid countdown targets cannot be saved and past targets show zero", () => {
  const reference = new Date("2030-03-10T13:00:00Z");
  expect(scheduleTargetUpdate(reference, "02:30", "America/New_York")).toBeNull();
  expect(scheduleTargetUpdate(reference, "25:00", "America/New_York")).toBeNull();
  expect(scheduleTimeRemaining(reference, new Date(reference.getTime() + 60000))).toBe(0);
});
