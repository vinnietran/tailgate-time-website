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
import createDetailsShot from "../../screenshots/create_wizard_details.png";
import createLocationShot from "../../screenshots/create_wizard_location.png";
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
