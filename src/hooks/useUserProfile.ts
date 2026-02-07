import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase";
import { debugAuthLog } from "../utils/debug";

export type UserProfile = {
  displayName?: string;
  email?: string;
  photoURL?: string;
};

function firstString(...values: unknown[]) {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }
  return undefined;
}

export function useUserProfile(uid?: string) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) {
      setProfile(null);
      setLoading(false);
      return;
    }

    if (!db) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const ref = doc(db, "users", uid);

    const unsubscribe = onSnapshot(
      ref,
      (snapshot) => {
        if (!snapshot.exists()) {
          setProfile(null);
          setLoading(false);
          debugAuthLog("profile:missing", { uid });
          return;
        }

        const data = snapshot.data() as Record<string, unknown>;
        const nextProfile: UserProfile = {
          displayName: firstString(data.displayName, data.name, data.fullName),
          email: firstString(data.email),
          photoURL: firstString(data.photoURL, data.profilePhotoURL, data.avatarUrl)
        };

        setProfile(nextProfile);
        setLoading(false);
        debugAuthLog("profile:loaded", {
          uid,
          hasDisplayName: Boolean(nextProfile.displayName),
          hasEmail: Boolean(nextProfile.email)
        });
      },
      () => {
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [uid]);

  return { profile, loading };
}
