import React, { useCallback, useEffect, useMemo, useState } from "react";
import { httpsCallable } from "firebase/functions";
import { addDoc, collection, doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import AppShell from "../components/AppShell";
import { IconCalendar, IconLocation } from "../components/Icons";
import { useAuth } from "../hooks/useAuth";
import { db, functions as firebaseFunctions } from "../lib/firebase";
import { VisibilityType } from "../types";

type WizardStep = {
  key: "type" | "details" | "location" | "invite" | "review";
  title: string;
  subtitle: string;
};

type Guest = {
  id: string;
  name: string;
  phone: string;
};

type Expectations = {
  foodProvided: boolean;
  alcoholProvided: boolean;
  byobWelcome: boolean;
  familyFriendly: boolean;
  musicLoud: boolean;
  grillAvailable: boolean;
};

type QuizQuestion = {
  text: string;
  choices: [string, string, string, string];
  correctChoice: number | null;
};

type LatLng = {
  lat: number;
  lng: number;
};

type StripeConnectStatus = "not_started" | "pending" | "complete" | "restricted";

const wizardSteps: WizardStep[] = [
  { key: "type", title: "Step 1", subtitle: "Tailgate Type" },
  { key: "details", title: "Step 2", subtitle: "Event Details" },
  { key: "location", title: "Step 3", subtitle: "Event Location" },
  { key: "invite", title: "Step 4", subtitle: "Invite Friends" },
  { key: "review", title: "Step 5", subtitle: "Review and Create" }
];

const visibilityOptions: Array<{
  key: VisibilityType;
  label: string;
  description: string;
}> = [
  { key: "private", label: "Invite Only", description: "Only invited guests can join." },
  { key: "open_free", label: "Open (Free)", description: "Discoverable and free to join." },
  { key: "open_paid", label: "Open (Paid)", description: "Discoverable with paid tickets." }
];

const expectationOptions: Array<{
  key: keyof Expectations;
  label: string;
}> = [
  { key: "foodProvided", label: "Food provided" },
  { key: "alcoholProvided", label: "Alcohol provided" },
  { key: "byobWelcome", label: "BYOB welcome" },
  { key: "familyFriendly", label: "Family-friendly" },
  { key: "musicLoud", label: "Loud music / party vibe" },
  { key: "grillAvailable", label: "Grill available" }
];

const expectationsDefaults: Expectations = {
  foodProvided: false,
  alcoholProvided: false,
  byobWelcome: false,
  familyFriendly: false,
  musicLoud: false,
  grillAvailable: false
};

const seededContacts: Guest[] = [
  { id: "c-anna", name: "Anna Haro", phone: "555-522-8243" },
  { id: "c-daniel", name: "Daniel Higgins Jr.", phone: "555-478-7672" },
  { id: "c-david", name: "David Taylor", phone: "555-610-6679" },
  { id: "c-hank", name: "Hank M. Zakroff", phone: "(555) 766-4823" },
  { id: "c-john", name: "John Appleseed", phone: "888-555-5512" },
  { id: "c-kate", name: "Kate Bell", phone: "(555) 564-8583" }
];

const minTicketPriceCents = 500;
const CONNECT_RETURN_URL =
  import.meta.env.VITE_CONNECT_RETURN_URL ?? "https://tailgate-time.com/connect-return";
const CONNECT_REFRESH_URL =
  import.meta.env.VITE_CONNECT_REFRESH_URL ?? "https://tailgate-time.com/connect-refresh";

function formatPhone(text: string) {
  const digits = text.replace(/\D/g, "").slice(0, 10);
  const part1 = digits.slice(0, 3);
  const part2 = digits.slice(3, 6);
  const part3 = digits.slice(6, 10);

  if (digits.length <= 3) return part1;
  if (digits.length <= 6) return `(${part1}) ${part2}`;
  return `(${part1}) ${part2}-${part3}`;
}

function parsePriceToCents(value: string) {
  const normalized = value.replace(/[^0-9.]/g, "");
  if (!normalized) return null;
  const parsed = Number(normalized);
  if (!Number.isFinite(parsed)) return null;
  return Math.round(parsed * 100);
}

function parseCapacity(value: string) {
  if (!value.trim()) return null;
  const parsed = Number(value.trim());
  if (!Number.isFinite(parsed) || parsed < 1) return null;
  return Math.floor(parsed);
}

function createLocalId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function toStartDateTime(eventDate: string, eventTime: string) {
  const [yearRaw, monthRaw, dayRaw] = eventDate.split("-");
  const [hoursRaw, minutesRaw] = eventTime.split(":");
  const year = Number(yearRaw);
  const month = Number(monthRaw);
  const day = Number(dayRaw);
  const hours = Number(hoursRaw);
  const minutes = Number(minutesRaw);
  if ([year, month, day, hours, minutes].some((value) => !Number.isFinite(value))) {
    return null;
  }
  const combined = new Date(year, month - 1, day, hours, minutes, 0, 0);
  if (Number.isNaN(combined.getTime())) return null;
  return combined;
}

function buildMapEmbedUrl(coords: LatLng) {
  const delta = 0.008;
  const left = coords.lng - delta;
  const right = coords.lng + delta;
  const top = coords.lat + delta;
  const bottom = coords.lat - delta;
  return `https://www.openstreetmap.org/export/embed.html?bbox=${left}%2C${bottom}%2C${right}%2C${top}&layer=mapnik&marker=${coords.lat}%2C${coords.lng}`;
}

function resolveStripeConnectStatus(data: Record<string, unknown> | null): StripeConnectStatus {
  const raw = data?.stripeConnectStatus;
  if (raw === "pending" || raw === "complete" || raw === "restricted") {
    return raw;
  }
  return "not_started";
}

function isPayoutReady(data: Record<string, unknown> | null) {
  if (!data) return false;
  return (
    typeof data.stripeConnectAccountId === "string" &&
    data.stripeConnectAccountId.length > 0 &&
    data.stripeConnectStatus === "complete" &&
    data.payoutsEnabled === true
  );
}

export default function CreateTailgateWizard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [stepIndex, setStepIndex] = useState(0);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [payoutReady, setPayoutReady] = useState(false);
  const [connectStatus, setConnectStatus] = useState<StripeConnectStatus>("not_started");
  const [payoutModalOpen, setPayoutModalOpen] = useState(false);
  const [payoutSetupLoading, setPayoutSetupLoading] = useState(false);
  const [payoutSetupError, setPayoutSetupError] = useState<string | null>(null);

  const [eventName, setEventName] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");

  const [locationSummary, setLocationSummary] = useState("");
  const [locationCoords, setLocationCoords] = useState<LatLng | null>(null);
  const [resolvingLocation, setResolvingLocation] = useState(false);

  const [visibilityType, setVisibilityType] = useState<VisibilityType>("private");
  const [allowGuestDetails, setAllowGuestDetails] = useState(false);
  const [priceInput, setPriceInput] = useState("");
  const [capacityInput, setCapacityInput] = useState("");
  const [expectations, setExpectations] = useState<Expectations>(expectationsDefaults);

  const [guests, setGuests] = useState<Guest[]>([]);
  const [contactSearch, setContactSearch] = useState("");
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [selectedContactIds, setSelectedContactIds] = useState<string[]>([]);

  const [manualGuestName, setManualGuestName] = useState("");
  const [manualGuestPhone, setManualGuestPhone] = useState("");

  const [quizQuestion, setQuizQuestion] = useState<QuizQuestion>({
    text: "",
    choices: ["", "", "", ""],
    correctChoice: null
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const filteredContacts = useMemo(() => {
    const query = contactSearch.trim().toLowerCase();
    if (!query) return seededContacts;
    return seededContacts.filter((contact) =>
      `${contact.name} ${contact.phone}`.toLowerCase().includes(query)
    );
  }, [contactSearch]);

  const pricingInvalid = useMemo(() => {
    if (visibilityType !== "open_paid") return false;
    const cents = parsePriceToCents(priceInput);
    return !cents || cents < minTicketPriceCents;
  }, [priceInput, visibilityType]);

  const capacityInvalid = useMemo(() => {
    if (visibilityType !== "open_paid") return false;
    if (!capacityInput.trim()) return false;
    return parseCapacity(capacityInput) === null;
  }, [capacityInput, visibilityType]);

  const progressLabel = `${stepIndex + 1} / ${wizardSteps.length}`;
  const mapUrl = locationCoords ? buildMapEmbedUrl(locationCoords) : null;
  const selectedVisibility = visibilityOptions.find((option) => option.key === visibilityType);

  const refreshPayoutStatus = useCallback(async (): Promise<boolean> => {
    if (!user?.uid || !db) {
      setPayoutReady(false);
      setConnectStatus("not_started");
      return false;
    }

    try {
      const userSnap = await getDoc(doc(db, "users", user.uid));
      const data = userSnap.exists() ? (userSnap.data() as Record<string, unknown>) : null;
      const ready = isPayoutReady(data);
      setPayoutReady(ready);
      setConnectStatus(resolveStripeConnectStatus(data));
      return ready;
    } catch (error) {
      console.error("Failed to refresh Stripe payout status", error);
      setPayoutReady(false);
      setConnectStatus("not_started");
      return false;
    }
  }, [user?.uid]);

  useEffect(() => {
    void refreshPayoutStatus();
  }, [refreshPayoutStatus]);

  useEffect(() => {
    const onFocus = () => {
      void refreshPayoutStatus();
    };
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [refreshPayoutStatus]);

  const resolveAddressToCoords = async () => {
    const query = locationSummary.trim();
    if (!query) return null;
    setResolvingLocation(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(
          query
        )}`
      );
      const payload = (await response.json()) as Array<{ lat: string; lon: string }>;
      const first = payload[0];
      if (!first) return null;
      const lat = Number(first.lat);
      const lng = Number(first.lon);
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
      const next = { lat, lng };
      setLocationCoords(next);
      return next;
    } catch (error) {
      console.error("Failed to resolve address", error);
      return null;
    } finally {
      setResolvingLocation(false);
    }
  };

  const clearFieldError = (key: string) => {
    if (!errors[key]) return;
    setErrors((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const handleVisibilitySelect = (next: VisibilityType) => {
    clearFieldError("visibilityType");
    if (next === "open_paid" && !payoutReady && visibilityType !== "open_paid") {
      setPayoutSetupError(null);
      setPayoutModalOpen(true);
      return;
    }
    setVisibilityType(next);
  };

  const handlePayoutSetup = async () => {
    if (!user?.uid) {
      setPayoutSetupError("You must be logged in to set up payouts.");
      return;
    }
    if (!firebaseFunctions) {
      setPayoutSetupError("Functions are not configured in this environment.");
      return;
    }

    setPayoutSetupLoading(true);
    setPayoutSetupError(null);
    try {
      const createLink = httpsCallable(firebaseFunctions, "createConnectOnboardingLink");
      const result = await createLink({
        returnUrl: CONNECT_RETURN_URL,
        refreshUrl: CONNECT_REFRESH_URL
      });
      const url = (result.data as { url?: string } | null)?.url;
      if (!url || typeof url !== "string") {
        throw new Error("Missing onboarding URL");
      }
      const newTab = window.open(url, "_blank", "noopener,noreferrer");
      if (!newTab) {
        window.location.assign(url);
      }
    } catch (error) {
      console.error("Failed to start Stripe onboarding", error);
      setPayoutSetupError("Unable to start payout setup. Try again.");
      setPayoutSetupLoading(false);
    }
  };

  const validateStep = (index: number) => {
    const nextErrors: Record<string, string> = {};

    if (index === 0) {
      if (visibilityType === "open_paid" && !payoutReady) {
        nextErrors.visibilityType = "Set up payouts to host paid tailgates.";
      }
      if (visibilityType === "open_paid") {
        const cents = parsePriceToCents(priceInput);
        if (!cents || cents < minTicketPriceCents) {
          nextErrors.priceInput = "Minimum price is $5.00";
        }
        if (capacityInput.trim() && parseCapacity(capacityInput) === null) {
          nextErrors.capacityInput = "Capacity must be at least 1.";
        }
      }
    }

    if (index === 1) {
      if (!eventName.trim()) nextErrors.eventName = "Event name is required.";
      if (!eventDate) nextErrors.eventDate = "Date is required.";
      if (!eventTime) nextErrors.eventTime = "Time is required.";
      if (!eventDescription.trim()) nextErrors.eventDescription = "Description is required.";
    }

    if (index === 2) {
      if (!locationSummary.trim()) nextErrors.locationSummary = "Location is required.";
    }

    if (index === 3) {
      const quizUsed =
        quizQuestion.text.trim() ||
        quizQuestion.choices.some((choice) => choice.trim()) ||
        quizQuestion.correctChoice !== null;
      if (quizUsed) {
        if (!quizQuestion.text.trim()) {
          nextErrors.quizText = "Question text is required when quiz is enabled.";
        }
        const missingChoice = quizQuestion.choices.some((choice) => !choice.trim());
        if (missingChoice) {
          nextErrors.quizChoices = "All four choices are required when quiz is enabled.";
        }
        if (quizQuestion.correctChoice === null) {
          nextErrors.quizCorrectChoice = "Pick the correct answer.";
        }
      }
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors((prev) => ({ ...prev, ...nextErrors }));
      return false;
    }

    return true;
  };

  const handleNext = async () => {
    setSuccessMessage(null);
    if (!validateStep(stepIndex)) return;

    if (stepIndex === 2 && !locationCoords) {
      await resolveAddressToCoords();
    }

    setStepIndex((current) => Math.min(current + 1, wizardSteps.length - 1));
  };

  const handleBack = () => {
    setSuccessMessage(null);
    setStepIndex((current) => Math.max(current - 1, 0));
  };

  const addManualGuest = () => {
    const name = manualGuestName.trim();
    const phone = manualGuestPhone.trim();
    const nextErrors: Record<string, string> = {};

    if (!name) nextErrors.manualGuestName = "Guest name is required.";
    if (!/^\(\d{3}\) \d{3}-\d{4}$/.test(phone)) {
      nextErrors.manualGuestPhone = "Use format (555) 555-5555.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors((prev) => ({ ...prev, ...nextErrors }));
      return;
    }

    setGuests((prev) => [...prev, { id: createLocalId(), name, phone }]);
    setManualGuestName("");
    setManualGuestPhone("");
    clearFieldError("manualGuestName");
    clearFieldError("manualGuestPhone");
  };

  const removeGuest = (id: string) => {
    setGuests((prev) => prev.filter((guest) => guest.id !== id));
  };

  const toggleContactSelection = (id: string) => {
    setSelectedContactIds((prev) =>
      prev.includes(id) ? prev.filter((value) => value !== id) : [...prev, id]
    );
  };

  const applySelectedContacts = () => {
    const selected = seededContacts.filter((contact) => selectedContactIds.includes(contact.id));
    setGuests((prev) => {
      const map = new Map(prev.map((guest) => [guest.phone, guest]));
      selected.forEach((contact) => {
        map.set(contact.phone, { id: contact.id, name: contact.name, phone: contact.phone });
      });
      return Array.from(map.values());
    });
    setContactModalOpen(false);
  };

  const handleCreateTailgate = async () => {
    if (![0, 1, 2, 3].every((index) => validateStep(index))) {
      setStepIndex((current) => {
        if (!validateStep(0)) return 0;
        if (!validateStep(1)) return 1;
        if (!validateStep(2)) return 2;
        if (!validateStep(3)) return 3;
        return current;
      });
      return;
    }

    if (!user?.uid) {
      setErrors((prev) => ({ ...prev, submit: "You must be logged in to create a tailgate." }));
      return;
    }

    const startDateTime = toStartDateTime(eventDate, eventTime);
    if (!startDateTime) {
      setErrors((prev) => ({ ...prev, submit: "Date/time is invalid." }));
      return;
    }

    setSaving(true);
    clearFieldError("submit");

    if (visibilityType === "open_paid") {
      const ready = await refreshPayoutStatus();
      if (!ready) {
        setPayoutSetupError("Set up payouts to create a paid tailgate.");
        setPayoutModalOpen(true);
        setSaving(false);
        return;
      }
    }

    let resolvedCoords = locationCoords;
    if (!resolvedCoords && locationSummary.trim()) {
      resolvedCoords = await resolveAddressToCoords();
    }

    const priceCents = parsePriceToCents(priceInput);
    const capacity = parseCapacity(capacityInput);
    const quizUsed =
      quizQuestion.text.trim() &&
      quizQuestion.choices.every((choice) => choice.trim()) &&
      quizQuestion.correctChoice !== null;

    const payload: Record<string, unknown> = {
      eventName: eventName.trim(),
      name: eventName.trim(),
      description: eventDescription.trim(),
      visibilityType,
      hasEventFeed: true,
      allowGuestDetails,
      startDateTime,
      dateTime: startDateTime,
      locationSummary: locationSummary.trim(),
      location: resolvedCoords
        ? {
            formattedAddress: locationSummary.trim(),
            lat: resolvedCoords.lat,
            lng: resolvedCoords.lng
          }
        : locationSummary.trim(),
      locationCoords: resolvedCoords,
      expectations,
      attendees: guests.map((guest) => ({
        id: guest.id,
        name: guest.name,
        phone: guest.phone,
        status: "Pending"
      })),
      hostUserId: user.uid,
      hostId: user.uid,
      hostName: user.displayName ?? "",
      hostEmail: user.email ?? "",
      status: "upcoming",
      createdAt: new Date()
    };

    if (visibilityType === "open_paid") {
      payload.priceCents = priceCents;
      payload.ticketPriceCents = priceCents;
      payload.currency = "USD";
      payload.capacity = capacity;
      payload.visibilityRequiresPayment = true;
    }

    if (quizUsed) {
      payload.quiz = {
        question: quizQuestion.text.trim(),
        choices: quizQuestion.choices.map((choice) => choice.trim()),
        correctChoice: quizQuestion.correctChoice
      };
    }

    try {
      let newId = `mock-${createLocalId()}`;
      if (db) {
        const created = await addDoc(collection(db, "tailgateEvents"), payload);
        newId = created.id;
      } else {
        console.warn("Firestore is not configured; tailgate saved locally only.");
      }
      setSuccessMessage("Tailgate created successfully.");
      navigate(`/tailgates/${newId}`);
    } catch (error) {
      console.error("Failed to create tailgate", error);
      setErrors((prev) => ({ ...prev, submit: "Unable to create tailgate. Try again." }));
    } finally {
      setSaving(false);
    }
  };

  const renderStepDetails = () => (
    <section className="create-wizard-card">
      <div className="create-wizard-card-header">
        <h2>Step 2: Event Details</h2>
      </div>

      <label className="input-label" htmlFor="event-name">Tailgate Event Name</label>
      <input
        id="event-name"
        className="text-input create-wizard-input"
        value={eventName}
        onChange={(event) => {
          setEventName(event.target.value);
          clearFieldError("eventName");
        }}
        placeholder="Football Tailgate Home Opener"
      />
      {errors.eventName ? <p className="create-wizard-error">{errors.eventName}</p> : null}

      <div className="create-wizard-date-time">
        <div>
          <label className="input-label" htmlFor="event-date">Date</label>
          <div className="create-wizard-input-with-icon">
            <input
              id="event-date"
              className="text-input create-wizard-input"
              type="date"
              value={eventDate}
              onChange={(event) => {
                setEventDate(event.target.value);
                clearFieldError("eventDate");
              }}
            />
            <IconCalendar />
          </div>
          {errors.eventDate ? <p className="create-wizard-error">{errors.eventDate}</p> : null}
        </div>
        <div>
          <label className="input-label" htmlFor="event-time">Time</label>
          <input
            id="event-time"
            className="text-input create-wizard-input"
            type="time"
            value={eventTime}
            onChange={(event) => {
              setEventTime(event.target.value);
              clearFieldError("eventTime");
            }}
          />
          {errors.eventTime ? <p className="create-wizard-error">{errors.eventTime}</p> : null}
        </div>
      </div>

      <label className="input-label" htmlFor="event-description">Description</label>
      <textarea
        id="event-description"
        className="text-input create-wizard-input create-wizard-textarea"
        value={eventDescription}
        onChange={(event) => {
          setEventDescription(event.target.value);
          clearFieldError("eventDescription");
        }}
        placeholder="Come out to tailgate and get ready for our team to win the home opener!"
      />
      {errors.eventDescription ? (
        <p className="create-wizard-error">{errors.eventDescription}</p>
      ) : null}
    </section>
  );

  const renderStepLocation = () => (
    <section className="create-wizard-card">
      <div className="create-wizard-card-header">
        <h2>Step 3: Event Location</h2>
      </div>

      <label className="input-label" htmlFor="location-summary">Location</label>
      <div className="create-wizard-input-with-icon">
        <input
          id="location-summary"
          className="text-input create-wizard-input"
          value={locationSummary}
          placeholder="Cameron Stadium, Garland Street, Bangor, Maine, USA"
          onChange={(event) => {
            setLocationSummary(event.target.value);
            clearFieldError("locationSummary");
          }}
        />
        <IconLocation />
      </div>
      {errors.locationSummary ? (
        <p className="create-wizard-error">{errors.locationSummary}</p>
      ) : null}

      <div className="create-wizard-map-actions">
        <button
          type="button"
          className="secondary-button"
          onClick={() => {
            void resolveAddressToCoords();
          }}
          disabled={resolvingLocation || !locationSummary.trim()}
        >
          {resolvingLocation ? "Finding map..." : "Find on map"}
        </button>
      </div>

      <div className="create-wizard-map-card">
        {mapUrl ? (
          <iframe
            title="Tailgate location preview"
            className="create-wizard-map-iframe"
            src={mapUrl}
          />
        ) : (
          <div className="create-wizard-map-placeholder">
            Enter a location and click "Find on map" to preview the pin.
          </div>
        )}
      </div>
    </section>
  );

  const renderStepType = () => (
    <section className="create-wizard-stack">
      <div className="create-wizard-card">
        <div className="create-wizard-card-header">
          <h2>Step 1: Tailgate Type</h2>
        </div>
        <div className="create-wizard-radio-list">
          {visibilityOptions.map((option) => (
            <label key={option.key} className="create-wizard-radio-row">
              <input
                type="radio"
                checked={visibilityType === option.key}
                onChange={() => handleVisibilitySelect(option.key)}
              />
              <span>
                <strong>{option.label}</strong>
                <span className="create-wizard-radio-help">{option.description}</span>
                {option.key === "open_paid" && !payoutReady ? (
                  <span className="create-wizard-radio-warning">Requires payout setup</span>
                ) : null}
              </span>
            </label>
          ))}
        </div>
        {errors.visibilityType ? (
          <p className="create-wizard-error">{errors.visibilityType}</p>
        ) : null}
        {visibilityType === "open_paid" ? (
          <p className="create-wizard-connect-status">
            Stripe status: {connectStatus.replace("_", " ")}
          </p>
        ) : null}

        {visibilityType === "open_paid" ? (
          <div className="create-wizard-inline-grid">
            <div>
              <label className="input-label" htmlFor="ticket-price">Ticket Price (USD)</label>
              <input
                id="ticket-price"
                className="text-input create-wizard-input"
                value={priceInput}
                onChange={(event) => {
                  setPriceInput(event.target.value.replace(/[^0-9.]/g, ""));
                  clearFieldError("priceInput");
                }}
                placeholder="15.00"
              />
              {errors.priceInput || pricingInvalid ? (
                <p className="create-wizard-error">
                  {errors.priceInput ?? "Minimum price is $5.00"}
                </p>
              ) : null}
            </div>
            <div>
              <label className="input-label" htmlFor="ticket-capacity">Capacity (optional)</label>
              <input
                id="ticket-capacity"
                className="text-input create-wizard-input"
                value={capacityInput}
                onChange={(event) => {
                  setCapacityInput(event.target.value.replace(/\D/g, ""));
                  clearFieldError("capacityInput");
                }}
                placeholder="100"
              />
              {errors.capacityInput || capacityInvalid ? (
                <p className="create-wizard-error">
                  {errors.capacityInput ?? "Capacity must be at least 1."}
                </p>
              ) : null}
            </div>
          </div>
        ) : null}

        <label className="create-wizard-switch-row">
          <input
            type="checkbox"
            checked={allowGuestDetails}
            onChange={(event) => setAllowGuestDetails(event.target.checked)}
          />
          <span>Collect guest details from each ticket purchase</span>
        </label>
      </div>

      <div className="create-wizard-card">
        <div className="create-wizard-card-header">
          <h2>Tailgate Details</h2>
        </div>
        <div className="create-wizard-chip-grid">
          {expectationOptions.map((option) => {
            const active = expectations[option.key];
            return (
              <button
                type="button"
                key={option.key}
                className={`create-wizard-chip ${active ? "active" : ""}`}
                onClick={() =>
                  setExpectations((prev) => ({
                    ...prev,
                    [option.key]: !prev[option.key]
                  }))
                }
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );

  const renderStepInvite = () => (
    <section className="create-wizard-stack">
      <div className="create-wizard-card">
        <div className="create-wizard-card-header">
          <h2>Step 4: Invite Friends</h2>
          <button
            type="button"
            className="secondary-button"
            onClick={() => setContactModalOpen(true)}
          >
            Add Guests
          </button>
        </div>

        <div className="create-wizard-inline-grid">
          <div>
            <label className="input-label" htmlFor="manual-guest-name">Guest Name</label>
            <input
              id="manual-guest-name"
              className="text-input create-wizard-input"
              value={manualGuestName}
              onChange={(event) => {
                setManualGuestName(event.target.value);
                clearFieldError("manualGuestName");
              }}
              placeholder="Guest name"
            />
            {errors.manualGuestName ? (
              <p className="create-wizard-error">{errors.manualGuestName}</p>
            ) : null}
          </div>
          <div>
            <label className="input-label" htmlFor="manual-guest-phone">Guest Phone</label>
            <input
              id="manual-guest-phone"
              className="text-input create-wizard-input"
              value={manualGuestPhone}
              onChange={(event) => {
                setManualGuestPhone(formatPhone(event.target.value));
                clearFieldError("manualGuestPhone");
              }}
              placeholder="(555) 555-5555"
            />
            {errors.manualGuestPhone ? (
              <p className="create-wizard-error">{errors.manualGuestPhone}</p>
            ) : null}
          </div>
        </div>

        <div className="create-wizard-inline-actions">
          <button type="button" className="primary-button" onClick={addManualGuest}>
            Add guest
          </button>
        </div>

        <div className="create-wizard-guest-list">
          {guests.length === 0 ? (
            <p className="meta-muted">No guests invited yet.</p>
          ) : (
            guests.map((guest) => (
              <div className="create-wizard-guest-row" key={guest.id}>
                <div>
                  <p className="create-wizard-guest-name">{guest.name}</p>
                  <p className="create-wizard-guest-phone">{guest.phone}</p>
                </div>
                <button
                  type="button"
                  className="link-button"
                  onClick={() => removeGuest(guest.id)}
                >
                  Remove
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="create-wizard-card">
        <div className="create-wizard-card-header">
          <h2>Create Quiz - Question 1 / 1</h2>
        </div>

        <label className="input-label" htmlFor="quiz-question">Question Text</label>
        <input
          id="quiz-question"
          className="text-input create-wizard-input"
          value={quizQuestion.text}
          onChange={(event) => {
            setQuizQuestion((prev) => ({ ...prev, text: event.target.value }));
            clearFieldError("quizText");
          }}
          placeholder="What is the name of our hall of fame RB?"
        />
        {errors.quizText ? <p className="create-wizard-error">{errors.quizText}</p> : null}

        <p className="input-label create-wizard-choice-label">Choices</p>
        <div className="create-wizard-choice-grid">
          {quizQuestion.choices.map((choice, index) => (
            <label key={index} className="create-wizard-choice-row">
              <input
                type="radio"
                name="quiz-correct-choice"
                checked={quizQuestion.correctChoice === index}
                onChange={() => {
                  setQuizQuestion((prev) => ({ ...prev, correctChoice: index }));
                  clearFieldError("quizCorrectChoice");
                }}
              />
              <input
                className="text-input create-wizard-input"
                value={choice}
                onChange={(event) => {
                  const nextChoices = [...quizQuestion.choices] as QuizQuestion["choices"];
                  nextChoices[index] = event.target.value;
                  setQuizQuestion((prev) => ({ ...prev, choices: nextChoices }));
                  clearFieldError("quizChoices");
                }}
                placeholder={`Choice ${index + 1}`}
              />
            </label>
          ))}
        </div>
        {errors.quizChoices ? <p className="create-wizard-error">{errors.quizChoices}</p> : null}
        {errors.quizCorrectChoice ? (
          <p className="create-wizard-error">{errors.quizCorrectChoice}</p>
        ) : null}

        <div className="create-wizard-inline-actions create-wizard-review-jump">
          <button
            type="button"
            className="primary-button"
            onClick={() => {
              if (!validateStep(3)) return;
              setStepIndex(4);
            }}
          >
            Review and Save
          </button>
        </div>
      </div>
    </section>
  );

  const renderStepReview = () => {
    const start = toStartDateTime(eventDate, eventTime);
    const formattedStart = start
      ? start.toLocaleString([], { dateStyle: "short", timeStyle: "short" })
      : "Not set";
    const enabledExpectations = expectationOptions
      .filter((option) => expectations[option.key])
      .map((option) => option.label);
    const ticketSummary =
      visibilityType === "open_paid"
        ? `Paid | $${(parsePriceToCents(priceInput) ?? 0) / 100}${
            capacityInput.trim() ? ` | Cap ${capacityInput}` : ""
          }`
        : visibilityType === "open_free"
        ? "Open (Free)"
        : "Invite Only";

    return (
      <section className="create-wizard-stack">
        <div className="create-wizard-card">
          <div className="create-wizard-card-header">
            <h2>Step 5: Review and Create</h2>
          </div>

          <dl className="create-wizard-review-grid">
            <div>
              <dt>Event Name</dt>
              <dd>{eventName || "Not set"}</dd>
            </div>
            <div>
              <dt>Description</dt>
              <dd>{eventDescription || "Not set"}</dd>
            </div>
            <div>
              <dt>Date & Time</dt>
              <dd>{formattedStart}</dd>
            </div>
            <div>
              <dt>Location</dt>
              <dd>{locationSummary || "Not set"}</dd>
            </div>
            <div>
              <dt>Tailgate Type</dt>
              <dd>{selectedVisibility?.label ?? "Invite Only"}</dd>
            </div>
            <div>
              <dt>Tickets</dt>
              <dd>{ticketSummary}</dd>
            </div>
            <div>
              <dt>Invited Guests</dt>
              <dd>{guests.length}</dd>
            </div>
            <div>
              <dt>Expectations</dt>
              <dd>
                {enabledExpectations.length > 0 ? enabledExpectations.join(", ") : "None selected"}
              </dd>
            </div>
            <div>
              <dt>Quiz</dt>
              <dd>{quizQuestion.text.trim() ? "Enabled" : "Not added"}</dd>
            </div>
          </dl>
        </div>

        <div className="create-wizard-card create-wizard-map-card">
          <div className="create-wizard-card-header">
            <h2>Map Preview</h2>
          </div>
          {mapUrl ? (
            <iframe
              title="Tailgate location review map"
              className="create-wizard-map-iframe"
              src={mapUrl}
            />
          ) : (
            <div className="create-wizard-map-placeholder">No map preview available yet.</div>
          )}
        </div>
      </section>
    );
  };

  return (
    <AppShell
      header={
        <div className="create-wizard-shell-header">
          <h1>Create Tailgate Event</h1>
          <p>Build your event with the same step-by-step wizard flow from the app.</p>
        </div>
      }
    >
      <section className="create-wizard-page">
        <div className="create-wizard-progress-header">
          <p>{wizardSteps[stepIndex].subtitle}</p>
          <span>{progressLabel}</span>
        </div>
        <div className="create-wizard-progress-bars" role="progressbar" aria-valuemin={1} aria-valuemax={wizardSteps.length} aria-valuenow={stepIndex + 1}>
          {wizardSteps.map((step, index) => (
            <div
              key={step.key}
              className={`create-wizard-progress-segment ${index <= stepIndex ? "active" : ""}`}
            />
          ))}
        </div>

        <div className="create-wizard-body">
          {stepIndex === 0 ? renderStepType() : null}
          {stepIndex === 1 ? renderStepDetails() : null}
          {stepIndex === 2 ? renderStepLocation() : null}
          {stepIndex === 3 ? renderStepInvite() : null}
          {stepIndex === 4 ? renderStepReview() : null}
        </div>

        {errors.submit ? <p className="create-wizard-error global">{errors.submit}</p> : null}
        {successMessage ? <p className="create-wizard-success">{successMessage}</p> : null}

        <div className="create-wizard-footer">
          <button
            type="button"
            className="secondary-button"
            disabled={stepIndex === 0 || saving}
            onClick={handleBack}
          >
            Back
          </button>
          {stepIndex < wizardSteps.length - 1 ? (
            <button type="button" className="primary-button" onClick={() => void handleNext()}>
              {stepIndex === 0
                ? "Next: Event Details"
                : stepIndex === 1
                ? "Next: Event Location"
                : stepIndex === 2
                ? "Next: Invite Friends"
                : "Next: Review and Create"}
            </button>
          ) : (
            <button
              type="button"
              className="primary-button"
              disabled={saving}
              onClick={() => void handleCreateTailgate()}
            >
              {saving ? "Creating..." : "Create"}
            </button>
          )}
        </div>
      </section>

      {contactModalOpen ? (
        <div className="create-wizard-modal-overlay" role="dialog" aria-modal="true">
          <div className="create-wizard-modal">
            <div className="create-wizard-modal-header">
              <h3>Add Guests</h3>
              <button
                type="button"
                className="link-button"
                onClick={() => setContactModalOpen(false)}
              >
                Close
              </button>
            </div>
            <input
              className="text-input create-wizard-input"
              placeholder="Search contacts..."
              value={contactSearch}
              onChange={(event) => setContactSearch(event.target.value)}
            />
            <div className="create-wizard-contact-list">
              {filteredContacts.map((contact) => {
                const selected = selectedContactIds.includes(contact.id);
                return (
                  <button
                    key={contact.id}
                    type="button"
                    className={`create-wizard-contact-row ${selected ? "selected" : ""}`}
                    onClick={() => toggleContactSelection(contact.id)}
                  >
                    <div>
                      <p>{contact.name}</p>
                      <span>{contact.phone}</span>
                    </div>
                    <span className="create-wizard-contact-check">{selected ? "✓" : ""}</span>
                  </button>
                );
              })}
            </div>
            <button type="button" className="primary-button" onClick={applySelectedContacts}>
              Okay
            </button>
          </div>
        </div>
      ) : null}

      {payoutModalOpen ? (
        <div className="create-wizard-modal-overlay" role="dialog" aria-modal="true">
          <div className="create-wizard-modal create-wizard-payout-modal">
            <div className="create-wizard-modal-header">
              <h3>Set up payouts for paid tailgates</h3>
              <button
                type="button"
                className="link-button"
                onClick={() => setPayoutModalOpen(false)}
                disabled={payoutSetupLoading}
              >
                Close
              </button>
            </div>
            <p className="create-wizard-payout-copy">
              Connect your Stripe account so you can charge for entry and receive payouts.
            </p>
            <p className="create-wizard-payout-status">
              Current status: {connectStatus.replace("_", " ")}
            </p>
            {payoutSetupError ? (
              <p className="create-wizard-error global">{payoutSetupError}</p>
            ) : null}
            <div className="create-wizard-payout-actions">
              <button
                type="button"
                className="primary-button"
                onClick={() => void handlePayoutSetup()}
                disabled={payoutSetupLoading}
              >
                {payoutSetupLoading ? "Opening Stripe..." : "Set up payouts"}
              </button>
              <button
                type="button"
                className="secondary-button"
                onClick={() => setPayoutModalOpen(false)}
                disabled={payoutSetupLoading}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </AppShell>
  );
}
