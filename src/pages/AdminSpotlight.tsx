import { useEffect, useMemo, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import AppShell from "../components/AppShell";
import TopBar from "../components/TopBar";
import { useAuth } from "../hooks/useAuth";
import { db } from "../lib/firebase";
import { getFirstName } from "../utils/format";

type SpotlightArtType = "map" | "host" | "partner" | "image";
type SpotlightCtaType = "route" | "external_url" | "none";

type SpotlightCardDraft = {
  id: string;
  active: boolean;
  order: number;
  badge: string;
  title: string;
  description: string;
  artType: SpotlightArtType;
  imageUrl: string;
  ctaLabel: string;
  ctaType: SpotlightCtaType;
  ctaTarget: string;
  startsAt: string;
  endsAt: string;
};

const EMPTY_CARD = (order: number): SpotlightCardDraft => ({
  id: `card-${Date.now()}-${order}`,
  active: true,
  order,
  badge: "",
  title: "",
  description: "",
  artType: "image",
  imageUrl: "",
  ctaLabel: "",
  ctaType: "none",
  ctaTarget: "",
  startsAt: "",
  endsAt: ""
});

function prettyJson(value: unknown) {
  return JSON.stringify(value, null, 2);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function stringValue(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function numberValue(value: unknown, fallback: number) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return fallback;
}

function booleanValue(value: unknown, fallback: boolean) {
  return typeof value === "boolean" ? value : fallback;
}

function toIsoString(value: unknown) {
  if (!value) return "";
  if (typeof value === "string") {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? value.trim() : parsed.toISOString();
  }
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? "" : value.toISOString();
  }
  const timestamp = value as { toDate?: () => Date; seconds?: number };
  if (typeof timestamp?.toDate === "function") {
    const date = timestamp.toDate();
    return Number.isNaN(date.getTime()) ? "" : date.toISOString();
  }
  if (typeof timestamp?.seconds === "number") {
    return new Date(timestamp.seconds * 1000).toISOString();
  }
  return "";
}

function toDateTimeLocalValue(value: string) {
  if (!value) return "";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "";
  const year = parsed.getFullYear();
  const month = `${parsed.getMonth() + 1}`.padStart(2, "0");
  const day = `${parsed.getDate()}`.padStart(2, "0");
  const hours = `${parsed.getHours()}`.padStart(2, "0");
  const minutes = `${parsed.getMinutes()}`.padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function fromDateTimeLocalValue(value: string) {
  if (!value.trim()) return "";
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? "" : parsed.toISOString();
}

function normalizeDrafts(rawDoc: unknown): SpotlightCardDraft[] {
  const rawCards = isRecord(rawDoc) && Array.isArray(rawDoc.cards) ? rawDoc.cards : [];
  if (rawCards.length === 0) {
    return [
      {
        ...EMPTY_CARD(0),
        id: "discover",
        title: "Find open tailgates nearby",
        description: "Explore public events around your game day location and join in a few taps.",
        artType: "map",
        ctaLabel: "Discover now",
        ctaType: "route",
        ctaTarget: "/discover"
      }
    ];
  }

  return rawCards
    .map((entry, index) => {
      const record = isRecord(entry) ? entry : {};
      const artTypeRaw = stringValue(record.artType);
      const ctaTypeRaw = stringValue(record.ctaType);
      return {
        id: stringValue(record.id) || `spotlight-${index + 1}`,
        active: booleanValue(record.active, true),
        order: numberValue(record.order, index),
        badge: stringValue(record.badge),
        title: stringValue(record.title),
        description: stringValue(record.description),
        artType:
          artTypeRaw === "map" || artTypeRaw === "host" || artTypeRaw === "partner" || artTypeRaw === "image"
            ? artTypeRaw
            : "image",
        imageUrl: stringValue(record.imageUrl),
        ctaLabel: stringValue(record.ctaLabel),
        ctaType:
          ctaTypeRaw === "route" || ctaTypeRaw === "external_url" || ctaTypeRaw === "none"
            ? ctaTypeRaw
            : "none",
        ctaTarget: stringValue(record.ctaTarget),
        startsAt: toIsoString(record.startsAt),
        endsAt: toIsoString(record.endsAt)
      } satisfies SpotlightCardDraft;
    })
    .sort((left, right) => left.order - right.order)
    .map((card, index) => ({ ...card, order: index }));
}

function buildPayload(cards: SpotlightCardDraft[]) {
  return {
    cards: cards.map((card, index) => ({
      id: card.id.trim() || `spotlight-${index + 1}`,
      active: card.active,
      order: index,
      ...(card.badge.trim() ? { badge: card.badge.trim() } : {}),
      title: card.title.trim(),
      description: card.description.trim(),
      artType: card.artType,
      ...(card.imageUrl.trim() ? { imageUrl: card.imageUrl.trim() } : {}),
      ...(card.ctaLabel.trim() ? { ctaLabel: card.ctaLabel.trim() } : {}),
      ctaType: card.ctaType,
      ...(card.ctaTarget.trim() ? { ctaTarget: card.ctaTarget.trim() } : {}),
      ...(card.startsAt ? { startsAt: card.startsAt } : {}),
      ...(card.endsAt ? { endsAt: card.endsAt } : {})
    }))
  };
}

export default function AdminSpotlight() {
  const { user } = useAuth();
  const firstName = getFirstName(user?.displayName ?? user?.email ?? "Admin");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [cards, setCards] = useState<SpotlightCardDraft[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showJsonPreview, setShowJsonPreview] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      if (!db) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const snapshot = await getDoc(doc(db, "appContent", "dashboardSpotlight"));
        if (!isMounted) return;
        setCards(normalizeDrafts(snapshot.exists() ? snapshot.data() : null));
      } catch (loadError) {
        console.error("Failed loading admin spotlight doc", loadError);
        if (isMounted) {
          setError("Unable to load spotlight content.");
          setCards(normalizeDrafts(null));
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void load();

    return () => {
      isMounted = false;
    };
  }, []);

  const jsonPreview = useMemo(() => prettyJson(buildPayload(cards)), [cards]);

  const updateCard = (index: number, patch: Partial<SpotlightCardDraft>) => {
    setCards((current) =>
      current.map((card, cardIndex) =>
        cardIndex === index ? { ...card, ...patch } : card
      )
    );
  };

  const addCard = () => {
    setCards((current) => [...current, EMPTY_CARD(current.length)]);
    setSuccess(null);
    setError(null);
  };

  const removeCard = (index: number) => {
    setCards((current) =>
      current.filter((_, cardIndex) => cardIndex !== index).map((card, order) => ({ ...card, order }))
    );
    setSuccess(null);
    setError(null);
  };

  const moveCard = (index: number, direction: -1 | 1) => {
    setCards((current) => {
      const nextIndex = index + direction;
      if (nextIndex < 0 || nextIndex >= current.length) return current;
      const nextCards = [...current];
      const [moved] = nextCards.splice(index, 1);
      nextCards.splice(nextIndex, 0, moved);
      return nextCards.map((card, order) => ({ ...card, order }));
    });
    setSuccess(null);
    setError(null);
  };

  const handleSave = async () => {
    if (!db) {
      setError("Firestore is unavailable in this environment.");
      return;
    }

    const invalidCard = cards.find((card) => {
      if (!card.title.trim() || !card.description.trim()) return true;
      if (card.artType === "image" && !card.imageUrl.trim()) return true;
      if (card.ctaType !== "none" && (!card.ctaLabel.trim() || !card.ctaTarget.trim())) return true;
      return false;
    });

    if (invalidCard) {
      setError("Each card needs a title and description. Image cards need an image URL, and CTA cards need both a label and target.");
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      await setDoc(doc(db, "appContent", "dashboardSpotlight"), buildPayload(cards), {
        merge: false
      });
      setSuccess("Dashboard spotlight updated.");
    } catch (saveError) {
      console.error("Failed saving spotlight content", saveError);
      setError("Unable to save spotlight content. Check admin access and try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppShell header={<TopBar firstName={firstName} />}>
      <section className="admin-console-stack">
        <article className="tailgate-card admin-console-card">
          <div className="section-header">
            <div>
              <h2>Spotlight Admin</h2>
              <p className="section-subtitle">
                Edit the live carousel for the app and website without shipping a release.
              </p>
            </div>
            <button type="button" className="secondary-button" onClick={addCard} disabled={loading || saving}>
              Add card
            </button>
          </div>
          <div className="admin-console-note">
            Use this to edit existing spotlight cards, reorder the carousel, or add a new sponsor
            slot. Changes save to <code>appContent/dashboardSpotlight</code>.
          </div>
          {loading ? <p className="meta-muted">Loading spotlight content...</p> : null}
          {!loading && cards.length === 0 ? (
            <p className="meta-muted">No spotlight cards yet. Add your first card.</p>
          ) : null}
          <div className="admin-spotlight-card-list">
            {cards.map((card, index) => (
              <section className="admin-spotlight-editor-card" key={`${card.id}-${index}`}>
                <div className="admin-spotlight-editor-header">
                  <div>
                    <h3>Card {index + 1}</h3>
                    <p>{card.title.trim() || "Untitled card"}</p>
                  </div>
                  <div className="admin-spotlight-editor-actions">
                    <button
                      type="button"
                      className="secondary-button"
                      onClick={() => moveCard(index, -1)}
                      disabled={saving || index === 0}
                    >
                      Up
                    </button>
                    <button
                      type="button"
                      className="secondary-button"
                      onClick={() => moveCard(index, 1)}
                      disabled={saving || index === cards.length - 1}
                    >
                      Down
                    </button>
                    <button
                      type="button"
                      className="secondary-button admin-spotlight-danger"
                      onClick={() => removeCard(index)}
                      disabled={saving}
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <div className="admin-spotlight-editor-grid">
                  <label className="input-group">
                    <span className="input-label">Card id</span>
                    <input
                      className="text-input"
                      value={card.id}
                      onChange={(event) => updateCard(index, { id: event.target.value })}
                      placeholder="sponsor-pittsburgh"
                    />
                  </label>
                  <label className="input-group">
                    <span className="input-label">Badge</span>
                    <input
                      className="text-input"
                      value={card.badge}
                      onChange={(event) => updateCard(index, { badge: event.target.value })}
                      placeholder="Sponsored"
                    />
                  </label>
                  <label className="input-group admin-spotlight-checkbox">
                    <span className="input-label">Active</span>
                    <input
                      type="checkbox"
                      checked={card.active}
                      onChange={(event) => updateCard(index, { active: event.target.checked })}
                    />
                  </label>
                  <label className="input-group">
                    <span className="input-label">Art type</span>
                    <select
                      className="text-input"
                      value={card.artType}
                      onChange={(event) =>
                        updateCard(index, { artType: event.target.value as SpotlightArtType })
                      }
                    >
                      <option value="image">Image</option>
                      <option value="map">Map art</option>
                      <option value="host">Host art</option>
                      <option value="partner">Partner art</option>
                    </select>
                  </label>
                  <label className="input-group admin-spotlight-grid-span-2">
                    <span className="input-label">Title</span>
                    <input
                      className="text-input"
                      value={card.title}
                      onChange={(event) => updateCard(index, { title: event.target.value })}
                      placeholder="Game day partner spotlight"
                    />
                  </label>
                  <label className="input-group admin-spotlight-grid-span-2">
                    <span className="input-label">Description</span>
                    <textarea
                      className="text-input admin-spotlight-textarea"
                      value={card.description}
                      onChange={(event) => updateCard(index, { description: event.target.value })}
                      placeholder="Tell people what this sponsor or feature is about."
                    />
                  </label>
                  <label className="input-group admin-spotlight-grid-span-2">
                    <span className="input-label">Image URL</span>
                    <input
                      className="text-input"
                      value={card.imageUrl}
                      onChange={(event) => updateCard(index, { imageUrl: event.target.value })}
                      placeholder="https://..."
                    />
                  </label>
                  <label className="input-group">
                    <span className="input-label">CTA type</span>
                    <select
                      className="text-input"
                      value={card.ctaType}
                      onChange={(event) =>
                        updateCard(index, { ctaType: event.target.value as SpotlightCtaType })
                      }
                    >
                      <option value="none">No CTA</option>
                      <option value="route">App / site route</option>
                      <option value="external_url">External URL</option>
                    </select>
                  </label>
                  <label className="input-group">
                    <span className="input-label">CTA label</span>
                    <input
                      className="text-input"
                      value={card.ctaLabel}
                      onChange={(event) => updateCard(index, { ctaLabel: event.target.value })}
                      placeholder="Learn more"
                    />
                  </label>
                  <label className="input-group admin-spotlight-grid-span-2">
                    <span className="input-label">CTA target</span>
                    <input
                      className="text-input"
                      value={card.ctaTarget}
                      onChange={(event) => updateCard(index, { ctaTarget: event.target.value })}
                      placeholder="/discover or https://partner.com"
                    />
                  </label>
                  <label className="input-group">
                    <span className="input-label">Starts at</span>
                    <input
                      className="text-input"
                      type="datetime-local"
                      value={toDateTimeLocalValue(card.startsAt)}
                      onChange={(event) =>
                        updateCard(index, { startsAt: fromDateTimeLocalValue(event.target.value) })
                      }
                    />
                  </label>
                  <label className="input-group">
                    <span className="input-label">Ends at</span>
                    <input
                      className="text-input"
                      type="datetime-local"
                      value={toDateTimeLocalValue(card.endsAt)}
                      onChange={(event) =>
                        updateCard(index, { endsAt: fromDateTimeLocalValue(event.target.value) })
                      }
                    />
                  </label>
                </div>
              </section>
            ))}
          </div>
          {error ? <p className="tailgate-details-ticket-error">{error}</p> : null}
          {success ? <p className="tailgate-details-inline-editor-success">{success}</p> : null}
          <div className="tailgate-details-inline-editor-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={() => setShowJsonPreview((current) => !current)}
              disabled={saving}
            >
              {showJsonPreview ? "Hide JSON" : "Show JSON"}
            </button>
            <button
              type="button"
              className="primary-button"
              onClick={() => void handleSave()}
              disabled={saving || loading}
            >
              {saving ? "Saving..." : "Save spotlight"}
            </button>
          </div>
          {showJsonPreview ? (
            <label className="input-group">
              <span className="input-label">Generated JSON preview</span>
              <textarea className="text-input admin-console-textarea" value={jsonPreview} readOnly />
            </label>
          ) : null}
        </article>
      </section>
    </AppShell>
  );
}
