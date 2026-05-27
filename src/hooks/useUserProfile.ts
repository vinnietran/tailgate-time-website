import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";
import { db, storage } from "../lib/firebase";
import { debugAuthLog } from "../utils/debug";

export type UserProfile = {
  displayName?: string;
  email?: string;
  phone?: string;
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

async function resolveProfilePhotoURL(uid: string, candidate?: string) {
  const trimmed = candidate?.trim();
  if (!storage) {
    return trimmed;
  }

  if (trimmed) {
    if (trimmed.startsWith("https://") || trimmed.startsWith("http://")) {
      return trimmed;
    }

    if (trimmed.startsWith("gs://")) {
      try {
        return await getDownloadURL(ref(storage, trimmed));
      } catch {
        // Fall through to default storage path.
      }
    }
  }

  try {
    return await getDownloadURL(ref(storage, `profilePictures/${uid}.jpg`));
  } catch {
    return trimmed;
  }
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
    let cancelled = false;

    const unsubscribe = onSnapshot(
      ref,
      (snapshot) => {
        if (!snapshot.exists()) {
          setProfile(null);
          setLoading(false);
          debugAuthLog("profile:missing", { uid });
          return;
        }

        const hydrateProfile = async () => {
          const data = snapshot.data() as Record<string, unknown>;
          const rawPhotoURL = firstString(
            data.photoURL,
            data.profilePhotoURL,
            data.avatarUrl
          );
          const resolvedPhotoURL = await resolveProfilePhotoURL(uid, rawPhotoURL);
          if (cancelled) {
            return;
          }

          const nextProfile: UserProfile = {
            displayName: firstString(data.displayName, data.name, data.fullName),
            email: firstString(data.email),
            phone: firstString(data.phone, data.phoneNumber),
            photoURL: resolvedPhotoURL
          };

          setProfile(nextProfile);
          setLoading(false);
          debugAuthLog("profile:loaded", {
            uid,
            hasDisplayName: Boolean(nextProfile.displayName),
            hasEmail: Boolean(nextProfile.email),
            hasPhone: Boolean(nextProfile.phone),
            hasPhoto: Boolean(nextProfile.photoURL)
          });
        };

        void hydrateProfile();
      },
      () => {
        setLoading(false);
      }
    );

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, [uid]);

  return { profile, loading };
}
