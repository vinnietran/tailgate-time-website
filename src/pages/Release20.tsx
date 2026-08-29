import { Link } from "react-router-dom";
import {
  IconCheckin,
  IconCompass,
  IconDashboard,
  IconMessage,
  IconPayout,
  IconSpark,
  IconUser,
  IconWallet
} from "../components/Icons";
import { PublicTopNav } from "../components/PublicTopNav";
import SiteFooter from "../components/SiteFooter";
import { useAuth } from "../hooks/useAuth";
import appStoreBadge from "../../screenshots/app-store-badge.svg";
import playStoreBadge from "../../screenshots/google-play-badge.png";

const IOS_DOWNLOAD_URL =
  "https://apps.apple.com/us/app/tailgatetime/id6748784028";
const ANDROID_DOWNLOAD_URL =
  "https://play.google.com/store/apps/details?id=com.vsventures.TailgateTime";

const releaseStats = [
  { value: "3", label: "event types in one host flow" },
  { value: "2", label: "check-in modes for game day" },
  { value: "10+", label: "major upgrades across hosting and discovery" }
];

const heroHighlights = [
  "Invite-only gatherings with tighter guest controls",
  "Open free and paid tailgates with discoverability built in",
  "A faster dashboard, event feed, check-in, and payout workflow"
];

const releasePillars = [
  {
    title: "Host every kind of tailgate",
    description:
      "TailgateTime 2.0 brings invite-only, open free, and open paid events into one builder so hosts can launch the right experience without changing tools.",
    icon: <IconUser size={18} />,
    accent: "gold"
  },
  {
    title: "Discover what is happening nearby",
    description:
      "Fans can search by city or ZIP, switch between list and map views, and jump into public event details before game day locks in.",
    icon: <IconCompass size={18} />,
    accent: "teal"
  },
  {
    title: "Run the lot like an operator",
    description:
      "Hosts now have stronger dashboards, live attendee messaging, co-host help, and faster ticket check-in from scan or manual code entry.",
    icon: <IconDashboard size={18} />,
    accent: "red"
  }
];

const featureGroups = [
  {
    title: "New ways to host",
    eyebrow: "Built for private crews and public crowds",
    features: [
      "Create invite-only, open free, or open paid tailgates from the same multi-step builder.",
      "Add up to five cover photos, reorder them, and lead with a stronger primary image.",
      "Set vibe, amenities, event notes, and guest expectations before you publish.",
      "Copy past or cancelled hosted tailgates into a new draft instead of starting from zero."
    ]
  },
  {
    title: "Smarter discovery and event pages",
    eyebrow: "A better fan-side experience",
    features: [
      "Search open tailgates by location and browse them in list or map view.",
      "See free vs. paid visibility, pricing, distance, host info, and cover imagery in one scan.",
      "Open richer event details with tabs for feed, schedule, and game-day content.",
      "Use built-in directions, calendar shortcuts, and bring-list context without leaving the flow."
    ]
  },
  {
    title: "Paid events that actually work on game day",
    eyebrow: "From ticket sales to payout status",
    features: [
      "Launch open paid events with Stripe-backed checkout and payout setup.",
      "Support ticket quantity controls, ticket status handling, and gated access where it matters.",
      "Show QR tickets with refresh support and add them to Apple Wallet or Google Wallet.",
      "Track gross sales, estimated payout, and ticket progress from the host dashboard."
    ]
  },
  {
    title: "Live operations for kickoff",
    eyebrow: "Less scrambling once guests arrive",
    features: [
      "Check guests in with QR scan or code entry, including partial admissions.",
      "Send one-time SMS broadcasts to attendees when the lot, timing, or weather changes.",
      "Publish a schedule so guests can follow live, upcoming, and completed moments.",
      "Post to a shared event feed with text, multiple photos, drag-to-reorder media, and fullscreen viewing."
    ]
  }
];

const upgradeCards = [
  {
    title: "Dashboard refresh",
    description:
      "A cleaner home base shows your next tailgate, upcoming activity, spotlight content, and faster routes into hosting or attending.",
    icon: <IconDashboard size={18} />
  },
  {
    title: "Messaging and coordination",
    description:
      "Hosts can broadcast updates, manage co-host support, and keep attendees aligned without scattered group texts.",
    icon: <IconMessage size={18} />
  },
  {
    title: "Wallet-ready tickets",
    description:
      "Paid attendees can keep tickets where they expect them, then surface them quickly at check-in.",
    icon: <IconWallet size={18} />
  },
  {
    title: "Faster gate flow",
    description:
      "Scan, validate, and check in full or partial admissions with guardrails for invalid or overused tickets.",
    icon: <IconCheckin size={18} />
  },
  {
    title: "More ways to monetize",
    description:
      "Paid public events now connect ticketing, capacity control, and payout visibility in one operating loop.",
    icon: <IconPayout size={18} />
  },
  {
    title: "Shared game-day energy",
    description:
      "The event feed turns a static RSVP into a live pregame channel with photos, updates, and momentum.",
    icon: <IconSpark size={18} />
  }
];

