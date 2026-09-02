import { useCallback, useEffect, useState } from "react";
import { ensureHostProfile } from "../lib/hostProfile";
import type { OwnedHostProfile } from "../types/hostProfile";
import { formatHostProfileError } from "../utils/hostProfileError";

export function useHostProfile(enabled = true) {
  const [profile, setProfile] = useState<OwnedHostProfile | null>(null);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!enabled) return;
    setLoading(true);
    setError(null);
    try {
      setProfile(await ensureHostProfile());
    } catch (reason) {
      setError(formatHostProfileError(reason));
    } finally {
      setLoading(false);
    }
  }, [enabled]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { profile, setProfile, loading, error, refresh };
}
