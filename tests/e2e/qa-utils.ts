import { expect, Locator, Page } from "@playwright/test";
import { getApps, initializeApp } from "firebase/app";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  limit,
  query,
  where
} from "firebase/firestore";

export type QaAccount = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;
  displayName: string;
};

export type QaPaidEvent = {
  id: string;
  eventName: string;
};

export type QaTailgateAttendee = {
  id: string;
  token?: string;
  name: string;
  email?: string;
  phone?: string;
  status?: string;
};

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

function getFirebaseApp() {
  return getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
}

function currentPasswordField(page: Page) {
  return page.locator('input[autocomplete="current-password"]').first();
}

function newPasswordFields(page: Page) {
  return page.locator('input[autocomplete="new-password"]');
}

async function waitForAuthExitOrError(page: Page, timeout = 30000) {
  const deadline = Date.now() + timeout;
  const errorBanner = page.locator(".error-banner").first();

  while (Date.now() < deadline) {
    const currentUrl = page.url();
    if (!currentUrl.includes("/#/login")) {
      return;
    }

    if ((await errorBanner.count()) > 0) {
      try {
        if (await errorBanner.isVisible()) {
          const message = (await errorBanner.textContent())?.trim() ?? "Authentication failed.";
          throw new Error(message);
        }
      } catch (error) {
        if (error instanceof Error && error.message) {
          throw error;
        }
      }
    }

    await page.waitForTimeout(250);
  }

  throw new Error(`Authentication did not leave the login page within ${timeout}ms.`);
}

export function isQaMode() {
  return process.env.PLAYWRIGHT_E2E_MODE === "qa";
}

export function makeQaAccount(prefix: string, runId: string): QaAccount {
  const normalizedPrefix = prefix.replace(/[^a-z0-9]/gi, "").toLowerCase();
  const email = `codex.${normalizedPrefix}.${runId}@example.com`;

  return {
    firstName: normalizedPrefix === "host" ? "Host" : "Guest",
    lastName: `QA ${runId.slice(-4)}`,
    phone: normalizedPrefix === "host" ? "(412) 555-0101" : "(412) 555-0102",
    email,
    password: "CodexTest!123",
    displayName: `${normalizedPrefix === "host" ? "Host" : "Guest"} QA ${runId.slice(-4)}`
  };
}

