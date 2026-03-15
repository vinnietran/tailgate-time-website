import React, { useEffect, useMemo, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { Link } from "react-router-dom";
import AppShell from "../components/AppShell";
import { IconBell, IconMessage, IconUser } from "../components/Icons";
import { useAuth } from "../hooks/useAuth";
import { db } from "../lib/firebase";

const defaultPrefs = {
  invites: true,
  eventUpdates: true,
  eventReminders: true,
  feedPosts: false,
  commentsOnMyPosts: true,
  mentions: true,
  groupEvents: true,
  rsvpUpdates: true
};

type PreferenceKey = keyof typeof defaultPrefs;

type PreferenceItem = {
  key: PreferenceKey;
  label: string;
  description: string;
  icon: React.ReactNode;
};

const preferenceSections: Array<{
  title: string;
  description: string;
  items: PreferenceItem[];
}> = [
  {
    title: "Event activity",
    description: "Stay on top of invites, event changes, reminders, and feed activity.",
    items: [
      {
        key: "invites",
        label: "Invites to events",
        description: "Get notified when you are invited or added to a tailgate.",
        icon: <IconMessage size={18} />
      },
      {
        key: "eventUpdates",
        label: "Event updates",
        description: "Time, location, and important event changes from the host.",
        icon: <IconBell size={18} />
      },
      {
        key: "eventReminders",
        label: "Event reminders",
        description: "Timely reminders before your tailgates start.",
        icon: <IconBell size={18} />
      },
      {
        key: "feedPosts",
        label: "Feed messages",
        description: "Unread feed alerts for shared event conversations and photos.",
        icon: <IconMessage size={18} />
      }
    ]
  },
  {
    title: "Hosting",
    description: "Control the alerts that matter when you are running the tailgate.",
    items: [
      {
        key: "rsvpUpdates",
        label: "RSVP updates",
        description: "Know when guests respond or their attendance changes.",
        icon: <IconUser size={18} />
      }
    ]
  }
];

export default function NotificationPreferences() {
  const { user } = useAuth();
  const [prefs, setPrefs] = useState(defaultPrefs);
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState<PreferenceKey | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadPrefs = async () => {
      if (!user?.uid) {
        setLoading(false);
        return;
      }

      if (!db) {
        setError("Notification preferences are unavailable right now.");
        setLoading(false);
        return;
      }

      try {
        const preferenceDoc = await getDoc(
          doc(db, "users", user.uid, "preferences", "notifications")
        );
        if (!cancelled) {
          setPrefs(
            preferenceDoc.exists()
              ? { ...defaultPrefs, ...(preferenceDoc.data() as Partial<typeof defaultPrefs>) }
              : defaultPrefs
          );
        }
      } catch (loadFailure) {
        console.error("Failed to load notification preferences", loadFailure);
        if (!cancelled) {
          setError("Unable to load your notification preferences.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadPrefs();

    return () => {
      cancelled = true;
    };
  }, [user?.uid]);

  const renderedItems = useMemo(
    () => preferenceSections.flatMap((section) => section.items),
    []
  );
  const enabledCount = renderedItems.filter((item) => prefs[item.key]).length;

  const handleToggle = async (key: PreferenceKey) => {
    if (!user?.uid || !db || savingKey) {
      return;
    }

    const previousPrefs = prefs;
    const nextValue = !prefs[key];
    const nextPrefs = { ...prefs, [key]: nextValue };
    setPrefs(nextPrefs);
    setSavingKey(key);
    setError(null);

    try {
      await setDoc(
        doc(db, "users", user.uid, "preferences", "notifications"),
        { [key]: nextValue },
        { merge: true }
      );
    } catch (saveFailure) {
      console.error("Failed to save notification preference", saveFailure);
      setPrefs(previousPrefs);
      setError("We couldn't save that preference. Please try again.");
    } finally {
      setSavingKey((current) => (current === key ? null : current));
    }
  };

  return (
    <AppShell header={<div className="simple-header"><h1>Notification Preferences</h1></div>}>
      <section className="payouts-page account-page-stack">
        <article className="payouts-card account-hero-card">
          <div className="account-page-badge">
            <IconBell size={16} />
            <span>Notifications</span>
          </div>
          <div className="account-hero-grid">
            <div>
              <h2>Keep the right moments loud.</h2>
              <p className="section-subtitle">
                Choose which updates should reach you first across invites, reminders, and hosting.
              </p>
            </div>
            <div className="account-hero-actions">
              <div className="tailgate-details-metric-card">
                <p>Enabled</p>
                <strong>{enabledCount}</strong>
              </div>
              <Link className="secondary-button" to="/account">
                Back to account
              </Link>
            </div>
          </div>
        </article>

        {!user ? (
          <article className="payouts-card">
            <p className="error-banner">Sign in to load and save your notification preferences.</p>
          </article>
        ) : loading ? (
          <article className="payouts-card">
            <p className="meta-muted">Loading your notification preferences...</p>
          </article>
        ) : (
          <>
            {error ? (
              <article className="payouts-card">
                <p className="error-banner">{error}</p>
              </article>
            ) : null}
            {preferenceSections.map((section) => (
              <article key={section.title} className="payouts-card">
                <div className="section-header">
                  <div>
                    <h2>{section.title}</h2>
                    <p className="section-subtitle">{section.description}</p>
                  </div>
                </div>
                <div className="notification-preference-list">
                  {section.items.map((item) => {
                    const isEnabled = prefs[item.key];
                    const isSaving = savingKey === item.key;
                    return (
                      <div key={item.key} className="notification-preference-row">
                        <span
                          className={`account-option-icon notification-preference-icon ${
                            isEnabled ? "active" : ""
                          }`}
                          aria-hidden
                        >
                          {item.icon}
                        </span>
                        <div className="notification-preference-copy">
                          <strong>{item.label}</strong>
                          <span>{item.description}</span>
                        </div>
                        <button
                          type="button"
                          className={`notification-preference-toggle ${
                            isEnabled ? "active" : ""
                          }`}
                          onClick={() => void handleToggle(item.key)}
                          disabled={isSaving}
                          aria-pressed={isEnabled}
                          aria-label={`${isEnabled ? "Disable" : "Enable"} ${item.label}`}
                        >
                          <span>{isSaving ? "Saving..." : isEnabled ? "On" : "Off"}</span>
                          <span className="notification-preference-toggle-knob" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </article>
            ))}
          </>
        )}
      </section>
    </AppShell>
  );
}
