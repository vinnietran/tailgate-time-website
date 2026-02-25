import React from "react";
import { Link } from "react-router-dom";
import {
  IconCheckin,
  IconCompass,
  IconMessage,
  IconPayout,
  IconSpark
} from "../components/Icons";
import { PublicTopNav } from "../components/PublicTopNav";
import SiteFooter from "../components/SiteFooter";
import { useAuth } from "../hooks/useAuth";
import appStoreBadge from "../../screenshots/app-store-badge.svg";
import createContactsShot from "../../screenshots/create_wizard_contacts.png";
import createDetailsShot from "../../screenshots/create_wizard_details.png";
import createLocationShot from "../../screenshots/create_wizard_location.png";
import createQuizShot from "../../screenshots/create_wizard_quiz.png";
import createReviewShot from "../../screenshots/create_wizard_review.png";
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

const gameDaySteps = [
  {
    title: "1. Create Event",
    description: "Set date, lot, and timing in seconds."
  },
  {
    title: "2. Invite & Track",
    description: "Send invites and watch RSVPs update in real time."
  },
  {
    title: "3. Game On",
    description: "Use live feed, check-in, and updates during the event."
  }
];

const appShots = [
  {
    src: createDetailsShot,
    alt: "Create event details screen",
    caption: "Enter Tailgate Details"
  },
  {
    src: createLocationShot,
    alt: "Select location screen",
    caption: "Add Your Tailgate Location"
  },
  {
    src: createContactsShot,
    alt: "Add contacts screen",
    caption: "Add Your Guests"
  },
  {
    src: createQuizShot,
    alt: "Quiz setup screen",
    caption: "Customize Your Quiz"
  },
  {
    src: createReviewShot,
    alt: "Review event screen",
    caption: "Review & Create Event"
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
            <h1>Everything TailgateTime, from one homepage.</h1>
            <p>
              Download the app, explore your host tools, and jump into live game-day operations
              without hunting through separate pages.
            </p>
            <div className="homepage-cta-row">
              <a href={IOS_DOWNLOAD_URL} target="_blank" rel="noopener noreferrer">
                <img src={appStoreBadge} alt="Download on the App Store" />
              </a>
              <a href={ANDROID_DOWNLOAD_URL} target="_blank" rel="noopener noreferrer">
                <img src={playStoreBadge} alt="Get it on Google Play" />
              </a>
            </div>
            <div className="homepage-quick-links">
              <Link to="/discover">
                <IconCompass size={16} />
                <span>Discover Tailgates</span>
              </Link>
              <Link to="/tailgates/new">
                <IconSpark size={16} />
                <span>Create Tailgate</span>
              </Link>
            </div>
          </div>

          <div className="homepage-hero-visual">
            <article className="homepage-shot-card primary">
              <img src={createLocationShot} alt="Tailgate location setup preview" />
              <p>Lock in location and preview the map before game day.</p>
            </article>
            <div className="homepage-shot-stack">
              <article className="homepage-shot-card">
                <img src={createDetailsShot} alt="Tailgate details setup preview" />
                <p>Build event details with the host wizard.</p>
              </article>
              <article className="homepage-shot-card">
                <img src={createReviewShot} alt="Tailgate review setup preview" />
                <p>Review your flow before publishing.</p>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section className="homepage-discover-shell">
        <div className="homepage-discover-card">
          <div className="homepage-discover-copy">
            <p className="homepage-kicker">Discover Tailgates</p>
            <h2>Find the loudest lots before game day starts.</h2>
            <p>
              Explore discoverable tailgates, compare options quickly, and lock in your plans with
              one tap.
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
          <p>Set up your event quickly, then run game day without the group-chat chaos.</p>
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

      <section className="homepage-screens-shell">
        <div className="homepage-section-header">
          <h2>App Screenshots</h2>
          <p>A quick look at the flow hosts use from setup to game day.</p>
        </div>
        <div className="homepage-screens-grid">
          {appShots.map((shot) => (
            <figure key={shot.caption} className="homepage-screen-card">
              <img src={shot.src} alt={shot.alt} />
              <figcaption>{shot.caption}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="homepage-feature-shell">
        <div className="homepage-feature-header">
          <h2>Host tools that actually move fast</h2>
          <p>Built for pre-game pressure, not generic event pages.</p>
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
              Sign up to publish events, manage guest check-in, and handle payouts from one
              dashboard.
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
