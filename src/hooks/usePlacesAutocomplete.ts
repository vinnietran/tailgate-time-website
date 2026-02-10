import { useEffect, useMemo, useRef, useState } from "react";
import { loadGoogleMapsSdk } from "../lib/googleMapsSdk";

export type PlaceSuggestion = {
  placeId: string;
  description: string;
  primaryText: string;
  secondaryText?: string;
};

export type ResolvedPlace = {
  lat: number;
  lng: number;
  label: string;
};

type UsePlacesAutocompleteOptions = {
  mapsApiKey: string;
  value: string;
  enabled?: boolean;
  minChars?: number;
  debounceMs?: number;
};

export function usePlacesAutocomplete({
  mapsApiKey,
  value,
  enabled = true,
  minChars = 2,
  debounceMs = 220
}: UsePlacesAutocompleteOptions) {
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mapsRef = useRef<any>(null);
  const autocompleteServiceRef = useRef<any>(null);
  const placesServiceRef = useRef<any>(null);
  const requestIdRef = useRef(0);

  const normalizedValue = useMemo(() => value.trim(), [value]);

  useEffect(() => {
    let active = true;
    if (!enabled || !mapsApiKey.trim()) {
      setReady(false);
      setSuggestions([]);
      setError(null);
      return;
    }

    loadGoogleMapsSdk(mapsApiKey, ["places"])
      .then((maps) => {
        if (!active) return;
        mapsRef.current = maps;
        if (!autocompleteServiceRef.current && maps.places?.AutocompleteService) {
          autocompleteServiceRef.current = new maps.places.AutocompleteService();
        }
        if (!placesServiceRef.current && maps.places?.PlacesService) {
          const tempContainer = document.createElement("div");
          placesServiceRef.current = new maps.places.PlacesService(tempContainer);
        }
        const hasServices = Boolean(
          autocompleteServiceRef.current && placesServiceRef.current
        );
        setReady(hasServices);
        setError(hasServices ? null : "Google Places is unavailable.");
      })
      .catch((sdkError) => {
        console.error("Failed to load Google Places", sdkError);
        if (!active) return;
        setReady(false);
        setError("Unable to load Google Places.");
      });

    return () => {
      active = false;
    };
  }, [enabled, mapsApiKey]);

  useEffect(() => {
    if (!enabled || !ready) {
      setSuggestions([]);
      setLoading(false);
      return;
    }
    if (normalizedValue.length < minChars) {
      setSuggestions([]);
      setLoading(false);
      return;
    }
    if (!autocompleteServiceRef.current) {
      setSuggestions([]);
      setLoading(false);
      return;
    }

    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;
    setLoading(true);

    const timeoutId = window.setTimeout(() => {
      autocompleteServiceRef.current.getPlacePredictions(
        {
          input: normalizedValue
        },
        (predictions: any[] | null, status: string) => {
          if (requestIdRef.current !== requestId) return;
          setLoading(false);

          const okStatus = mapsRef.current?.places?.PlacesServiceStatus?.OK;
          if (status !== okStatus || !Array.isArray(predictions)) {
            setSuggestions([]);
            return;
          }

          setSuggestions(
            predictions
              .map((prediction) => {
                const placeId =
                  typeof prediction?.place_id === "string" ? prediction.place_id : "";
                const description =
                  typeof prediction?.description === "string" ? prediction.description : "";
                if (!placeId || !description) return null;

                const primaryText =
                  typeof prediction?.structured_formatting?.main_text === "string"
                    ? prediction.structured_formatting.main_text
                    : description;
                const secondaryText =
                  typeof prediction?.structured_formatting?.secondary_text === "string"
                    ? prediction.structured_formatting.secondary_text
                    : undefined;

                return {
                  placeId,
                  description,
                  primaryText,
                  secondaryText
                } as PlaceSuggestion;
              })
              .filter((prediction): prediction is PlaceSuggestion => Boolean(prediction))
          );
        }
      );
    }, debounceMs);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [debounceMs, enabled, minChars, normalizedValue, ready]);

  const resolveSuggestion = async (
    suggestion: Pick<PlaceSuggestion, "placeId" | "description">
  ): Promise<ResolvedPlace | null> => {
    if (!placesServiceRef.current || !ready) return null;

    return new Promise<ResolvedPlace | null>((resolve) => {
      placesServiceRef.current.getDetails(
        {
          placeId: suggestion.placeId,
          fields: ["geometry", "formatted_address", "name"]
        },
        (result: any, status: string) => {
          const okStatus = mapsRef.current?.places?.PlacesServiceStatus?.OK;
          if (status !== okStatus || !result) {
            resolve(null);
            return;
          }

          const latValue = result?.geometry?.location?.lat?.();
          const lngValue = result?.geometry?.location?.lng?.();
          if (!Number.isFinite(latValue) || !Number.isFinite(lngValue)) {
            resolve(null);
            return;
          }

          const label =
            (typeof result?.formatted_address === "string" &&
            result.formatted_address.trim().length > 0
              ? result.formatted_address
              : typeof result?.name === "string"
              ? result.name
              : suggestion.description) ?? suggestion.description;

          resolve({
            lat: latValue,
            lng: lngValue,
            label
          });
        }
      );
    });
  };

  const clearSuggestions = () => {
    setSuggestions([]);
  };

  return {
    suggestions,
    loading,
    ready,
    error,
    resolveSuggestion,
    clearSuggestions
  };
}
