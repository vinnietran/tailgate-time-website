import { useCallback, useRef, useState } from "react";
import {
  DenyRefundRequestInput,
  DenyRefundRequestResult,
  denyRefundRequest as denyRefundRequestService,
  getRefundErrorMessage
} from "../services/refunds";

export function useDenyRefundRequest() {
  const inFlightRef = useRef(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastResult, setLastResult] = useState<DenyRefundRequestResult | null>(null);

  const denyRefundRequest = useCallback(async (input: DenyRefundRequestInput) => {
    if (inFlightRef.current) return null;
    inFlightRef.current = true;
    setLoading(true);
    setError(null);

    try {
      const result = await denyRefundRequestService(input);
      setLastResult(result);
      return result;
    } catch (requestError) {
      const message = getRefundErrorMessage(requestError);
      setError(message);
      throw requestError;
    } finally {
      inFlightRef.current = false;
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return {
    denyRefundRequest,
    loading,
    error,
    clearError,
    lastResult
  };
}
