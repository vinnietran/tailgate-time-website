import { useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { Link } from "react-router-dom";
import {
  IconCheckin,
  IconCompass,
  IconMessage,
  IconPayout,
  IconSpark,
  IconUser
} from "../components/Icons";
import { PublicTopNav } from "../components/PublicTopNav";
import SiteFooter from "../components/SiteFooter";
import { useAuth } from "../hooks/useAuth";
import { db } from "../lib/firebase";
import {
  formatCurrencyFromCents,
  formatDateTimeRange
} from "../utils/format";
import tailgateTimeLogo from "../../ttnobg.png";
import appStoreBadge from "../../screenshots/app-store-badge.svg";
import playStoreBadge from "../../screenshots/google-play-badge.png";

const IOS_DOWNLOAD_URL =
  "https://apps.apple.com/us/app/tailgatetime/id6748784028";
const ANDROID_DOWNLOAD_URL =
  "https://play.google.com/store/apps/details?id=com.vsventures.TailgateTime";
const BUFFALO_TAILGATES_LISTING_HOST =
  import.meta.env.VITE_FIREBASE_PROJECT_ID === "tailgatetime-prod"
    ? "Buffalo Tailgates"
    : "Vinnie Tranquillo";
const OPEN_LISTING_VISIBILITY_TYPES = ["open_free", "open_paid"] as const;
const HOMEPAGE_DISCOVER_EVENT_LIMIT = 8;
const DEFAULT_TAILGATE_LISTING_COVER = tailgateTimeLogo;
const DEFAULT_PARTNER_LISTING_COVER = "/images/buffalo_tailgates-logo.png";

type HomepageTailgateListing = {
  id: string;
  name: string;
  hostName?: string;
  visibilityType: "open_free" | "open_paid";
  startDateTime: Date | null;
  endDateTime: Date | null;
  locationSummary?: string;
  coverImageUrl: string;
  priceLabel: string;
  confirmedCount: number;
};

const hostFeatures = [
  {
    title: "Run check-in smoothly",
    description: "Use host tools to validate arrivals and keep your gate flowing.",
    icon: <IconCheckin size={18} />
  },
  {
    title: "Track payouts clearly",
    description: "Follow paid-event performance and Stripe status in one dashboard.",
    icon: <IconPayout size={18} />
  },
  {
    title: "Message your guests",
    description: "Send updates fast when times, lots, or plans shift on game day.",
    icon: <IconMessage size={18} />
  }
];

const eventModes = [
  {
    title: "Personal invites",
    description:
      "Create a private tailgate, send invites directly to friends and family, and keep the guest list under your control.",
    badge: "Invite-only",
    icon: <IconUser size={18} />
  },
  {
    title: "Open free events",
    description:
      "Publish a public tailgate anyone can discover, join, and follow before kickoff without charging admission.",
    badge: "Public + Free",
    icon: <IconCompass size={18} />
  },
  {
    title: "Open paid events",
    description:
      "List a public paid event, sell spots through the app, and manage attendance and payouts in one place.",
    badge: "Public + Paid",
    icon: <IconPayout size={18} />
  }
];

const gameDaySteps = [
  {
    title: "1. Choose your event type",
    description: "Decide whether it is a personal invite, an open free tailgate, or an open paid event."
  },
  {
    title: "2. Share or publish it",
    description: "Send direct invites to your group or publish your event so fans can discover it."
  },
  {
    title: "3. Run game day",
    description: "Track RSVPs, check in guests, message attendees, and manage paid access when needed."
  }
];

const socialProof = [
  {
    quote: "TailgateTime made our pre-game party effortless.",
    byline: "Dan, Steelers fan"
  },
  {
    quote: "Best tailgating app I've ever used.",
    byline: "Curt, college football enthusiast"
  },
  {
    quote: "Keeps everyone on the same page, even Grandma.",
    byline: "Victor, family tailgater"
  }
];

const buffaloTailgatesImages = [
  {
    src: "/images/bt1.jpg",
    alt: "Buffalo Tailgates fans gathered on game day"
  },
  {
    src: "/images/bt2.jpg",
    alt: "Buffalo Tailgates setup with fans and tents"
  },
  {
    src: "/images/bt3.jpg",
    alt: "Buffalo Tailgates crowd before kickoff"
  },
  {
    src: "/images/bt4.jpg",
    alt: "Buffalo Tailgates community event scene"
  }
];

function asRecord(value: unknown): Record<string, unknown> | null {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return null;
  }
  return value as Record<string, unknown>;
}