const rolloutSteps = [
  {
    title: "Plan it",
    description: "Pick the event type, customize details, add photos, and set your guest or ticket rules."
  },
  {
    title: "Fill it",
    description: "Invite your crew directly or publish an open event fans can discover near the stadium."
  },
  {
    title: "Run it",
    description: "Message attendees, publish the schedule, scan tickets, and keep the tailgate moving."
  }
];

export default function Release20() {
  const { user } = useAuth();

  return (
    <main className="release-page">
      <PublicTopNav />

      <section className="release-hero-shell">
        <div className="release-hero-grid">
          <article className="release-hero-card">
            <div className="release-badge-row">
              <span className="release-version-badge">Version 2.0</span>
              <span className="release-status-chip">Live now</span>
            </div>
            <p className="release-kicker">A bigger game-day command center</p>
            <h1>TailgateTime 2.0 turns hosting, discovery, ticketing, and check-in into one fast release.</h1>
            <p className="release-hero-copy">
              This update expands TailgateTime from a simple event organizer into a full game-day
              operating system for private invites, open public tailgates, and paid entry events.
            </p>
            <div className="release-hero-actions">
              <Link to="/discover" className="primary-button">
                Explore Open Tailgates
              </Link>
              {!user ? (
                <Link to="/login?mode=signup" className="release-secondary-button">
                  Start Hosting
                </Link>
              ) : (
                <Link to="/dashboard" className="release-secondary-button">
                  Open Dashboard
                </Link>
              )}
            </div>
            <div className="release-store-row">
              <a href={IOS_DOWNLOAD_URL} target="_blank" rel="noopener noreferrer">
                <img src={appStoreBadge} alt="Download on the App Store" />
              </a>
              <a href={ANDROID_DOWNLOAD_URL} target="_blank" rel="noopener noreferrer">
                <img src={playStoreBadge} alt="Get it on Google Play" />
              </a>
            </div>
          </article>

          <aside className="release-hero-panel">
            <div className="release-stat-grid" aria-label="Release 2.0 stats">
              {releaseStats.map((stat) => (
                <article key={stat.label} className="release-stat-card">
                  <strong>{stat.value}</strong>
                  <span>{stat.label}</span>
                </article>
              ))}
            </div>
            <div className="release-marquee-card">
              <p className="release-marquee-label">What is new</p>
              <div className="release-marquee-list">
                {heroHighlights.map((item) => (
                  <div key={item} className="release-marquee-item">
                    <span className="release-marquee-dot" aria-hidden="true" />
                    <p>{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="release-pillars-shell">
        <div className="release-section-heading">
          <p className="release-kicker">Release pillars</p>
          <h2>Three major product leaps define the 2.0 launch.</h2>
        </div>
        <div className="release-pillars-grid">
          {releasePillars.map((pillar) => (
            <article key={pillar.title} className={`release-pillar-card release-pillar-${pillar.accent}`}>
              <span className="release-icon-chip">{pillar.icon}</span>
              <h3>{pillar.title}</h3>
              <p>{pillar.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="release-feature-shell">
        <div className="release-section-heading">
          <p className="release-kicker">Everything new</p>
          <h2>2.0 ships across the whole tailgate lifecycle.</h2>
        </div>
        <div className="release-feature-grid">
          {featureGroups.map((group) => (
            <article key={group.title} className="release-feature-card">
              <p className="release-feature-eyebrow">{group.eyebrow}</p>
              <h3>{group.title}</h3>
              <ul className="release-feature-list">
                {group.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="release-upgrades-shell">
        <div className="release-upgrades-banner">
          <div className="release-section-heading release-section-heading-light">
            <p className="release-kicker">More key upgrades</p>
            <h2>From first invite to final payout, the 2.0 experience is tighter everywhere.</h2>
          </div>
          <div className="release-upgrades-grid">
            {upgradeCards.map((card) => (
              <article key={card.title} className="release-upgrade-card">
                <span className="release-icon-chip">{card.icon}</span>
                <h3>{card.title}</h3>
                <p>{card.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="release-rollout-shell">
        <div className="release-rollout-card">
          <div className="release-section-heading">
            <p className="release-kicker">How it lands</p>
            <h2>2.0 is designed to feel faster at every stage of game day.</h2>
          </div>
          <div className="release-rollout-grid">
            {rolloutSteps.map((step, index) => (
              <article key={step.title} className="release-rollout-step">
                <span className="release-rollout-number">0{index + 1}</span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="release-cta-shell">
        <div className="release-cta-card">
          <p className="release-kicker">Ready for the season</p>
          <h2>Open the 2.0 experience and build your next tailgate with the new toolkit.</h2>
          <p>
            Whether you are running a private crew meetup or a paid public event, TailgateTime 2.0
            gives you more control before kickoff and fewer headaches at the gate.
          </p>
          <div className="release-hero-actions">
            {!user ? (
              <Link to="/login?mode=signup" className="primary-button">
                Create an Account
              </Link>
            ) : (
              <Link to="/tailgates/new" className="primary-button">
                Create a Tailgate
              </Link>
            )}
            <Link to="/user-guide" className="release-secondary-button">
              Read the User Guide
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
