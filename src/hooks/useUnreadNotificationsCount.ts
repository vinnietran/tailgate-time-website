import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase";

export function useUnreadNotificationsCount(userId?: string | null) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!db || !userId) {
      setCount(0);
      return;
    }

    const notificationsRef = collection(db, "users", userId, "notifications");

    const unsubscribe = onSnapshot(
      notificationsRef,
      (snapshot) => {
        let unreadCount = 0;
        snapshot.docs.forEach((snapshotDoc) => {
          const data = snapshotDoc.data() as Record<string, unknown>;
          if (data.read !== true) {
            unreadCount += 1;
          }
        });
        setCount(unreadCount);
      },
      (snapshotError) => {
        console.error("Unable to load unread notifications count", snapshotError);
        setCount(0);
      }
    );

    return () => unsubscribe();
  }, [userId]);

  return count;
}
