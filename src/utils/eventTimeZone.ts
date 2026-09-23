import { Temporal } from "@js-temporal/polyfill";

export function validTimeZone(value: unknown): string | undefined {
  if (typeof value !== "string" || !value || /^[+-]/.test(value)) return undefined;
  try {
    return new Intl.DateTimeFormat("en-US", { timeZone: value }).resolvedOptions().timeZone;
  } catch {
    return undefined;
  }
}

export function deviceTimeZone() {
  return validTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone) || "UTC";
}

export function timeZoneLabel(timeZone: string) {
  return new Intl.DateTimeFormat("en-US", { timeZone, timeZoneName: "longGeneric" })
    .formatToParts(new Date()).find((part) => part.type === "timeZoneName")?.value || timeZone;
}

export function dateTimeInputs(value: Date, timeZone = deviceTimeZone()) {
  const zoned = Temporal.Instant.fromEpochMilliseconds(value.getTime()).toZonedDateTimeISO(timeZone);
  return { date: zoned.toPlainDate().toString(), time: zoned.toPlainTime().toString({ smallestUnit: "minute" }) };
}

// Reject nonexistent spring-forward times and ambiguous fall-back times, rather than silently changing them.
export function eventDateTime(date: string, time: string, timeZone = deviceTimeZone()): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^\d{2}:\d{2}$/.test(time)) return null;
  try {
    const plain = Temporal.PlainDateTime.from(`${date}T${time}`, { overflow: "reject" });
    return new Date(plain.toZonedDateTime(timeZone, { disambiguation: "reject" }).epochMilliseconds);
  } catch {
    return null;
  }
}

export function eventEndDateTime(date: string, start: string, end: string, timeZone: string) {
  try {
    const endDate = end <= start ? Temporal.PlainDate.from(date).add({ days: 1 }).toString() : date;
    return eventDateTime(endDate, end, timeZone);
  } catch {
    return null;
  }
}

export function eventTimelineWindow(base: Date, time: string, hours: number, minutes: number, seconds: number, timeZone = deviceTimeZone()) {
  const start = eventDateTime(dateTimeInputs(base, timeZone).date, time, timeZone);
  if (!start) return null;
  const duration = Math.max(0, hours) * 3600 + Math.max(0, minutes) * 60 + Math.max(0, seconds);
  return { start, end: new Date(start.getTime() + duration * 1000) };
}

export const TIME_ZONE_DATE_ERROR = "This time is invalid or occurs twice because of a daylight-saving change. Choose another time in the event timezone.";
