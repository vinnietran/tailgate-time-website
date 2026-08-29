import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import {
  isPayoutReady,
  resolveStripeConnectStatus,
  type StripeConnectStatus
} from "../features/create-event/ticketing";
import { db } from "../lib/firebase";
import {
  resolveHostPlatformFeeSummary,
  STANDARD_PLATFORM_FEE_PERCENT
} from "../utils/platformFees";

export type StripeConnectAccountState = {
  status: StripeConnectStatus;
  payoutsEnabled: boolean;
  accountId: string | null;
  requirementsDueCount: number;
  loading: boolean;
  error: string | null;
  ready: boolean;
  hostPlatformFeePercent: number;
  hostPromoEndsAtMs: number | null;
};

const EMPTY_ACCOUNT_STATE: StripeConnectAccountState = {
  status: "not_started",
  payoutsEnabled: false,
  accountId: null,
  requirementsDueCount: 0,
  loading: true,
  error: null,
  ready: false,
  hostPlatformFeePercent: STANDARD_PLATFORM_FEE_PERCENT,
  hostPromoEndsAtMs: null
};

export function useStripeConnectAccount(uid?: string) {
  const [account, setAccount] = useState<StripeConnectAccountState>(EMPTY_ACCOUNT_STATE);

  useEffect(() => {
    if (!uid) {
      setAccount({ ...EMPTY_ACCOUNT_STATE, loading: false });
      return;
    }

    if (!db) {
      setAccount({ ...EMPTY_ACCOUNT_STATE, loading: false });
      return;
    }

    setAccount((previous) => ({ ...previous, loading: true, error: null }));

    const userRef = doc(db, "users", uid);
    const unsubscribe = onSnapshot(
      userRef,
      (snapshot) => {
        const data = snapshot.exists()
          ? (snapshot.data() as Record<string, unknown>)
          : null;
        const requirements = data?.stripeConnectRequirements as
          | { currently_due?: unknown[] }
          | undefined;
        const feeSummary = resolveHostPlatformFeeSummary(data);

        setAccount({
          status: resolveStripeConnectStatus(data),
          payoutsEnabled: data?.payoutsEnabled === true,
          accountId:
            typeof data?.stripeConnectAccountId === "string"
              ? data.stripeConnectAccountId
              : null,
          requirementsDueCount: Array.isArray(requirements?.currently_due)
            ? requirements.currently_due.length
            : 0,
          loading: false,
          error: null,
          ready: isPayoutReady(data),
          hostPlatformFeePercent: feeSummary.feePercent,
          hostPromoEndsAtMs: feeSummary.promoEndsAtMs
        });
      },
      (snapshotError) => {
        console.error("Failed to load payout account", snapshotError);
        setAccount((previous) => ({
          ...previous,
          loading: false,
          error: "Unable to load payout account."
        }));
      }
    );

    return () => unsubscribe();
  }, [uid]);

  return account;
}
