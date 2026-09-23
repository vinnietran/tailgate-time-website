import { dateTimeInputs, deviceTimeZone, eventDateTime } from "./eventTimeZone";

// eventTargetTime is the schedule's independent countdown reference, not an event date.
export function scheduleTargetUpdate(reference: Date, time: string, timeZone = deviceTimeZone()) {
  const eventTargetTime = eventDateTime(dateTimeInputs(reference, timeZone).date, time, timeZone);
  return eventTargetTime ? { eventTargetTime } : null;
}

export function scheduleTimeRemaining(target: Date, stepEnd: Date) {
  return Math.max(0, target.getTime() - stepEnd.getTime());
}
