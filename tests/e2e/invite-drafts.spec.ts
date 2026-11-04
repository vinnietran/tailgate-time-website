import { expect, test } from "@playwright/test";
import { copyInviteDrafts } from "../../src/utils/inviteDrafts";

test("copy invitees preserves contacts but resets RSVP, identity, and delivery state", () => {
  let sequence = 0;
  const source = [
    { id: "host", userId: "host", name: "Host", status: "Host" },
    { id: "old", token: "old-token", userId: "guest-user", name: "Guest", email: "guest@example.com", phone: "5551234567", status: "Attending", invitedAt: "yesterday", checkedIn: true, plusGuestsAnonymousCount: 3 },
    { id: "declined", name: "Other guest", status: "Not Attending" }
  ];
  const copied = copyInviteDrafts(source, "host", () => `new-${++sequence}`);
  expect(copied).toEqual([
    { id: "new-1", token: "new-2", name: "Guest", email: "guest@example.com", phone: "5551234567", status: "Pending" },
    { id: "new-3", token: "new-4", name: "Other guest", status: "Pending" }
  ]);
  expect(source[1].status).toBe("Attending");
});

test("empty or malformed guest lists do not create invitations", () => {
  expect(copyInviteDrafts(null, "host", () => "new")).toEqual([]);
  expect(copyInviteDrafts([null, {}, "guest"], "host", () => "new")).toEqual([]);
});