function firstString(...values: unknown[]): string | undefined {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }
  return undefined;
}

function firstStringFromArray(value: unknown): string | undefined {
  if (!Array.isArray(value)) return undefined;
  for (const item of value) {
    if (typeof item === "string" && item.trim()) {
      return item.trim();
    }
  }
  return undefined;
}

function coerceNumber(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return undefined;
}

function normalizeDate(value: unknown): Date | null {
  if (!value) return null;
  if (value instanceof Date) return value;
  if (typeof value === "string" || typeof value === "number") {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  const maybeTimestamp = value as { toDate?: () => Date; seconds?: number };
  if (typeof maybeTimestamp.toDate === "function") {
    const parsed = maybeTimestamp.toDate();
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }
  if (typeof maybeTimestamp.seconds === "number") {
    const parsed = new Date(maybeTimestamp.seconds * 1000);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  return null;
}

function resolveListingVisibilityType(data: Record<string, unknown>) {
  const raw = String(data.visibilityType ?? "").toLowerCase();
  if (raw === "open_free" || raw === "open_paid") return raw;
  if (raw === "private" || data.isPrivate === true) return "private";

  const ticketPriceCents =
    coerceNumber(data.ticketPriceCents) ??
    coerceNumber(data.priceCents) ??
    coerceNumber(data.ticketPrice);
  return (ticketPriceCents ?? 0) > 0 ? "open_paid" : "open_free";
}

function isCancelledListing(data: Record<string, unknown>) {
  const status = firstString(data.status, data.eventStatus)?.toLowerCase();
  return status === "cancelled" || status === "canceled" || Boolean(data.cancelledAt);
}

function resolveListingLocation(data: Record<string, unknown>) {
  const location = asRecord(data.location);
  return firstString(
    data.locationSummary,
    data.venueName,
    data.address,
    data.displayAddress,
    data.locationLabel,
    location?.lotName,
    location?.venueName,
    location?.name,
    location?.displayAddress,
    location?.address
  );
}

function resolveListingHostName(data: Record<string, unknown>) {
  const host = asRecord(data.host);
  const hostProfile = asRecord(data.hostProfile);
  return firstString(
    data.hostName,
    data.displayName,
    data.hostDisplayName,
    host?.displayName,
    host?.name,
    hostProfile?.displayName,
    hostProfile?.name
  );
}

function resolveListingCoverImageUrl(
  data: Record<string, unknown>,
  fallback = DEFAULT_TAILGATE_LISTING_COVER
) {
  const cover = asRecord(data.cover);
  const media = asRecord(data.media);

  return (
    firstString(
      data.coverImageUrl,
      data.coverPhotoUrl,
      data.heroImageUrl,
      data.bannerImageUrl,
      data.imageUrl,
      data.photoURL,
      data.photoUrl,
      cover?.url,
      cover?.imageUrl,
      cover?.downloadUrl,
      cover?.src,
      media?.coverImageUrl,
      media?.imageUrl,
      firstStringFromArray(data.coverImageUrls),
      firstStringFromArray(cover?.imageUrls),
      firstStringFromArray(media?.coverImageUrls),
      firstStringFromArray(media?.imageUrls)
    ) ?? fallback
  );
}

function toHomepageTailgateListing(
  id: string,
  data: Record<string, unknown>
): HomepageTailgateListing | null {
  const visibilityType = resolveListingVisibilityType(data);
  if (visibilityType !== "open_free" && visibilityType !== "open_paid") return null;
  if (isCancelledListing(data)) return null;

  const startDateTime =
    normalizeDate(data.dateTime) ??
    normalizeDate(data.eventTargetTime) ??
    normalizeDate(data.startDateTime) ??
    normalizeDate(data.startAt) ??
    normalizeDate(data.eventDateTime) ??
    normalizeDate(data.eventDate);
  const endDateTime =
    normalizeDate(data.endDateTime) ??
    normalizeDate(data.endAt) ??
    normalizeDate(data.eventEndAt) ??
    normalizeDate(data.tailgateEndAt);
  const eventTime = startDateTime?.getTime() ?? 0;
  if (!startDateTime || Number.isNaN(eventTime) || eventTime < Date.now()) return null;

  const ticketPriceCents =
    coerceNumber(data.ticketPriceCents) ??
    coerceNumber(data.priceCents) ??
    coerceNumber(data.ticketPrice);
  const confirmedCount = Math.max(
    0,
    Math.floor(
      coerceNumber(data.confirmedPaidCount) ??
        coerceNumber(data.ticketsSold) ??
        coerceNumber(data.rsvpsConfirmed) ??
        coerceNumber(data.confirmedCount) ??
        0
    )
  );

  return {
    id,
    name: firstString(data.eventName, data.name, data.title) ?? "Untitled Tailgate",
    hostName: resolveListingHostName(data),
    visibilityType,
    startDateTime,
    endDateTime,
    locationSummary: resolveListingLocation(data),
    coverImageUrl: resolveListingCoverImageUrl(data),
    priceLabel:
      visibilityType === "open_paid"
        ? ticketPriceCents
          ? formatCurrencyFromCents(ticketPriceCents)
          : "Paid"
        : "Free",
    confirmedCount
  };
}

function isBuffaloTailgatesPartnerListing(listing: HomepageTailgateListing) {
  return listing.hostName?.toLowerCase() === BUFFALO_TAILGATES_LISTING_HOST.toLowerCase();
}

const discoverHighlights = [
  {
    title: "Find public tailgates fast",
    description: "Browse open events by date and lock in plans before kickoff.",
    icon: <IconCompass size={18} />
  },
  {
    title: "See paid and free options",
    description: "Compare event type, capacity, and ticket details in one place.",
    icon: <IconPayout size={18} />
  },
  {
    title: "Jump into game-day energy",
    description: "Open event details and feed updates without bouncing between pages.",
    icon: <IconSpark size={18} />
  }
];

export default function Home() {
  const { user } = useAuth();
  const [activeBuffaloImage, setActiveBuffaloImage] = useState(0);
  const [upcomingTailgateListings, setUpcomingTailgateListings] = useState<
    HomepageTailgateListing[]
  >([]);
  const [buffaloListings, setBuffaloListings] = useState<HomepageTailgateListing[]>([]);
  const [openListingsLoading, setOpenListingsLoading] = useState(true);
  const [openListingsError, setOpenListingsError] = useState<string | null>(null);

  useEffect(() => {
    if (!db) {
      setUpcomingTailgateListings([]);
      setBuffaloListings([]);
      setOpenListingsLoading(false);
      setOpenListingsError(null);
      return;
    }

    setOpenListingsLoading(true);
    setOpenListingsError(null);

    const publicTailgatesQuery = query(
      collection(db, "tailgateEvents"),
      where("visibilityType", "in", [...OPEN_LISTING_VISIBILITY_TYPES])
    );

    const unsubscribe = onSnapshot(
      publicTailgatesQuery,
      (snapshot) => {
        const listings = snapshot.docs
          .map((document) =>
            toHomepageTailgateListing(document.id, document.data() as Record<string, unknown>)
          )
          .filter((item): item is HomepageTailgateListing => Boolean(item))
          .sort((a, b) => {
            const aTime = a.startDateTime?.getTime() ?? Number.POSITIVE_INFINITY;
            const bTime = b.startDateTime?.getTime() ?? Number.POSITIVE_INFINITY;
            return aTime - bTime;
          });

        setUpcomingTailgateListings(listings.slice(0, HOMEPAGE_DISCOVER_EVENT_LIMIT));
        setBuffaloListings(
          listings.filter(isBuffaloTailgatesPartnerListing).map((listing) =>
            listing.coverImageUrl === DEFAULT_TAILGATE_LISTING_COVER
              ? { ...listing, coverImageUrl: DEFAULT_PARTNER_LISTING_COVER }
              : listing
          )
        );
        setOpenListingsLoading(false);
        setOpenListingsError(null);
      },
      (error) => {
        console.error("Failed to load homepage tailgate listings", error);
        setUpcomingTailgateListings([]);
        setBuffaloListings([]);
        setOpenListingsLoading(false);
        setOpenListingsError("Upcoming tailgates are not available right now.");
      }
    );

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setActiveBuffaloImage((current) =>
        current === buffaloTailgatesImages.length - 1 ? 0 : current + 1
      );
    }, 5000);

    return () => window.clearInterval(intervalId);
  }, []);

  const showPreviousBuffaloImage = () => {
    setActiveBuffaloImage((current) =>
      current === 0 ? buffaloTailgatesImages.length - 1 : current - 1
    );
  };

  const showNextBuffaloImage = () => {
    setActiveBuffaloImage((current) =>
      current === buffaloTailgatesImages.length - 1 ? 0 : current + 1
    );
  };

  return (
    <main className="homepage">
      <PublicTopNav />

      <section className="homepage-hero-shell">
        <div className="homepage-hero">
          <div className="homepage-hero-copy">
            <p className="homepage-kicker">True Home Base</p>
            <h1>Host private invites, open free tailgates, or paid public events in one app.</h1>
            <p>
              TailgateTime helps you organize personal guest lists, publish discoverable free
              events, and run paid tailgates with check-in, messaging, and payouts built in.
            </p>
            <div className="homepage-hero-tags" aria-label="TailgateTime event types">
              {eventModes.map((mode) => (
                <span key={mode.title} className="homepage-hero-tag">
                  {mode.badge}
                </span>
              ))}
            </div>
            <div className="homepage-cta-row">
              <a href={IOS_DOWNLOAD_URL} target="_blank" rel="noopener noreferrer">
                <img src={appStoreBadge} alt="Download on the App Store" />
              </a>
              <a href={ANDROID_DOWNLOAD_URL} target="_blank" rel="noopener noreferrer">
                <img src={playStoreBadge} alt="Get it on Google Play" />
              </a>
            </div>
            <div className="homepage-secondary-links">
              <Link to="/release-2-0" className="homepage-inline-link">
                See what is new in 2.0
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="homepage-modes-shell">
        <div className="homepage-section-header">
          <h2>Built for every kind of tailgate you want to host</h2>
          <p>
            Use the same app whether you are inviting your own crew or opening the lot up to more
            fans.
          </p>
        </div>
        <div className="homepage-modes-grid">
          {eventModes.map((mode) => (
            <article key={mode.title} className="homepage-mode-card">
              <div className="homepage-mode-topline">
                <span className="homepage-feature-icon">{mode.icon}</span>
                <span className="homepage-mode-badge">{mode.badge}</span>
              </div>
              <h3>{mode.title}</h3>
              <p>{mode.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="homepage-discover-shell">
        <div className="homepage-discover-card">
          <div className="homepage-discover-copy">
            <p className="homepage-kicker">Discover Tailgates</p>
            <h2>Join open tailgates before game day starts.</h2>
            <p>
              Browse public events, compare free and paid options, and lock in your plans with one
              tap.
            </p>
            <div className="homepage-discover-actions">
              <Link to="/discover" className="primary-button">
                Explore Tailgates
              </Link>
              {!user ? (
                <Link to="/login?mode=signup" className="public-auth-btn login">
                  Start Hosting
                </Link>
              ) : null}
            </div>
          </div>
          <div className="homepage-discover-grid">
            {discoverHighlights.map((item) => (
              <article key={item.title} className="homepage-discover-item">
                <span className="homepage-feature-icon">{item.icon}</span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
          <div className="homepage-discover-events" aria-label="Upcoming open tailgates">
            <div className="homepage-discover-events-header">
              <div>
                <span>Upcoming open tailgates</span>
                <p>Live listings fans can join from Discover.</p>
              </div>
              <Link to="/discover">View all</Link>
            </div>
            {openListingsLoading ? (
              <p className="homepage-discover-events-state">Loading upcoming tailgates...</p>
            ) : openListingsError ? (
              <p className="homepage-discover-events-state">{openListingsError}</p>
            ) : upcomingTailgateListings.length > 0 ? (
              <div className="homepage-discover-events-grid">
                {upcomingTailgateListings.map((listing) => (
                  <Link
                    key={listing.id}
                    to={`/tailgates/${listing.id}`}
                    className="homepage-discover-event-card"
                    aria-label={`View ${listing.name}`}
                  >
                    <div
                      className={`homepage-discover-event-media ${
                        listing.coverImageUrl === DEFAULT_TAILGATE_LISTING_COVER
                          ? "is-logo"
                          : "has-image"
                      }`}
                    >
                      <img src={listing.coverImageUrl} alt="" loading="lazy" />
                    </div>
                    <div className="homepage-discover-event-heading">
                      <h3>{listing.name}</h3>
                      <span
                        className={`homepage-discover-event-chip ${
                          listing.visibilityType === "open_paid" ? "paid" : "free"
                        }`}
                      >
                        {listing.visibilityType === "open_paid" ? "Open Paid" : "Open Free"}
                      </span>
                    </div>
                    <p className="homepage-discover-event-date">
                      {formatDateTimeRange(listing.startDateTime, listing.endDateTime)}
                    </p>
                    <div className="homepage-discover-event-footer">
                      <span>{listing.locationSummary ?? "Location coming soon"}</span>
                      <strong>{listing.priceLabel}</strong>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="homepage-discover-events-state">No upcoming open tailgates yet.</p>
            )}
          </div>
        </div>
      </section>

      <section className="homepage-partners-shell">
        <div className="homepage-section-header homepage-partners-header">
          <p className="homepage-kicker">Featured Partner</p>
          <h2>Buffalo Tailgates brings game day together.</h2>
          <p>
            TailgateTime is proud to feature Buffalo Tailgates, a Bills game-day community helping
            fans connect before kickoff.
          </p>
        </div>
        <div className="homepage-partners-grid">
          <article className="homepage-partner-card featured">
            <div className="homepage-partner-content">
              <div className="homepage-partner-topline">
                <span className="homepage-partner-logo">
                  <img src="/images/buffalo_tailgates-logo.png" alt="Buffalo Tailgates logo" />
                </span>
                <span>Featured partner</span>
              </div>
              <h3>Buffalo Tailgates</h3>
              <p>
                Local game-day hosts bringing Bills fans together with easier planning, discovery,
                and check-in.
              </p>
              <small>Buffalo, NY</small>
              <div className="homepage-partner-listings" aria-label="Buffalo Tailgates listings">
                <div className="homepage-partner-listings-header">
                  <span>Upcoming listings</span>
                  {buffaloListings.length > 0 ? <small>{buffaloListings.length} live</small> : null}
                </div>
                {openListingsLoading ? (
                  <p className="homepage-partner-listing-state">Loading listings...</p>
                ) : openListingsError ? (
                  <p className="homepage-partner-listing-state">{openListingsError}</p>
                ) : buffaloListings.length > 0 ? (
                  <div className="homepage-partner-listings-scroll">
                    {buffaloListings.map((listing) => (
                      <Link
                        key={listing.id}
                        to={`/tailgates/${listing.id}`}
                        className="homepage-partner-listing-panel"
                        aria-label={`View ${listing.name}`}
                      >
                        <div
                          className={`homepage-partner-listing-media ${
                            listing.coverImageUrl === DEFAULT_PARTNER_LISTING_COVER
                              ? "is-logo"
                              : "has-image"
                          }`}
                        >
                          <img src={listing.coverImageUrl} alt="" loading="lazy" />
                        </div>
                        <div className="homepage-partner-listing-heading">
                          <h4>{listing.name}</h4>
                          <span
                            className={`homepage-partner-listing-chip ${
                              listing.visibilityType === "open_paid" ? "paid" : "free"
                            }`}
                          >
                            {listing.visibilityType === "open_paid" ? "Open Paid" : "Open Free"}
                          </span>
                        </div>
                        <p className="homepage-partner-listing-date">
                          {formatDateTimeRange(listing.startDateTime, listing.endDateTime)}
                        </p>
                        <div className="homepage-partner-listing-body">
                          <div className="homepage-partner-listing-copy">
                            <p>{listing.locationSummary ?? "Location coming soon"}</p>
                            <p className="homepage-partner-listing-size">
                              {listing.confirmedCount} confirmed
                            </p>
                          </div>
                          <div className="homepage-partner-listing-meta">
                            <strong>{listing.priceLabel}</strong>
                            <span>View</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="homepage-partner-listing-state">
                    No upcoming open listings yet.
                  </p>
                )}
              </div>
            </div>
            <div className="homepage-partner-carousel" aria-label="Buffalo Tailgates photos">
              <div className="homepage-partner-carousel-slides">
                {buffaloTailgatesImages.map((image, index) => (
                  <img
                    key={image.src}
                    className={`homepage-partner-carousel-image ${
                      index === activeBuffaloImage ? "active" : ""
                    }`}
                    src={image.src}
                    alt={index === activeBuffaloImage ? image.alt : ""}
                    aria-hidden={index === activeBuffaloImage ? undefined : "true"}
                  />
                ))}
              </div>
              <div className="homepage-partner-carousel-controls">
                <button
                  type="button"
                  aria-label="Show previous Buffalo Tailgates photo"
                  onClick={showPreviousBuffaloImage}
                >
                  {"<"}
                </button>
                <button
                  type="button"
                  aria-label="Show next Buffalo Tailgates photo"
                  onClick={showNextBuffaloImage}
                >
                  {">"}
                </button>
              </div>
              <div
                className="homepage-partner-carousel-dots"
                aria-label="Buffalo Tailgates photo selector"
              >
                <span className="homepage-partner-carousel-count">
                  Photo {activeBuffaloImage + 1} of {buffaloTailgatesImages.length}
                </span>
                {buffaloTailgatesImages.map((image, index) => (
                  <button
                    key={image.src}
                    type="button"
                    className={index === activeBuffaloImage ? "active" : ""}
                    aria-label={`Show Buffalo Tailgates photo ${index + 1}`}
                    aria-current={index === activeBuffaloImage ? "true" : undefined}
                    onClick={() => setActiveBuffaloImage(index)}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </div>
          </article>
        </div>
      </section>

      <section className="homepage-journey-shell">
        <div className="homepage-section-header">
          <h2>How TailgateTime Works</h2>
          <p>Pick the right event format first, then run the whole day from the same place.</p>
        </div>
        <div className="homepage-journey-grid">
          {gameDaySteps.map((step) => (
            <article key={step.title} className="homepage-journey-card">
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="homepage-feature-shell">
        <div className="homepage-feature-header">
          <h2>Host tools that actually move fast</h2>
          <p>Built for invite-only hangouts, open community tailgates, and paid entry events.</p>
        </div>
        <div className="homepage-feature-grid">
          {hostFeatures.map((feature) => (
            <article key={feature.title} className="homepage-feature-card">
              <span className="homepage-feature-icon">{feature.icon}</span>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="homepage-social-shell">
        <div className="homepage-section-header">
          <h2>Built for Real Tailgaters</h2>
        </div>
        <div className="homepage-social-grid">
          {socialProof.map((item) => (
            <article key={item.quote} className="homepage-social-card">
              <p>"{item.quote}"</p>
              <small>{item.byline}</small>
            </article>
          ))}
        </div>
      </section>

      {!user ? (
        <section className="homepage-signup-shell">
          <div className="homepage-signup-card">
            <p className="homepage-kicker">Start Hosting</p>
            <h2>Create your host account and launch your next tailgate.</h2>
            <p>
              Sign up to send personal invites, publish open free events, or run paid tailgates
              from one dashboard.
            </p>
            <div className="homepage-signup-actions">
              <Link to="/login?mode=signup" className="public-auth-btn signup">
                Sign Up
              </Link>
              <Link to="/login?mode=login" className="public-auth-btn login">
                Login
              </Link>
            </div>
          </div>
        </section>
      ) : null}
      <SiteFooter />
    </main>
  );
}
