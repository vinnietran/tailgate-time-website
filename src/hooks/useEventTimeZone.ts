import { useEffect, useState } from "react";
import { lookupEventTimeZone } from "../lib/eventTimeZone";
import { deviceTimeZone, validTimeZone } from "../utils/eventTimeZone";

export function useEventTimeZone(location: string, coords: { lat: number; lng: number } | null) {
  const [creatorTimeZone] = useState(deviceTimeZone);
  const [selection, setSelection] = useState({ timeZone: creatorTimeZone, source: "manual", key: "" });
  const [lookup, setLookup] = useState<{ key: string; status: "idle" | "loading" | "ready" | "failed"; timeZone?: string }>({ key: "", status: "idle" });
  const lat = coords?.lat;
  const lng = coords?.lng;
  const key = JSON.stringify([location.trim(), lat, lng]);

  useEffect(() => {
    let cancelled = false;
    if (lat === undefined || lng === undefined) {
      setLookup({ key, status: "idle" });
      return;
    }
    setLookup({ key, status: "loading" });
    lookupEventTimeZone({ lat, lng }).then((timeZone) => {
      if (!cancelled) setLookup({ key, status: "ready", timeZone });
    }).catch(() => {
      if (!cancelled) setLookup({ key, status: "failed" });
    });
    return () => { cancelled = true; };
  }, [key, lat, lng]);

  const current = lookup.key === key ? lookup : undefined;
  const confirmedManually = selection.key === key;
  const confirmed = confirmedManually || (current?.status === "ready" && current.timeZone === selection.timeZone);
  return {
    timeZone: selection.timeZone,
    creatorTimeZone,
    source: confirmedManually ? selection.source : "location",
    confirmed,
    loading: lat !== undefined && (!current || current.status === "loading"),
    failed: current?.status === "failed",
    suggested: !confirmed && current?.status === "ready" ? current.timeZone : undefined,
    confirm: (zone: string, source = "manual") => {
      const timeZone = validTimeZone(zone);
      if (timeZone) setSelection({ timeZone, source, key });
    }
  };
}
