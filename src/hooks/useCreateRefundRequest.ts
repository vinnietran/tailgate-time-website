import { useCallback, useRef, useState } from "react";
import {
  CreateRefundRequestInput,
  CreateRefundRequestResult,
  createRefundRequest as createRefundRequestService,
  getRefundErrorMessage
} from "../services/refunds";

export function useCreateRefundRequest() {
  const inFlightRef = useRef(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastResult, setLastResult] = useState<CreateRefundRequestResult | null>(null);

  const createRefundRequest = useCallback(async (input: CreateRefundRequestInput) => {
    if (inFlightRef.current) return null;
    inFlightRef.current = true;
    setLoading(true);
    setError(null);

    try {
      const result = await createRefundRequestService(input);
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
    createRefundRequest,
    loading,
    error,
    clearError,
    lastResult
  };
}
