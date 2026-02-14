import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import tailgateTimeLogo from "../../ttnobg.png";
import AppShell from "../components/AppShell";
import { PublicTopNav } from "../components/PublicTopNav";
import SiteFooter from "../components/SiteFooter";
import { mockTailgates } from "../data/mockTailgates";
import { useAuth } from "../hooks/useAuth";
import { usePlacesAutocomplete } from "../hooks/usePlacesAutocomplete";
import { db } from "../lib/firebase";
import { loadGoogleMapsSdk } from "../lib/googleMapsSdk";
import { formatCurrencyFromCents } from "../utils/format";

type ViewMode = "list" | "map";

type LatLng = {
  lat: number;
  lng: number;
};

type DiscoverTailgateRecord = {
  id: string;
  eventName: string;
  startDateTime: Date | null;
  visibilityType: "open_free" | "open_paid";
  coverImageUrl: string;
  locationSummary?: string;
  coords?: LatLng | null;
  priceCents?: number;
  ticketSalesCloseAt?: Date | null;
  currency: string;
};

type DiscoverTailgate = DiscoverTailgateRecord & {
  distanceMiles?: number;
  distanceLabel?: string;
};

const DEFAULT_RADIUS_MILES = 50;
const EARTH_RADIUS_MILES = 3958.8;
const DAY_IN_MS = 24 * 60 * 60 * 1000;
const MAPS_API_KEY = (
  import.meta.env.MAPS_API_KEY ??
  import.meta.env.VITE_MAPS_API_KEY ??
  ""
).trim();
const DEFAULT_TAILGATE_COVER_IMAGE = tailgateTimeLogo;

const MOCK_COORDS: LatLng[] = [
  { lat: 40.4453, lng: -80.0155 },
  { lat: 40.4431, lng: -79.9975 },
  { lat: 40.437, lng: -80.0012 },
  { lat: 40.4512, lng: -79.9872 }
];

function asRecord(value: unknown): Record<string, unknown> | null {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return null;
  }
  return value as Record<string, unknown>;
}

function firstString(...values: unknown[]): string | undefined {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }
  return undefined;
}

function firstStringFromArray(value: unknown): string | undefined {
  if (!Array.isArray(value)) return undefined;
  for (const item of value) {
    if (typeof item === "string" && item.trim()) {
      return item.trim();
    }
  }
  return undefined;
}

function coerceNumber(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return undefined;
}

