import { expect, test, type Page } from "@playwright/test";
import { join } from "path";
import {
  completeStripeCheckout,
  createTailgate,
  ensureSignedIn,
  expectAnyText,
  isQaMode,
  logout,
  makeQaAccount,
  readTailgateAttendees,
  selectExistingQaPaidEvent,
  signIn,
  signUp
} from "./qa-utils";

const qaOnly = !isQaMode();
const runId = `${Date.now()}`;
const hostAccount = makeQaAccount("host", runId);
const guestAccount = makeQaAccount("guest", runId);

let privateEventId = "";
let privateEventName = "";
let privateInviteGuestId = "";
let privateInviteToken = "";
let privateInviteEventId = "";
let privateInviteEventName = "";
let openFreeEventId = "";
let openFreeEventName = "";
let paidEventId = "";
let paidEventName = "";
let cancelEventId = "";
let cancelEventName = "";

async function ensureOpenFreeEventFixture(page: Page) {
  if (openFreeEventId) {
    return;
  }

  openFreeEventName = `Codex QA Open Free ${runId}`;
  await ensureSignedIn(page, hostAccount);
  openFreeEventId = await createTailgate({
    page,
    visibilityLabel: "Open (Free)",
    eventName: openFreeEventName,
    description: "Open free QA lifecycle tailgate.",
    location: "100 Art Rooney Ave, Pittsburgh, PA 15212",
    date: "2030-09-15",
    startTime: "11:00",
    endTime: "14:00"
  });
  await page.getByRole("button", { name: "Pin location" }).click();
  await expectAnyText(page, ["Exact in-lot pin shared by host.", "Map ready"]);
  await logout(page);
}

async function ensurePrivateInviteEventFixture(page: Page) {
  if (privateInviteEventId && privateInviteGuestId && privateInviteToken) {
    return;
  }

  privateInviteEventName = `Codex QA Invite Link ${runId}`;
  await ensureSignedIn(page, hostAccount);
  privateInviteEventId = await createTailgate({
    page,
    visibilityLabel: "Invite only",
    eventName: privateInviteEventName,
    description: "Private QA invite-link tailgate.",
    location: "Lot 5, Stadium Drive, Pittsburgh, PA",
    date: "2030-09-13",
    startTime: "15:00",
    endTime: "18:00"
  });

  await page.getByLabel("Guest name").fill(guestAccount.displayName);
  await page.getByLabel("Phone (optional)").fill(guestAccount.phone);
  await page.getByLabel("Email (optional)").fill(guestAccount.email);
  await page.getByRole("button", { name: "Add guest" }).click();
  await expectAnyText(page, ["Guest invited."]);

  const attendees = await readTailgateAttendees(privateInviteEventId);
  const invitedGuest = attendees.find(
    (attendee) => attendee.email?.toLowerCase() === guestAccount.email.toLowerCase()
  );
  if (!invitedGuest?.id || !invitedGuest.token) {
    throw new Error("Unable to find the invite-link guest record in Firestore.");
  }

  privateInviteGuestId = invitedGuest.id;
  privateInviteToken = invitedGuest.token;
  await logout(page);
}

async function ensurePaidEventFixture(page: Page) {
  if (paidEventId) {
    return;
  }

  paidEventName = `Codex QA Paid ${runId}`;
  await ensureSignedIn(page, hostAccount);
  paidEventId = await createTailgate({
    page,
    visibilityLabel: "Open (Paid)",
    eventName: paidEventName,
    description: "Paid QA lifecycle tailgate.",
    location: "100 Art Rooney Ave, Pittsburgh, PA 15212",
    date: "2030-09-16",
    startTime: "13:00",
    endTime: "16:00",
    ticketPrice: "25.00",
    capacity: "1",
    ticketSalesCutoffDays: "0"
  });
  await logout(page);
}

async function ensureCancelableEventFixture(page: Page) {
  if (cancelEventId) {
    return;
  }

  cancelEventName = `Codex QA Cancel ${runId}`;
  await ensureSignedIn(page, hostAccount);
  cancelEventId = await createTailgate({
    page,
    visibilityLabel: "Open (Free)",
    eventName: cancelEventName,
    description: "Cancelable QA tailgate.",
    location: "100 Art Rooney Ave, Pittsburgh, PA 15212",
    date: "2030-09-18",
    startTime: "17:00",
    endTime: "20:00"
  });
  await logout(page);
}

