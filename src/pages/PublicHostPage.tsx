import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { PublicTopNav } from "../components/PublicTopNav";
import SiteFooter from "../components/SiteFooter";
import { HostPageSeo } from "../components/HostPageSeo";
import { getPublicHostPage, trackHostPageEvent } from "../lib/hostProfile";
import type { PublicHostPageData } from "../types/hostProfile";
import { formatDateTimeRange } from "../utils/format";
import { buildTailgatePricingSummary, formatTicketPricingLabel } from "../utils/tailgate";
import tailgateTimeLogo from "../../ttnobg.png";

export default function PublicHostPage() {
  const { slug = "" } = useParams();
  const [data, setData] = useState<PublicHostPageData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [shareLabel, setShareLabel] = useState("Share Host Page");
  const [activeGalleryIndex, setActiveGalleryIndex] = useState<number | null>(null);

  useEffect(() => {
    let active = true;
    getPublicHostPage(slug)
      .then((next) => {
        if (!active) return;
        setData(next);
        void trackHostPageEvent("host_page_view", {
          hostSlug: next.profile.slug,
          authenticated: false
        });
      })
      .catch((reason) => {
        if (active) setError(reason instanceof Error ? reason.message : "Host page not found.");
      });
    return () => {
      active = false;
    };
  }, [slug]);

  useEffect(() => {
    if (activeGalleryIndex === null) return;
    const imageCount = data?.profile.galleryImageUrls?.length || 0;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveGalleryIndex(null);
      if (imageCount > 1 && event.key === "ArrowLeft") {
        setActiveGalleryIndex((current) =>
          current === null ? null : (current - 1 + imageCount) % imageCount
        );
      }
      if (imageCount > 1 && event.key === "ArrowRight") {
        setActiveGalleryIndex((current) =>
          current === null ? null : (current + 1) % imageCount
        );
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeGalleryIndex, data?.profile.galleryImageUrls?.length]);

  const share = async () => {
    if (!data) return;
    const url = `${window.location.origin}/hosts/${data.profile.slug}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: data.profile.displayName, url });
      } else {
        await navigator.clipboard.writeText(url);
        setShareLabel("Link copied");
        window.setTimeout(() => setShareLabel("Share Host Page"), 1800);
      }
      void trackHostPageEvent("host_page_share", { hostSlug: data.profile.slug });
    } catch (reason) {
      if ((reason as DOMException)?.name !== "AbortError") setShareLabel("Unable to share");
    }
  };

  if (error) {
    return (
      <div className="host-public-page">
        <PublicTopNav />
        <main className="host-public-state">
          <h1>Host page not found</h1>
          <p>This Host Page may be unavailable or its URL may have changed.</p>
          <Link className="primary-button" to="/discover">Discover tailgates</Link>
        </main>
        <SiteFooter />
      </div>
    );
  }

  if (!data) {
    return <div className="host-public-page host-public-loading" aria-busy="true">Loading Host Page…</div>;
  }

  const { profile, upcomingTailgates } = data;
  const galleryImages = profile.galleryImageUrls || [];
  return (
    <div className="host-public-page">
      <HostPageSeo profile={profile} />
      <PublicTopNav />
      <main>
        <section
          className={`host-public-hero${profile.coverImageUrl ? " has-cover" : ""}`}
          style={profile.coverImageUrl ? { backgroundImage: `url(${profile.coverImageUrl})` } : undefined}
        >
          <div className="host-public-hero-overlay" />
          <div className="host-public-hero-content">
            <img
              className="host-public-logo"
              src={profile.logoUrl || tailgateTimeLogo}
              alt={`${profile.displayName} logo`}
            />
            <div className="host-public-heading">
              <p className="host-public-eyebrow">TailgateTime Host</p>
              <h1>{profile.displayName}</h1>
              {profile.tagline ? <p className="host-public-tagline">{profile.tagline}</p> : null}
              {profile.location ? <p className="host-public-location">{profile.location}</p> : null}
            </div>
            <button type="button" className="host-public-share" onClick={share}>{shareLabel}</button>
          </div>
        </section>

        <div className="host-public-content">
          {profile.description ? (
            <section className="host-public-about">
              <p className="host-public-kicker">About the host</p>
              <h2>Welcome to our tailgate</h2>
              <p>{profile.description}</p>
            </section>
          ) : null}

          {galleryImages.length ? (
            <section className="host-public-gallery" aria-labelledby="host-public-gallery-title">
              <div className="host-public-section-heading">
                <div>
                  <p className="host-public-kicker">The experience</p>
                  <h2 id="host-public-gallery-title">Tailgate gallery</h2>
                </div>
                <span>{galleryImages.length} photos</span>
              </div>
              <div className="host-public-gallery-grid">
                {galleryImages.map((url, index) => (
                  <button
                    type="button"
                    className="host-public-gallery-image"
                    key={`${url}-${index}`}
                    onClick={() => setActiveGalleryIndex(index)}
                    aria-label={`Open gallery image ${index + 1} of ${galleryImages.length}`}
                  >
                    <img
                      src={url}
                      alt={`${profile.displayName} tailgate gallery ${index + 1}`}
                      loading="lazy"
                    />
                  </button>
                ))}
              </div>
            </section>
          ) : null}

          <section className="host-public-events">
            <div className="host-public-section-heading">
              <div>
                <p className="host-public-kicker">Join the party</p>
                <h2>Upcoming Tailgates</h2>
              </div>
              <span>{upcomingTailgates.length} upcoming</span>
            </div>
            {upcomingTailgates.length ? (
              <div className="host-public-event-grid">
                {upcomingTailgates.map((event) => {
                  const pricing = buildTailgatePricingSummary(event);
                  const price = event.visibilityType === "open_free"
                    ? "Free"
                    : formatTicketPricingLabel(pricing, pricing?.hasVariablePricing ? "range" : "single") || "Paid";
                  return (
                    <Link
                      key={event.id}
                      className="host-public-event-card"
                      to={`/tailgates/${event.id}`}
                      onClick={() => void trackHostPageEvent("host_page_event_click", {
                        hostSlug: profile.slug,
                        eventId: event.id
                      })}
                    >
                      <div className="host-public-event-media">
                        <img src={event.coverImageUrl || tailgateTimeLogo} alt="" />
                        <span>{price}</span>
                      </div>
                      <div className="host-public-event-copy">
                        <h3>{event.name}</h3>
                        <p>{formatDateTimeRange(event.startDateTime, event.endDateTime)}</p>
                        <p>{event.locationSummary || "Location coming soon"}</p>
                        <strong>View tailgate →</strong>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="host-public-empty">
                <h3>No upcoming tailgates are currently listed.</h3>
                <p>Check back soon.</p>
              </div>
            )}
          </section>
        </div>
      </main>
      {activeGalleryIndex !== null ? (
        <div
          className="host-public-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Host image gallery"
          onClick={() => setActiveGalleryIndex(null)}
        >
          <button
            type="button"
            className="host-public-lightbox-close"
            onClick={() => setActiveGalleryIndex(null)}
            aria-label="Close image gallery"
          >
            ×
          </button>
          {galleryImages.length > 1 ? (
            <button
              type="button"
              className="host-public-lightbox-nav previous"
              onClick={(event) => {
                event.stopPropagation();
                setActiveGalleryIndex((activeGalleryIndex - 1 + galleryImages.length) % galleryImages.length);
              }}
              aria-label="Previous gallery image"
            >
              ‹
            </button>
          ) : null}
          <img
            src={galleryImages[activeGalleryIndex]}
            alt={`${profile.displayName} tailgate gallery ${activeGalleryIndex + 1}`}
            onClick={(event) => event.stopPropagation()}
          />
          {galleryImages.length > 1 ? (
            <button
              type="button"
              className="host-public-lightbox-nav next"
              onClick={(event) => {
                event.stopPropagation();
                setActiveGalleryIndex((activeGalleryIndex + 1) % galleryImages.length);
              }}
              aria-label="Next gallery image"
            >
              ›
            </button>
          ) : null}
          <span>{activeGalleryIndex + 1} / {galleryImages.length}</span>
        </div>
      ) : null}
      <SiteFooter />
    </div>
  );
}
