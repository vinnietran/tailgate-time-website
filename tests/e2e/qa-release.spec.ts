import { expect, test, type Page } from "@playwright/test";
import {
  completeStripeCheckout,
  createTailgate,
  ensureSignedIn,
  expectAnyText,
  isQaMode,
  logout,
  makeQaAccount,
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
let openFreeEventId = "";
let openFreeEventName = "";
let paidEventId = "";
let paidEventName = "";

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

  test("guest can post into the event feed", async ({ page }) => {
    await ensureOpenFreeEventFixture(page);
    await ensureSignedIn(page, guestAccount);
    await page.goto(`/#/tailgates/${openFreeEventId}`);

    await page.getByRole("button", { name: "Event feed" }).click();
    await page.getByPlaceholder("Share an update...").fill(`Guest QA post ${runId}`);
    await page.getByRole("button", { name: "Post" }).click();
    await expect(page.locator(".event-feed-post-text", { hasText: `Guest QA post ${runId}` })).toBeVisible({
      timeout: 30000
    });

    await logout(page);
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
    const paidEvent = await selectExistingQaPaidEvent();
    paidEventId = paidEvent.id;
    paidEventName = paidEvent.eventName;

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

    await logout(page);
  });
});