test.describe("QA release flows", () => {
  test.describe.configure({ mode: "serial" });
  test.skip(qaOnly, "QA lifecycle tests only run when PLAYWRIGHT_E2E_MODE=qa.");
  test.setTimeout(180000);

  test("auth flow creates host and guest accounts", async ({ page }) => {
    await signUp(page, hostAccount);
    await logout(page);
    await signUp(page, guestAccount);
    await logout(page);
    await signIn(page, hostAccount);
    await expect(page.getByRole("button", { name: /create tailgate/i })).toBeVisible();
  });

  test("host can create and manage private and open-free events", async ({ page }) => {
    await signIn(page, hostAccount);

    privateEventName = `Codex QA Private ${runId}`;
    privateEventId = await createTailgate({
      page,
      visibilityLabel: "Invite only",
      eventName: privateEventName,
      description: "Private QA lifecycle tailgate.",
      location: "Lot 4, Stadium Drive, Pittsburgh, PA",
      date: "2030-09-14",
      startTime: "10:00",
      endTime: "13:00"
    });

    await page.getByRole("button", { name: "Edit details" }).click();
    await page.getByLabel("Event name").fill(`${privateEventName} Updated`);
    await page.getByRole("button", { name: "Save details" }).click();
    await expect(page.getByText(`${privateEventName} Updated`)).toBeVisible({ timeout: 30000 });
    privateEventName = `${privateEventName} Updated`;

    await page.getByRole("button", { name: /add schedule|build schedule|edit schedule/i }).click();
    await expect(page.getByRole("heading", { name: "Timeline" })).toBeVisible({ timeout: 30000 });

    await page.getByLabel("Step title").fill("Fire up the grill");
    await page.getByLabel("Start time").nth(0).fill("10:30");
    await page.getByLabel("Description (optional)").fill("Start the food and open the coolers.");
    await page.getByPlaceholder("0").first().fill("1");
    await page.getByPlaceholder("30").fill("15");
    await page.getByRole("button", { name: "Add step" }).click();
    await expect(page.getByText("Fire up the grill")).toBeVisible({ timeout: 30000 });
    await page.getByRole("button", { name: "Publish schedule" }).click();
    await expect(page.getByRole("button", { name: "Unpublish schedule" })).toBeVisible({
      timeout: 30000
    });

    await page.getByLabel("Quiz name").fill("QA Pregame Trivia");
    await page.getByRole("button", { name: "True / False" }).click();
    await page.getByLabel("Question text").fill("The command center redesign is live.");
    await page.locator(".tailgate-quiz-editor .create-wizard-choice-radio").first().click();
    await page.getByRole("button", { name: /save quiz|update quiz/i }).click();
    await expectAnyText(page, ["Update quiz", "1 question ready"]);

    await page.getByLabel("Guest name").fill(`${guestAccount.firstName} ${guestAccount.lastName}`);
    await page.getByLabel("Phone (optional)").fill(guestAccount.phone);
    await page.getByLabel("Email (optional)").fill(guestAccount.email);
    await page.getByRole("button", { name: "Add guest" }).click();
    await expectAnyText(page, ["Guest invited."]);

    openFreeEventName = `Codex QA Open Free ${runId}`;
    openFreeEventId = await createTailgate({
      page,
      visibilityLabel: "Open (Free)",
      eventName: openFreeEventName,
      description: "Open free QA lifecycle tailgate.",
      location: "100 Art Rooney Ave, Pittsburgh, PA 15212",
      date: "2030-09-15",
      startTime: "11:00",
      endTime: "14:00"
    });

    await page.getByRole("button", { name: "Pin location" }).click();
    await expectAnyText(page, ["Exact in-lot pin shared by host.", "Map ready"]);
    await logout(page);
  });

  test("guest can RSVP to an open-free tailgate", async ({ page }) => {
    await ensureOpenFreeEventFixture(page);
    await ensureSignedIn(page, guestAccount);
    await page.goto(`/#/tailgates/${openFreeEventId}`);

    await page.getByRole("button", { name: "I'm coming" }).click();
    await expectAnyText(page, ["You're in", "Update my count"]);
  });

  test("guest can RSVP to a private tailgate through an invite link", async ({ page }) => {
    await ensurePrivateInviteEventFixture(page);
    await page.goto(
      `/#/tailgates/${privateInviteEventId}?guestId=${encodeURIComponent(
        privateInviteGuestId
      )}&token=${encodeURIComponent(privateInviteToken)}`
    );

    await expect(page.getByText("Your RSVP")).toBeVisible({ timeout: 30000 });
    await page.getByRole("button", { name: "Going" }).click();
    await page.getByRole("button", { name: "Save RSVP" }).click();

    await expect(page.getByText("RSVP updated to Going.")).toBeVisible({ timeout: 30000 });
    await page.reload();
    await expect(page.getByText("Going")).toBeVisible({ timeout: 30000 });
  });

  test("guest can contact the host from event details", async ({ page }) => {
    await ensureOpenFreeEventFixture(page);
    await ensureSignedIn(page, guestAccount);
    await page.goto(`/#/tailgates/${openFreeEventId}`);

    await page.getByRole("button", { name: /contact host/i }).click();
    await page.locator("#contact-host-message").fill(
      `QA host contact ${runId}: can you confirm parking and arrival timing?`
    );
    await page.getByRole("button", { name: "Send email" }).click();

    await expect(page.getByText(/Email sent to /i)).toBeVisible({ timeout: 30000 });
    await expect(page.locator("#contact-host-message")).toHaveCount(0);
  });

  test("guest can post an event feed photo", async ({ page }) => {
    await ensureOpenFreeEventFixture(page);
    await ensureSignedIn(page, guestAccount);
    await page.goto(`/#/tailgates/${openFreeEventId}`);

    await page.getByRole("button", { name: "Event feed" }).click();
    await page.getByPlaceholder("Share an update...").fill(`Guest QA post ${runId}`);
    await page.locator('input[type="file"]').setInputFiles(
      join(process.cwd(), "tests/e2e/fixtures/qa-feed-upload.svg")
    );
    await expect(page.getByAltText("Selected upload")).toBeVisible({ timeout: 30000 });
    await page.getByRole("button", { name: "Post" }).click();
    await expect(page.locator(".event-feed-post-text", { hasText: `Guest QA post ${runId}` })).toBeVisible({
      timeout: 30000
    });
    await expect(page.getByAltText("Post image 1")).toBeVisible({ timeout: 30000 });

    await logout(page);
  });

  test("host can cancel a QA tailgate from event details", async ({ page }) => {
    await ensureCancelableEventFixture(page);
    await ensureSignedIn(page, hostAccount);
    await page.goto(`/#/tailgates/${cancelEventId}`);

    await page.getByRole("button", { name: "Cancel tailgate" }).click();
    await page.getByRole("button", { name: "Confirm cancel" }).click();

    await expectAnyText(page, ["Tailgate cancelled.", "Tailgate cancelled"]);
    await page.reload();
    await expect(page.getByText(/cancelled on/i)).toBeVisible({ timeout: 30000 });
  });

  test("host can check in tickets with invalid code handling", async ({ page }) => {
    await ensurePaidEventFixture(page);
    await ensureSignedIn(page, hostAccount);
    await page.goto(`/#/tailgates/${paidEventId}/checkin`);

    await expect(page.getByRole("heading", { name: "Check-in by code" })).toBeVisible({
      timeout: 30000
    });
    await page.getByLabel("Ticket Code").fill("TG-INVALID");
    await page.getByRole("button", { name: "Check in" }).click();

    await expect(page.getByText("Invalid ticket code.")).toBeVisible({ timeout: 30000 });
  });

  test("host sees the guest list and can open attendee messaging", async ({ page }) => {
    await signIn(page, hostAccount);
    await page.goto(`/#/tailgates/${privateEventId}`);

    await expect(page.getByRole("heading", { name: "Guest List" })).toBeVisible();
    await expectAnyText(page, [guestAccount.email, guestAccount.firstName, guestAccount.lastName], 30000);

    await page.getByRole("button", { name: /message attendees/i }).click();
    await page.getByLabel("Text attendees").fill(`QA host broadcast ${runId}`);
    await expect(page.getByRole("button", { name: "Send text" })).toBeEnabled();
    await page.getByRole("button", { name: "Close", exact: true }).click();
    await expect(page.getByLabel("Text attendees")).toHaveCount(0);

    await logout(page);
  });

  test("guest can purchase a QA paid ticket", async ({ page }) => {
    await ensurePaidEventFixture(page);
    paidEventId = paidEventId || (await selectExistingQaPaidEvent()).id;

    await ensureSignedIn(page, guestAccount);
    await page.goto(`/#/tailgates/${paidEventId}`);
    await expect(page.getByText(paidEventName)).toBeVisible({ timeout: 30000 });

    await page.getByRole("button", { name: /purchase ticket|buy more tickets/i }).click();
    await completeStripeCheckout(page, {
      email: guestAccount.email,
      cardholderName: `${guestAccount.firstName} ${guestAccount.lastName}`,
      zip: "15212",
      phone: guestAccount.phone
    });

    await page.waitForURL(new RegExp(`#\\/tailgates\\/${paidEventId}\\?checkout=success`), {
      timeout: 120000
    });
    await expectAnyText(page, [
      "Purchase confirmed. Your tickets are ready.",
      "Your tickets are confirmed.",
      "Payment received. Ticket confirmation may take a moment.",
      "You already have 1 ticket."
    ]);

    await expectAnyText(page, ["This tailgate is sold out.", "Sold out"], 120000);

    await logout(page);
  });
});