export function tailgateIdFromUrl(url: string) {
  const match = url.match(/#\/tailgates\/([^/?#]+)/);
  if (!match) {
    throw new Error(`Could not parse tailgate id from ${url}`);
  }
  return decodeURIComponent(match[1]);
}

function isCreatedTailgateDetailsUrl(url: string | URL) {
  const normalized = typeof url === "string" ? new URL(url) : url;
  const hashPath = normalized.hash.startsWith("#") ? normalized.hash.slice(1) : normalized.hash;
  const match = hashPath.match(/^\/tailgates\/([^/?#]+)$/);
  return Boolean(match && match[1] && match[1] !== "new");
}

export async function signUp(page: Page, account: QaAccount) {
  await page.goto("/#/login?mode=signup");
  await page.getByLabel("First Name").fill(account.firstName);
  await page.getByLabel("Last Name").fill(account.lastName);
  await page.getByLabel("Phone").fill(account.phone);
  await page.getByLabel("Email").fill(account.email);
  await newPasswordFields(page).nth(0).fill(account.password);
  await newPasswordFields(page).nth(1).fill(account.password);
  await page.getByRole("checkbox").check();

  await page.getByRole("button", { name: "Create account" }).click();
  await waitForAuthExitOrError(page);

  await expect(page.getByRole("button", { name: /create tailgate/i })).toBeVisible();
}

export async function signIn(page: Page, account: QaAccount) {
  await page.goto("/#/login?mode=login");
  await page.getByLabel("Email").fill(account.email);
  await currentPasswordField(page).fill(account.password);

  await page.getByRole("button", { name: "Sign in" }).click();
  await waitForAuthExitOrError(page);

  await expect(page.getByRole("button", { name: /create tailgate/i })).toBeVisible();
}

export async function ensureSignedIn(page: Page, account: QaAccount) {
  try {
    await signIn(page, account);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (!/incorrect|not sign in|try again/i.test(message)) {
      throw error;
    }
    await signUp(page, account);
  }
}

export async function logout(page: Page) {
  await page.getByRole("button", { name: "Account" }).click();
  await Promise.all([
    page.waitForURL(/#\/login/, { timeout: 30000 }),
    page.getByRole("menuitem", { name: "Logout" }).click()
  ]);
}

export async function createTailgate(params: {
  page: Page;
  visibilityLabel: "Invite only" | "Open (Free)" | "Open (Paid)";
  eventName: string;
  description: string;
  location: string;
  date: string;
  startTime: string;
  endTime: string;
  ticketPrice?: string;
  capacity?: string;
  ticketSalesCutoffDays?: string;
}) {
  const {
    page,
    visibilityLabel,
    eventName,
    description,
    location,
    date,
    startTime,
    endTime,
    ticketPrice = "25.00",
    capacity = "",
    ticketSalesCutoffDays = "0"
  } = params;
  await page.goto("/#/tailgates/new");
  await page.getByLabel(new RegExp(visibilityLabel.replace(/[()]/g, "\\$&"), "i")).check();

  if (visibilityLabel === "Open (Paid)") {
    await page.getByLabel("Ticket Price (USD)").fill(ticketPrice);
    await page.getByLabel("Capacity (optional)").fill(capacity);
    await page.getByLabel("Stop selling tickets (days before)").fill(ticketSalesCutoffDays);
  }

  await page.getByRole("button", { name: /next: event details/i }).click();

  await page.getByLabel("Tailgate Event Name").fill(eventName);
  await page.getByLabel("Date").fill(date);
  await page.getByLabel("Start Time").fill(startTime);
  await page.getByLabel("End Time").fill(endTime);
  await page.getByLabel("Description").fill(description);
  await page.getByRole("button", { name: /next: event location/i }).click();

  await page.getByLabel("Location").fill(location);
  if (visibilityLabel !== "Invite only") {
    await page.getByRole("button", { name: /find on map/i }).click();
    await expect(page.getByTitle("Tailgate location preview")).toBeVisible({ timeout: 20000 });
  }

  await page.getByRole("button", { name: /next:/i }).click();
  await page.getByRole("button", { name: /next: review and create/i }).click();

  await Promise.all([
    page.waitForURL((url) => isCreatedTailgateDetailsUrl(url), { timeout: 30000 }),
    page.getByRole("button", { name: /^create$/i }).click()
  ]);

  const tailgateId = tailgateIdFromUrl(page.url());
  if (tailgateId === "new") {
    throw new Error(`Expected a created tailgate id but stayed on ${page.url()}`);
  }

  await expect(page.getByText(eventName)).toBeVisible({ timeout: 30000 });
  return tailgateId;
}

export async function fillWithinLabeledField(scope: Locator, label: string, value: string) {
  await scope.getByLabel(label).fill(value);
}

export async function selectExistingQaPaidEvent(): Promise<QaPaidEvent> {
  const db = getFirestore(getFirebaseApp());
  const snapshot = await getDocs(
    query(collection(db, "tailgateEvents"), where("visibilityType", "==", "open_paid"), limit(10))
  );

  const now = Date.now();
  const candidates = snapshot.docs
    .map((docSnapshot) => {
      const data = docSnapshot.data() as Record<string, unknown>;
      const rawStart = data.startDateTime ?? data.dateTime;
      const rawSeconds =
        typeof rawStart === "object" &&
        rawStart &&
        "seconds" in rawStart &&
        typeof (rawStart as { seconds?: unknown }).seconds === "number"
          ? (rawStart as { seconds: number }).seconds
          : null;
      const startMs = rawSeconds ? rawSeconds * 1000 : 0;
      return {
        id: docSnapshot.id,
        eventName: String(data.eventName ?? data.name ?? "Paid Tailgate"),
        status: String(data.status ?? "").toLowerCase(),
        startMs
      };
    })
    .filter((event) => event.status !== "cancelled" && event.startMs > now)
    .sort((left, right) => left.startMs - right.startMs);

  if (candidates.length === 0) {
    throw new Error("No active QA paid tailgates are available for checkout testing.");
  }

  return {
    id: candidates[0].id,
    eventName: candidates[0].eventName
  };
}

export async function readTailgateAttendees(eventId: string): Promise<QaTailgateAttendee[]> {
  const db = getFirestore(getFirebaseApp());
  const snapshot = await getDoc(doc(db, "tailgateEvents", eventId));

  if (!snapshot.exists()) {
    return [];
  }

  const data = snapshot.data() as Record<string, unknown>;
  if (!Array.isArray(data.attendees)) {
    return [];
  }

  return data.attendees
    .map((entry) => (typeof entry === "object" && entry ? (entry as Record<string, unknown>) : null))
    .filter((entry): entry is Record<string, unknown> => Boolean(entry))
    .map((entry) => ({
      id: typeof entry.id === "string" ? entry.id : "",
      token: typeof entry.token === "string" ? entry.token : undefined,
      name: typeof entry.name === "string" ? entry.name : "",
      email: typeof entry.email === "string" ? entry.email : undefined,
      phone: typeof entry.phone === "string" ? entry.phone : undefined,
      status: typeof entry.status === "string" ? entry.status : undefined
    }))
    .filter((attendee) => attendee.id.length > 0);
}

export async function expectAnyText(page: Page, values: string[], timeout = 30000) {
  const deadline = Date.now() + timeout;

  while (Date.now() < deadline) {
    for (const value of values) {
      const locator = page.getByText(value);
      if ((await locator.count()) > 0 && (await locator.first().isVisible())) {
        return;
      }
    }
    await page.waitForTimeout(500);
  }

  throw new Error(`None of the expected texts were found: ${values.join(", ")}`);
}

async function waitForFirstVisible(page: Page, locators: Locator[], timeout = 30000) {
  const deadline = Date.now() + timeout;

  while (Date.now() < deadline) {
    for (const locator of locators) {
      if ((await locator.count()) === 0) continue;
      const first = locator.first();
      try {
        if (await first.isVisible()) {
          return first;
        }
      } catch {
        // Keep polling while Stripe hydrates the form.
      }
    }
    await page.waitForTimeout(500);
  }

  return null;
}

export async function completeStripeCheckout(
  page: Page,
  details?: {
    email?: string;
    cardholderName?: string;
    zip?: string;
    phone?: string;
  }
) {
  await page.waitForURL(/stripe\.com|checkout/i, { timeout: 45000 });

  const contactSelectors = [
    page.getByText(/contact information/i),
    page.getByText(/payment method/i),
    page.getByPlaceholder("email@example.com"),
    page.getByPlaceholder("1234 1234 1234 1234")
  ];
  await waitForFirstVisible(page, contactSelectors, 30000);

  const cardNumberSelectors = [
    page.getByPlaceholder("1234 1234 1234 1234"),
    page.locator('input[name="cardNumber"]'),
    page.locator('input[name="cardnumber"]')
  ];
  const expirySelectors = [
    page.getByPlaceholder("MM / YY"),
    page.getByPlaceholder("MM/YY"),
    page.locator('input[name="exp-date"]'),
    page.locator('input[name="expDate"]'),
    page.locator('input[name="exp-date"]')
  ];
  const cvcSelectors = [
    page.getByPlaceholder("CVC"),
    page.locator('input[name="cvc"]')
  ];

  const numberFields = [
    ...cardNumberSelectors,
    page
      .frameLocator('iframe[title*="card number"], iframe[title*="Card number"], iframe[title*="payment input"]')
      .locator('input[name="cardnumber"], input[placeholder="1234 1234 1234 1234"]')
  ];
  const expiryFields = [
    ...expirySelectors,
    page
      .frameLocator('iframe[title*="expiration"], iframe[title*="Expiry"], iframe[title*="payment input"]')
      .locator('input[name="exp-date"], input[placeholder="MM / YY"], input[placeholder="MM/YY"]')
  ];
  const cvcFields = [
    ...cvcSelectors,
    page
      .frameLocator('iframe[title*="security code"], iframe[title*="CVC"], iframe[title*="payment input"]')
      .locator('input[name="cvc"], input[placeholder="CVC"]')
  ];

  const emailFields = [
    page.getByLabel(/^email$/i),
    page.getByPlaceholder("email@example.com"),
    page.locator('input[type="email"]')
  ];
  const nameFields = [
    page.getByLabel(/cardholder name|name on card/i),
    page.getByPlaceholder(/full name on card|name on card/i)
  ];
  const zipFields = [
    page.getByLabel(/postal code|zip code|zip/i),
    page.getByPlaceholder(/postal code|zip code|zip/i)
  ];
  const saveInfoCheckbox = page.getByLabel(/save my information/i).first();

  if (details?.email) {
    const emailField = await waitForFirstVisible(page, emailFields, 15000);
    if (emailField) {
      await emailField.fill(details.email);
    }
  }

  const cardField = await waitForFirstVisible(page, numberFields, 30000);
  const expiryField = await waitForFirstVisible(page, expiryFields, 30000);
  const cvcField = await waitForFirstVisible(page, cvcFields, 30000);

  if (!cardField || !expiryField || !cvcField) {
    throw new Error("Unable to locate Stripe checkout fields.");
  }

  await cardField.fill("4242424242424242");
  await expiryField.fill("1234");
  await cvcField.fill("123");

  const cardholderName = details?.cardholderName ?? "Codex QA";
  const zip = details?.zip ?? "15212";

  const nameField = await waitForFirstVisible(page, nameFields, 10000);
  if (nameField) {
    await nameField.fill(cardholderName);
  }

  const zipField = await waitForFirstVisible(page, zipFields, 10000);
  if (zipField) {
    await zipField.fill(zip);
  }

  if ((await saveInfoCheckbox.count()) > 0) {
    try {
      if (await saveInfoCheckbox.isVisible()) {
        await saveInfoCheckbox.uncheck();
      }
    } catch {
      // Some Stripe variants hide or replace the Link checkbox; ignore when it cannot be toggled.
    }
  }

  const submitButton = page
    .getByRole("button", {
      name: /pay|purchase|subscribe|complete order|buy/i
    })
    .first();

  await submitButton.click();
}