function normalizeDate(value: unknown): Date | null {
  if (!value) return null;
  if (value instanceof Date) return value;
  if (typeof value === "string" || typeof value === "number") {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  const maybeTimestamp = value as { toDate?: () => Date; seconds?: number };
  if (typeof maybeTimestamp.toDate === "function") {
    const parsed = maybeTimestamp.toDate();
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  if (typeof maybeTimestamp.seconds === "number") {
    const parsed = new Date(maybeTimestamp.seconds * 1000);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  return null;
}

function resolveVisibilityType(data: Record<string, unknown>) {
  const raw = String(data.visibilityType ?? "").toLowerCase();
  if (raw === "open_free" || raw === "open_paid") return raw;

  if (raw === "private" || data.isPrivate === true) return "private";

  const ticketPriceCents =
    coerceNumber(data.ticketPriceCents) ??
    coerceNumber(data.priceCents) ??
    coerceNumber(data.ticketPrice);

  if ((ticketPriceCents ?? 0) > 0) return "open_paid";
  return "open_free";
}

function isCancelledEvent(data: Record<string, unknown>) {
  const status = firstString(data.status, data.eventStatus)?.toLowerCase();
  if (status === "cancelled" || status === "canceled") {
    return true;
  }
  return Boolean(data.cancelledAt);
}

function resolveLocationSummary(data: Record<string, unknown>) {
  const direct = firstString(data.locationSummary, data.location, data.venueName);
  if (direct) return direct;

  const location = asRecord(data.location);
  if (!location) return undefined;

  return firstString(
    location.address,
    location.formattedAddress,
    location.formatted,
    location.description,
    location.text,
    location.name,
    location.shortAddress
  );
}

function resolveCoverImageUrl(data: Record<string, unknown>) {
  const cover = asRecord(data.cover);
  const media = asRecord(data.media);

  return firstString(
    data.coverImageUrl,
    data.coverPhotoUrl,
    data.heroImageUrl,
    data.bannerImageUrl,
    data.imageUrl,
    data.photoURL,
    data.photoUrl,
    cover?.url,
    cover?.imageUrl,
    cover?.downloadUrl,
    cover?.src,
    media?.coverImageUrl,
    media?.imageUrl,
    firstStringFromArray(data.coverImageUrls),
    firstStringFromArray(cover?.imageUrls),
    firstStringFromArray(media?.coverImageUrls),
    firstStringFromArray(media?.imageUrls)
  );
}

function resolveLocationCoords(
  locationRaw: unknown,
  locationCoordsRaw: unknown
): { lat: number; lng: number } | null {
  const location = asRecord(locationRaw);
  const locationCoords = asRecord(locationCoordsRaw);
  const pin = asRecord(location?.pin);

  const lat =
    coerceNumber(pin?.lat) ??
    coerceNumber(location?.lat) ??
    coerceNumber(locationCoords?.lat);
  const lng =
    coerceNumber(pin?.lng) ??
    coerceNumber(location?.lng) ??
    coerceNumber(locationCoords?.lng);

  if (typeof lat === "number" && typeof lng === "number") {
    return { lat, lng };
  }

  return null;
}

function resolveTicketSalesCloseAt(
  data: Record<string, unknown>,
  startDateTime: Date | null
): Date | null {
  const direct =
    normalizeDate(data.ticketSalesCloseAt) ??
    normalizeDate(data.ticketSalesCutoffAt) ??
    normalizeDate(data.salesCloseAt);
  if (direct) return direct;

  const daysBefore =
    coerceNumber(data.ticketSalesCloseDaysBefore) ?? coerceNumber(data.ticketSalesCutoffDays);
  if (typeof daysBefore !== "number" || !startDateTime) {
    return null;
  }

  return new Date(startDateTime.getTime() - Math.max(0, daysBefore) * DAY_IN_MS);
}

function toDiscoverTailgateRecord(
  id: string,
  data: Record<string, unknown>
): DiscoverTailgateRecord | null {
  const visibilityType = resolveVisibilityType(data);
  if (visibilityType === "private") return null;
  if (isCancelledEvent(data)) return null;

  const startDateTime =
    normalizeDate(data.startDateTime) ??
    normalizeDate(data.dateTime) ??
    normalizeDate(data.startAt) ??
    normalizeDate(data.eventDateTime) ??
    normalizeDate(data.eventDate) ??
    normalizeDate(data.createdAt);

  const priceCents =
    coerceNumber(data.ticketPriceCents) ??
    coerceNumber(data.priceCents) ??
    coerceNumber(data.ticketPrice);
  const ticketSalesCloseAt = resolveTicketSalesCloseAt(data, startDateTime);

  return {
    id,
    eventName: firstString(data.eventName, data.name, data.title) ?? "Untitled Tailgate",
    startDateTime,
    visibilityType,
    coverImageUrl: resolveCoverImageUrl(data) ?? DEFAULT_TAILGATE_COVER_IMAGE,
    locationSummary: resolveLocationSummary(data),
    coords: resolveLocationCoords(data.location, data.locationCoords),
    priceCents,
    ticketSalesCloseAt,
    currency: firstString(data.currency, data.ticketCurrency) ?? "USD"
  };
}

function fromMockTailgates(): DiscoverTailgateRecord[] {
  const nowTime = Date.now();

  return mockTailgates
    .filter((item) => {
      if (item.visibilityType !== "open_free" && item.visibilityType !== "open_paid") {
        return false;
      }
      const status = (item.status ?? "").toLowerCase();
      if (status === "cancelled" || status === "canceled") {
        return false;
      }
      return item.startDateTime.getTime() >= nowTime;
    })
    .map((item, index) => ({
      id: item.id,
      eventName: item.name,
      startDateTime: item.startDateTime,
      visibilityType: item.visibilityType,
      coverImageUrl: item.coverImageUrl ?? DEFAULT_TAILGATE_COVER_IMAGE,
      locationSummary: item.locationSummary,
      coords: MOCK_COORDS[index % MOCK_COORDS.length],
      priceCents: item.ticketPriceCents,
      currency: "USD"
    }));
}

function toRadians(value: number) {
  return (value * Math.PI) / 180;
}

function haversineMiles(a: LatLng, b: LatLng) {
  const dLat = toRadians(b.lat - a.lat);
  const dLng = toRadians(b.lng - a.lng);
  const lat1 = toRadians(a.lat);
  const lat2 = toRadians(b.lat);

  const sinHalfLat = Math.sin(dLat / 2);
  const sinHalfLng = Math.sin(dLng / 2);

  const h =
    sinHalfLat * sinHalfLat +
    Math.cos(lat1) * Math.cos(lat2) * sinHalfLng * sinHalfLng;

  return 2 * EARTH_RADIUS_MILES * Math.asin(Math.sqrt(h));
}

function formatDiscoverDate(date: Date | null) {
  if (!date || Number.isNaN(date.getTime())) return "Time TBD";

  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(date);
}

function formatDistance(miles: number) {
  if (miles < 1) return "<1 mi";
  if (miles < 10) return `${miles.toFixed(1)} mi`;
  return `${Math.round(miles)} mi`;
}

function formatTicketSalesCountdown(item: DiscoverTailgate): string | null {
  if (item.visibilityType !== "open_paid" || !item.ticketSalesCloseAt) return null;

  const cutoffTime = item.ticketSalesCloseAt.getTime();
  if (Number.isNaN(cutoffTime)) return null;

  const msLeft = cutoffTime - Date.now();
  if (msLeft <= 0) return "TICKET SALES CLOSED";

  const daysLeft = Math.ceil(msLeft / DAY_IN_MS);
  return `ONLY ${daysLeft} ${daysLeft === 1 ? "DAY" : "DAYS"} LEFT TO BUY TICKETS`;
}

function markerColor(item: DiscoverTailgate, selected: boolean) {
  if (selected) return "#ffd86f";
  return item.visibilityType === "open_paid" ? "#ffd86f" : "#4fd1c5";
}

function DiscoverGoogleMap({
  mapsApiKey,
  center,
  pins,
  selectedId,
  onSelect
}: {
  mapsApiKey: string;
  center: LatLng | null;
  pins: Array<DiscoverTailgate & { coords: LatLng }>;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const mapsRef = useRef<any>(null);
  const markersRef = useRef<Array<any>>([]);
  const [mapState, setMapState] = useState<"loading" | "ready" | "error">(
    "loading"
  );

  useEffect(() => {
    let active = true;

    setMapState("loading");
    loadGoogleMapsSdk(mapsApiKey)
      .then((mapsSdk) => {
        if (!active) return;
        mapsRef.current = mapsSdk;
        setMapState("ready");
      })
      .catch((err) => {
        console.error("Failed to initialize Google Maps", err);
        if (!active) return;
        setMapState("error");
      });

    return () => {
      active = false;
    };
  }, [mapsApiKey]);

  useEffect(() => {
    if (mapState !== "ready" || !mapContainerRef.current) return;
    if (mapRef.current) return;

    const maps = mapsRef.current;
    if (!maps) return;

    const startCenter = center ?? pins[0]?.coords ?? { lat: 40.4453, lng: -80.0155 };

    mapRef.current = new maps.Map(mapContainerRef.current, {
      center: startCenter,
      zoom: 12,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      clickableIcons: false
    });

    mapRef.current.addListener("click", () => {
      onSelect(null);
    });
  }, [center, mapState, onSelect, pins]);

  useEffect(() => {
    if (mapState !== "ready" || !mapRef.current) return;
    const maps = mapsRef.current;
    if (!maps) return;

    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    pins.forEach((item, index) => {
      const selected = item.id === selectedId;
      const marker = new maps.Marker({
        map: mapRef.current,
        position: item.coords,
        title: item.eventName,
        zIndex: selected ? 100 : 10,
        label: {
          text: String(index + 1),
          color: "#13233a",
          fontWeight: "700",
          fontSize: "11px"
        },
        icon: {
          path: maps.SymbolPath.CIRCLE,
          scale: selected ? 15 : 11,
          fillColor: markerColor(item, selected),
          fillOpacity: 1,
          strokeColor: "#ffffff",
          strokeWeight: selected ? 2.3 : 2
        }
      });

      marker.addListener("click", () => onSelect(item.id));
      markersRef.current.push(marker);
    });

    if (pins.length === 0) {
      if (center) {
        mapRef.current.setCenter(center);
        mapRef.current.setZoom(11);
      }
      return;
    }

    const selected = pins.find((item) => item.id === selectedId);
    if (selected) {
      mapRef.current.panTo(selected.coords);
      if ((mapRef.current.getZoom() ?? 0) < 14) {
        mapRef.current.setZoom(17);
      }
      return;
    }

    const bounds = new maps.LatLngBounds();
    pins.forEach((item) => bounds.extend(item.coords));
    if (center) bounds.extend(center);

    mapRef.current.fitBounds(bounds);
    maps.event.addListenerOnce(mapRef.current, "idle", () => {
      if ((mapRef.current?.getZoom?.() ?? 0) > 13) {
        mapRef.current.setZoom(13);
      }
    });
  }, [center, mapState, onSelect, pins, selectedId]);

  useEffect(() => {
    return () => {
      markersRef.current.forEach((marker) => marker.setMap(null));
      markersRef.current = [];
    };
  }, []);

  if (mapState === "error") {
    return (
      <div className="discover-map-empty-overlay">
        <div className="discover-empty-state">
          <p className="discover-empty-title">Map could not load.</p>
          <p className="discover-empty-subtitle">
            Verify `MAPS_API_KEY`, referrer restrictions, and enabled Google Maps APIs.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="discover-google-map" ref={mapContainerRef} />
      {mapState === "loading" ? (
        <div className="discover-map-loading">Loading map…</div>
      ) : null}
    </>
  );
}

async function geocodeLocationQuery(
  query: string,
  mapsApiKey?: string
): Promise<{ lat: number; lng: number; label: string } | null> {
  const key = (mapsApiKey ?? "").trim();
  if (!key) return null;
  const url = new URL("https://maps.googleapis.com/maps/api/geocode/json");
  url.searchParams.set("address", query);
  url.searchParams.set("key", key);

  const response = await fetch(url.toString(), {
    headers: {
      Accept: "application/json"
    }
  });

  if (!response.ok) return null;

  const payload = (await response.json()) as {
    status?: string;
    results?: Array<{
      formatted_address?: string;
      geometry?: { location?: { lat?: number; lng?: number } };
    }>;
  };

  if (payload.status !== "OK") return null;
  const first = payload.results?.[0];
  const lat = first?.geometry?.location?.lat;
  const lng = first?.geometry?.location?.lng;
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;

  return {
    lat,
    lng,
    label: first?.formatted_address ?? query
  };
}

function requestBrowserLocation(): Promise<LatLng | null> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(null);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      () => resolve(null),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  });
}

export default function DiscoverTailgates() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [sourceTailgates, setSourceTailgates] = useState<DiscoverTailgateRecord[]>([]);
  const [loadingState, setLoadingState] = useState<"initial" | "idle">("initial");
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const [center, setCenter] = useState<LatLng | null>(null);
  const [centerLabel, setCenterLabel] = useState<string | null>(null);
  const [centerSource, setCenterSource] = useState<"gps" | "manual" | null>(null);
  const [locationStatus, setLocationStatus] = useState<"idle" | "denied" | "unsupported">("idle");

  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [searchText, setSearchText] = useState("");
  const [searchInputFocused, setSearchInputFocused] = useState(false);
  const [searching, setSearching] = useState(false);
  const [locating, setLocating] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    if (!db) {
      setSourceTailgates(fromMockTailgates());
      setLoadingState("idle");
      setError(null);
      return;
    }

    setLoadingState("initial");
    setError(null);

    const unsubscribe = onSnapshot(
      collection(db, "tailgateEvents"),
      (snapshot) => {
        const items = snapshot.docs
          .map((doc) => toDiscoverTailgateRecord(doc.id, doc.data() as Record<string, unknown>))
          .filter((item): item is DiscoverTailgateRecord => Boolean(item));

        setSourceTailgates(items);
        setLoadingState("idle");
        setError(null);
      },
      (err) => {
        console.error("Failed to load discover tailgates", err);
        setError("We couldn't load open tailgates right now.");
        setLoadingState("idle");
      }
    );

    return () => unsubscribe();
  }, [reloadKey]);

  const tailgates = useMemo(() => {
    const nowTime = Date.now();

    const enriched: DiscoverTailgate[] = sourceTailgates
      .filter((item) => {
        if (item.visibilityType !== "open_free" && item.visibilityType !== "open_paid") {
          return false;
        }
        if (!item.startDateTime) return false;
        return item.startDateTime.getTime() >= nowTime;
      })
      .map((item) => {
      const distanceMiles = center && item.coords ? haversineMiles(center, item.coords) : undefined;

      return {
        ...item,
        distanceMiles,
        distanceLabel: typeof distanceMiles === "number" ? formatDistance(distanceMiles) : undefined
      };
    });

    const filtered = center
      ? enriched.filter(
          (item) => typeof item.distanceMiles !== "number" || item.distanceMiles <= DEFAULT_RADIUS_MILES
        )
      : enriched;

    return filtered.sort((a, b) => {
      if (center) {
        const aDistance = a.distanceMiles ?? Number.POSITIVE_INFINITY;
        const bDistance = b.distanceMiles ?? Number.POSITIVE_INFINITY;
        if (aDistance !== bDistance) return aDistance - bDistance;
      }

      const aDate = a.startDateTime?.getTime() ?? Number.POSITIVE_INFINITY;
      const bDate = b.startDateTime?.getTime() ?? Number.POSITIVE_INFINITY;
      return aDate - bDate;
    });
  }, [center, sourceTailgates]);

  useEffect(() => {
    if (!selectedId) return;
    if (!tailgates.some((item) => item.id === selectedId)) {
      setSelectedId(null);
    }
  }, [selectedId, tailgates]);

  useEffect(() => {
    if (viewMode === "list") {
      setSelectedId(null);
    }
  }, [viewMode]);

  const hasGoogleMapsKey = MAPS_API_KEY.length > 0;
  const {
    suggestions: locationSuggestions,
    loading: locationSuggestionsLoading,
    resolveSuggestion: resolveLocationSuggestion,
    clearSuggestions: clearLocationSuggestions
  } = usePlacesAutocomplete({
    mapsApiKey: MAPS_API_KEY,
    value: searchText,
    enabled: hasGoogleMapsKey
  });
  const mapPins = useMemo(
    () => tailgates.filter((item): item is DiscoverTailgate & { coords: LatLng } => Boolean(item.coords)),
    [tailgates]
  );
  const selectedMapTailgate = useMemo(
    () => mapPins.find((item) => item.id === selectedId) ?? null,
    [mapPins, selectedId]
  );

  const handlePlaceSuggestionSelect = useCallback(
    async (place: { placeId: string; description: string }) => {
      const resolved = await resolveLocationSuggestion(place);
      if (!resolved) {
        setError("Could not find that location. Try another ZIP or city.");
        return;
      }

      setSearchText(resolved.label);
      setCenter({ lat: resolved.lat, lng: resolved.lng });
      setCenterLabel(resolved.label);
      setCenterSource("manual");
      setSelectedId(null);
      setError(null);
      clearLocationSuggestions();
      setSearchInputFocused(false);
    },
    [clearLocationSuggestions, resolveLocationSuggestion]
  );

  const handleSearchSubmit = useCallback(async () => {
    const query = searchText.trim();
    if (!query) return;
    if (!hasGoogleMapsKey) {
      setError("Set MAPS_API_KEY to search locations with Google Maps.");
      return;
    }

    setSearching(true);
    try {
      const result = await geocodeLocationQuery(query, MAPS_API_KEY);
      if (!result) {
        setError("Could not find that location. Try another ZIP or city.");
        return;
      }

      setCenter({ lat: result.lat, lng: result.lng });
      setCenterLabel(result.label);
      setCenterSource("manual");
      setSelectedId(null);
      setError(null);
      clearLocationSuggestions();
      setSearchInputFocused(false);
    } catch (err) {
      console.error("Discover geocode failed", err);
      setError("Could not search that location right now.");
    } finally {
      setSearching(false);
    }
  }, [clearLocationSuggestions, hasGoogleMapsKey, searchText]);

  const handleUseMyLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      setLocationStatus("unsupported");
      setError("Location is not supported in this browser.");
      return;
    }

    setLocating(true);
    const coords = await requestBrowserLocation();
    setLocating(false);

    if (!coords) {
      setLocationStatus("denied");
      setError("Location permission is off. Search by ZIP or city instead.");
      return;
    }

    setCenter(coords);
    setCenterLabel("Your location");
    setCenterSource("gps");
    setLocationStatus("idle");
    setError(null);
    setSelectedId(null);
    clearLocationSuggestions();
    setSearchInputFocused(false);
  }, [clearLocationSuggestions]);

  const handleRetry = useCallback(() => {
    setReloadKey((value) => value + 1);
  }, []);

  const handleHostTailgate = useCallback(() => {
    navigate("/tailgates/new");
  }, [navigate]);

  const handleOpenDetails = useCallback(
    (id: string) => {
      navigate(`/tailgates/${id}`);
    },
    [navigate]
  );

  const locationPillText = !center
    ? "Set a location"
    : centerSource === "gps" || centerLabel === "Your location"
    ? "Near you"
    : `Near ${centerLabel ?? "this area"}`;

  const renderEmptyState = () => {
    if (error) {
      return (
        <div className="discover-empty-state">
          <p className="discover-empty-title">{error}</p>
          <button className="primary-button" type="button" onClick={handleRetry}>
            Retry
          </button>
        </div>
      );
    }

    if (!center && tailgates.length === 0) {
      return (
        <div className="discover-empty-state">
          <p className="discover-empty-title">Find open tailgates near you</p>
          <p className="discover-empty-subtitle">
            {locationStatus === "denied"
              ? "Turn on location or search by ZIP/city to find nearby tailgates."
              : locationStatus === "unsupported"
              ? "This browser does not support location access. Search by ZIP/city instead."
              : "Use your location or search by ZIP/city to get started."}
          </p>
        </div>
      );
    }

    return (
      <div className="discover-empty-state">
        <p className="discover-empty-title">No open tailgates found here yet.</p>
        <p className="discover-empty-subtitle">
          Try another ZIP/city or host the first tailgate in this area.
        </p>
        <button className="primary-button" type="button" onClick={handleHostTailgate}>
          Host a tailgate here
        </button>
      </div>
    );
  };

  const discoverContent = (
    <section className="discover-page">
        <div className="discover-header-row">
          <div>
            <h1 className="discover-title">Discover</h1>
            <div className="discover-pill-row">
              <div className="discover-location-pill">
                <span className="discover-location-dot" aria-hidden="true" />
                <span className="discover-location-pill-text">{locationPillText}</span>
              </div>
              {loadingState === "initial" ? <span className="discover-header-loading">Loading...</span> : null}
            </div>
          </div>
          <button type="button" className="discover-filter-button" disabled>
            Filters
          </button>
        </div>

        <div className="discover-search-section">
          <div className="discover-search-row">
            <div className="discover-search-input-wrap">
              <input
                className="text-input discover-search-input"
                placeholder="Search by ZIP, city, or address"
                value={searchText}
                onChange={(event) => setSearchText(event.target.value)}
                onFocus={() => setSearchInputFocused(true)}
                onBlur={() => {
                  window.setTimeout(() => setSearchInputFocused(false), 120);
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    const firstSuggestion = locationSuggestions[0];
                    if (firstSuggestion) {
                      void handlePlaceSuggestionSelect(firstSuggestion);
                      return;
                    }
                    void handleSearchSubmit();
                  }
                }}
              />
              {searchInputFocused && searchText.trim() && hasGoogleMapsKey ? (
                <div className="places-suggestions discover-places-suggestions">
                  {locationSuggestionsLoading ? (
                    <p className="places-suggestion-state">Searching places...</p>
                  ) : locationSuggestions.length > 0 ? (
                    locationSuggestions.map((place) => (
                      <button
                        key={place.placeId}
                        type="button"
                        className="places-suggestion-button"
                        onMouseDown={(event) => event.preventDefault()}
                        onClick={() => {
                          void handlePlaceSuggestionSelect(place);
                        }}
                      >
                        <span className="places-suggestion-primary">{place.primaryText}</span>
                        {place.secondaryText ? (
                          <span className="places-suggestion-secondary">{place.secondaryText}</span>
                        ) : null}
                      </button>
                    ))
                  ) : (
                    <p className="places-suggestion-state">No place matches found.</p>
                  )}
                </div>
              ) : null}
            </div>
            <button
              className="discover-search-action"
              type="button"
              onClick={() => void handleSearchSubmit()}
              disabled={searching}
            >
              {searching ? "..." : "Go"}
            </button>
          </div>
          <button
            type="button"
            className="discover-location-button"
            onClick={handleUseMyLocation}
            disabled={locating}
          >
            {locating ? "Locating..." : "Use my location"}
          </button>
        </div>

        {error && tailgates.length > 0 ? <p className="discover-inline-error">{error}</p> : null}

        <div className="discover-toggle-row">
          {(["list", "map"] as const).map((mode) => {
            const active = viewMode === mode;
            return (
              <button
                type="button"
                key={mode}
                className={`discover-toggle-button ${active ? "active" : ""}`}
                onClick={() => setViewMode(mode)}
              >
                {mode === "list" ? "List" : "Map"}
              </button>
            );
          })}
        </div>

        {loadingState === "initial" ? (
          <div className="discover-loading-state">
            <div className="skeleton discover-skeleton" />
            <p>Finding open tailgates...</p>
          </div>
        ) : viewMode === "map" ? (
          <div className="discover-map-wrap">
            {!hasGoogleMapsKey ? (
              <div className="discover-map-empty-overlay">
                <div className="discover-empty-state">
                  <p className="discover-empty-title">Google Maps key required.</p>
                  <p className="discover-empty-subtitle">
                    Set <code>MAPS_API_KEY</code> to display map pins and use map search.
                  </p>
                </div>
              </div>
            ) : (
              <DiscoverGoogleMap
                mapsApiKey={MAPS_API_KEY}
                center={center}
                pins={mapPins}
                selectedId={selectedId}
                onSelect={setSelectedId}
              />
            )}

            {tailgates.length === 0 && hasGoogleMapsKey ? (
              <div className="discover-map-empty-overlay">{renderEmptyState()}</div>
            ) : null}

            {!hasGoogleMapsKey ? null : mapPins.length > 0 ? (
              <>
                <p className="discover-map-hint">Select from the list or tap a numbered pin</p>
                <aside className="discover-map-results">
                  <div className="discover-map-results-header">
                    <h3>Tailgates in this area</h3>
                    <span>{mapPins.length}</span>
                  </div>

                  <div className="discover-map-results-list">
                    {mapPins.map((item, index) => {
                      const active = selectedMapTailgate?.id === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          className={`discover-map-result-item${active ? " active" : ""}`}
                          onClick={() => setSelectedId(item.id)}
                        >
                          <span className="discover-map-result-index">{index + 1}</span>
                          <span className="discover-map-result-main">
                            <strong>{item.eventName}</strong>
                            <small>{formatDiscoverDate(item.startDateTime)}</small>
                          </span>
                          <span className="discover-map-result-price">
                            {item.visibilityType === "open_paid"
                              ? item.priceCents
                                ? formatCurrencyFromCents(item.priceCents)
                                : "Paid"
                              : "Free"}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {selectedMapTailgate ? (
                    <div className="discover-map-preview">
                      <div
                        className="discover-side-panel-cover has-image"
                        aria-hidden="true"
                      >
                        <img src={selectedMapTailgate.coverImageUrl} alt="" loading="lazy" />
                      </div>
                      <div className="discover-side-panel-header">
                        <h3>{selectedMapTailgate.eventName}</h3>
                        <button type="button" onClick={() => setSelectedId(null)}>
                          Close
                        </button>
                      </div>
                      <p className="discover-side-panel-date">{formatDiscoverDate(selectedMapTailgate.startDateTime)}</p>
                      <div className="discover-side-panel-meta-row">
                        <span
                          className={`chip ${
                            selectedMapTailgate.visibilityType === "open_paid" ? "chip-upcoming" : "chip-live"
                          }`}
                        >
                          {selectedMapTailgate.visibilityType === "open_paid" ? "Open Paid" : "Open Free"}
                        </span>
                        {selectedMapTailgate.distanceLabel ? (
                          <span className="discover-side-panel-distance">{selectedMapTailgate.distanceLabel} away</span>
                        ) : null}
                      </div>
                      <p className="discover-side-panel-price">
                        {selectedMapTailgate.visibilityType === "open_paid"
                          ? selectedMapTailgate.priceCents
                            ? `${formatCurrencyFromCents(selectedMapTailgate.priceCents)} per person`
                            : "Paid"
                          : "Free"}
                      </p>
                      {(() => {
                        const cutoffLabel = formatTicketSalesCountdown(selectedMapTailgate);
                        return cutoffLabel ? (
                          <p className="discover-cutoff-pill">{cutoffLabel}</p>
                        ) : null;
                      })()}
                      <p className="discover-side-panel-location">
                        {selectedMapTailgate.locationSummary ?? "Location coming soon"}
                      </p>
                      <button
                        type="button"
                        className="primary-button discover-view-tailgate"
                        onClick={() => handleOpenDetails(selectedMapTailgate.id)}
                      >
                        View tailgate
                      </button>
                    </div>
                  ) : (
                    <p className="discover-map-preview-empty">
                      Select a tailgate to open its preview.
                    </p>
                  )}
                </aside>
              </>
            ) : null}
          </div>
        ) : tailgates.length > 0 ? (
          <div className="discover-list">
            {tailgates.map((item) => {
              const cutoffLabel = formatTicketSalesCountdown(item);
              return (
                <article
                  key={item.id}
                  className="discover-card"
                  role="button"
                  tabIndex={0}
                  onClick={() => handleOpenDetails(item.id)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      handleOpenDetails(item.id);
                    }
                  }}
                >
                  <div className="discover-card-header">
                    <div
                      className="discover-card-media has-image"
                      aria-hidden="true"
                    >
                      <img src={item.coverImageUrl} alt="" loading="lazy" />
                      <span
                        className={`chip discover-card-chip ${
                          item.visibilityType === "open_paid" ? "chip-upcoming" : "chip-live"
                        }`}
                      >
                        {item.visibilityType === "open_paid" ? "Open Paid" : "Open Free"}
                      </span>
                    </div>
                    <div>
                      <h3>{item.eventName}</h3>
                      <p>{formatDiscoverDate(item.startDateTime)}</p>
                    </div>
                  </div>
                  <div className="discover-card-body">
                    <div className="discover-card-copy">
                      <p>{item.locationSummary ?? "Location coming soon"}</p>
                      {cutoffLabel ? <p className="discover-cutoff-pill">{cutoffLabel}</p> : null}
                    </div>
                    <div className="discover-card-meta">
                      <strong>
                        {item.visibilityType === "open_paid"
                          ? item.priceCents
                            ? `${formatCurrencyFromCents(item.priceCents)} / person`
                            : "Paid"
                          : "Free"}
                      </strong>
                      {item.distanceLabel ? <span>{item.distanceLabel} away</span> : null}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          renderEmptyState()
        )}
    </section>
  );

  if (user) {
    return <AppShell>{discoverContent}</AppShell>;
  }

  return (
    <div className="public-page">
      <PublicTopNav />
      <main className="discover-public-shell">{discoverContent}</main>
      <SiteFooter />
    </div>
  );
}
