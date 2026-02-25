import { useCallback, useRef, useState } from "react";
import {
  ProcessTicketRefundInput,
  ProcessTicketRefundResult,
  getRefundErrorMessage,
  processTicketRefund as processTicketRefundService
} from "../services/refunds";

export function useProcessTicketRefund() {
  const inFlightRef = useRef(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastResult, setLastResult] = useState<ProcessTicketRefundResult | null>(null);

  const processTicketRefund = useCallback(async (input: ProcessTicketRefundInput) => {
    if (inFlightRef.current) return null;
    inFlightRef.current = true;
    setLoading(true);
    setError(null);

    try {
      const result = await processTicketRefundService(input);
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
    processTicketRefund,
    loading,
    error,
    clearError,
    lastResult
  };
}
