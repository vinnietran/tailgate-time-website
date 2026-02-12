import { useEffect, useMemo, useRef, useState } from "react";
import { loadGoogleMapsSdk } from "../lib/googleMapsSdk";

export type PlaceSuggestion = {
  placeId: string;
  description: string;
  primaryText: string;
  secondaryText?: string;
  reference?: string;
  types?: string[];
  terms?: Array<{ value: string; offset?: number }>;
};

export type ResolvedPlace = {
  lat: number;
  lng: number;
  label: string;
  formattedAddress?: string;
  name?: string;
  addressComponents?: Array<Record<string, unknown>>;
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
                const reference =
                  typeof prediction?.reference === "string" ? prediction.reference : undefined;
                const types = Array.isArray(prediction?.types)
                  ? prediction.types.filter(
                      (type: unknown): type is string => typeof type === "string"
                    )
                  : undefined;
                const terms = Array.isArray(prediction?.terms)
                  ? prediction.terms
                      .map((term: unknown) => {
                        if (typeof term !== "object" || term === null) return null;
                        const candidate = term as { value?: unknown; offset?: unknown };
                        if (typeof candidate.value !== "string") return null;
                        const offset =
                          typeof candidate.offset === "number" ? candidate.offset : undefined;
                        return { value: candidate.value, offset };
                      })
                      .filter(
                        (term): term is { value: string; offset?: number } => Boolean(term)
                      )
                  : undefined;

                return {
                  placeId,
                  description,
                  primaryText,
                  secondaryText,
                  reference,
                  types,
                  terms
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
          fields: ["geometry", "formatted_address", "name", "address_components"]
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

          const formattedAddress =
            typeof result?.formatted_address === "string" &&
            result.formatted_address.trim().length > 0
              ? result.formatted_address.trim()
              : undefined;
          const name =
            typeof result?.name === "string" && result.name.trim().length > 0
              ? result.name.trim()
              : undefined;
          const addressComponents = Array.isArray(result?.address_components)
            ? (result.address_components as Array<Record<string, unknown>>)
            : undefined;
          const label = formattedAddress ?? name ?? suggestion.description;

          resolve({
            lat: latValue,
            lng: lngValue,
            label,
            formattedAddress,
            name,
            addressComponents
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
