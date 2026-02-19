import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import AppShell from "../components/AppShell";
import { useAuth } from "../hooks/useAuth";
import { db } from "../lib/firebase";

type NotificationItem = {
  id: string;
  description: string;
  data?: {
    eventId?: string;
    initialTab?: string;
    [key: string]: unknown;
  };
  createdAt?: unknown;
  read: boolean;
};

type NotificationSection = {
  title: "Today" | "Yesterday" | "Earlier";
  data: NotificationItem[];
};

function toDate(value: unknown): Date | null {
  if (!value) return null;
  if (value instanceof Date) return value;

  if (typeof value === "string" || typeof value === "number") {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  const timestampLike = value as { toDate?: () => Date; seconds?: number };
  if (typeof timestampLike.toDate === "function") {
    const parsed = timestampLike.toDate();
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  if (typeof timestampLike.seconds === "number") {
    const parsed = new Date(timestampLike.seconds * 1000);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  return null;
}

function formatDateTime(value: unknown) {
  const parsed = toDate(value);
  if (!parsed) return "No date available";
  return parsed.toLocaleString();
}

function groupNotificationsByDate(items: NotificationItem[]): NotificationSection[] {
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);

  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  const today: NotificationItem[] = [];
  const yday: NotificationItem[] = [];
  const earlier: NotificationItem[] = [];

  items.forEach((item) => {
    const date = toDate(item.createdAt) ?? new Date(0);
    if (isSameDay(date, now)) {
      today.push(item);
      return;
    }
    if (isSameDay(date, yesterday)) {
      yday.push(item);
      return;
    }
    earlier.push(item);
  });

  const sections: NotificationSection[] = [];
  if (today.length) sections.push({ title: "Today", data: today });
  if (yday.length) sections.push({ title: "Yesterday", data: yday });
  if (earlier.length) sections.push({ title: "Earlier", data: earlier });
  return sections;
}

export default function Messages() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);

  useEffect(() => {
    if (!db || !user) {
      setNotifications([]);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    const notificationsQuery = query(
      collection(db, "users", user.uid, "notifications"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      notificationsQuery,
      (snapshot) => {
        const next: NotificationItem[] = snapshot.docs.map((snapshotDoc) => {
          const data = snapshotDoc.data() as Record<string, unknown>;
          return {
            id: snapshotDoc.id,
            description:
              typeof data.description === "string" && data.description.trim()
                ? data.description.trim()
                : "Notification",
            data: (data.data as NotificationItem["data"]) ?? undefined,
            createdAt: data.createdAt,
            read: data.read === true
          };
        });

        setNotifications(next);
        setLoading(false);
      },
      (snapshotError) => {
        console.error("Error fetching notifications:", snapshotError);
        setError("Unable to load notifications right now.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    if (!isSelectionMode) return;
    const validIds = new Set(notifications.map((item) => item.id));
    setSelectedIds((current) => current.filter((id) => validIds.has(id)));
  }, [isSelectionMode, notifications]);

  const sections = useMemo(
    () => groupNotificationsByDate(notifications),
    [notifications]
  );

  const toggleSelectionMode = useCallback(() => {
    setIsSelectionMode((current) => !current);
    setSelectedIds([]);
  }, []);

  const toggleSelect = useCallback((id: string) => {
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((selectedId) => selectedId !== id)
        : [...current, id]
    );
  }, []);

  const selectAll = useCallback(() => {
    setSelectedIds(notifications.map((item) => item.id));
  }, [notifications]);

  const markSelectedAsRead = useCallback(async () => {
    if (!db || !user || selectedIds.length === 0) return;
    await Promise.all(
      selectedIds.map((id) =>
        updateDoc(doc(db, "users", user.uid, "notifications", id), { read: true })
      )
    );
    setSelectedIds([]);
    setIsSelectionMode(false);
  }, [selectedIds, user]);

  const deleteSelected = useCallback(async () => {
    if (!db || !user || selectedIds.length === 0) return;
    await Promise.all(
      selectedIds.map((id) =>
        deleteDoc(doc(db, "users", user.uid, "notifications", id))
      )
    );
    setSelectedIds([]);
    setIsSelectionMode(false);
  }, [selectedIds, user]);

  const deleteOne = useCallback(
    async (id: string) => {
      if (!db || !user) return;
      await deleteDoc(doc(db, "users", user.uid, "notifications", id));
      setSelectedIds((current) => current.filter((selectedId) => selectedId !== id));
    },
    [user]
  );

  const handleNotificationPress = useCallback(
    async (item: NotificationItem) => {
      if (!db || !user) return;
      if (isSelectionMode) {
        toggleSelect(item.id);
        return;
      }

      if (!item.read) {
        try {
          await updateDoc(doc(db, "users", user.uid, "notifications", item.id), {
            read: true
          });
        } catch (markError) {
          console.error("Error marking notification read:", markError);
        }
      }

      const eventId = item.data?.eventId;
      if (eventId) {
        navigate(`/tailgates/${eventId}`);
      }
    },
    [isSelectionMode, navigate, toggleSelect, user]
  );

  return (
    <AppShell header={<div className="simple-header"><h1>Notifications</h1></div>}>
      <section className="notifications-page">
        {loading ? (
          <article className="notifications-card">
            <p className="meta-muted">Loading notifications...</p>
          </article>
        ) : error ? (
          <p className="error-banner">{error}</p>
        ) : notifications.length === 0 ? (
          <div className="empty-state">
            <p>You have no notifications.</p>
          </div>
        ) : (
          <>
            <div className="notifications-actions">
              {!isSelectionMode ? (
                <button type="button" className="secondary-button" onClick={toggleSelectionMode}>
                  Select
                </button>
              ) : (
                <>
                  <button type="button" className="secondary-button" onClick={selectAll}>
                    Select all
                  </button>
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={() => void markSelectedAsRead()}
                    disabled={selectedIds.length === 0}
                  >
                    Mark read ({selectedIds.length})
                  </button>
                  <button
                    type="button"
                    className="secondary-button danger"
                    onClick={() => void deleteSelected()}
                    disabled={selectedIds.length === 0}
                  >
                    Delete ({selectedIds.length})
                  </button>
                  <button type="button" className="secondary-button" onClick={toggleSelectionMode}>
                    Cancel
                  </button>
                </>
              )}
            </div>

            {sections.map((section) => (
              <article key={section.title} className="notifications-card">
                <h2 className="notifications-section-title">{section.title}</h2>
                <div className="notifications-list">
                  {section.data.map((item) => {
                    const selected = selectedIds.includes(item.id);
                    return (
                      <div
                        key={item.id}
                        className={`notifications-item ${selected ? "selected" : ""}`}
                      >
                        <button
                          type="button"
                          className="notifications-item-main"
                          onClick={() => void handleNotificationPress(item)}
                        >
                          {isSelectionMode ? (
                            <span
                              className={`notifications-select-dot ${
                                selected ? "selected" : ""
                              }`}
                              aria-hidden
                            >
                              {selected ? "✓" : ""}
                            </span>
                          ) : null}
                          <span className="notifications-item-copy">
                            <strong>{item.description}</strong>
                            <small>{formatDateTime(item.createdAt)}</small>
                          </span>
                          {!item.read ? <span className="notifications-new-badge">NEW</span> : null}
                        </button>
                        <button
                          type="button"
                          className="notifications-item-delete"
                          onClick={() => void deleteOne(item.id)}
                        >
                          Delete
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
