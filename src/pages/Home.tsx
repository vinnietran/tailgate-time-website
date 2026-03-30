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
import appStoreBadge from "../../screenshots/app-store-badge.svg";
import playStoreBadge from "../../screenshots/google-play-badge.png";

const IOS_DOWNLOAD_URL =
  "https://apps.apple.com/us/app/tailgatetime/id6748784028";
const ANDROID_DOWNLOAD_URL =
  "https://play.google.com/store/apps/details?id=com.vsventures.TailgateTime";

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
