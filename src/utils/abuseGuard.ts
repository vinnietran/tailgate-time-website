type AbuseGuardState = {
  attempts: number[];
  blockedUntil: number;
};

export type AbuseGuardOptions = {
  maxAttempts: number;
  windowMs: number;
  blockMs: number;
};

export type AbuseGuardDecision = {
  allowed: boolean;
  retryAfterMs: number;
};

const STORAGE_PREFIX = "abuse-guard:";

function getStorage() {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function readState(actionKey: string): AbuseGuardState {
  const storage = getStorage();
  if (!storage) {
    return { attempts: [], blockedUntil: 0 };
  }

  try {
    const raw = storage.getItem(`${STORAGE_PREFIX}${actionKey}`);
    if (!raw) {
      return { attempts: [], blockedUntil: 0 };
    }

    const parsed = JSON.parse(raw) as Partial<AbuseGuardState>;
    return {
      attempts: Array.isArray(parsed.attempts)
        ? parsed.attempts.filter((value): value is number => Number.isFinite(value))
        : [],
      blockedUntil: Number.isFinite(parsed.blockedUntil) ? Number(parsed.blockedUntil) : 0
    };
  } catch {
    return { attempts: [], blockedUntil: 0 };
  }
}

function writeState(actionKey: string, state: AbuseGuardState) {
  const storage = getStorage();
  if (!storage) {
    return;
  }

  try {
    storage.setItem(`${STORAGE_PREFIX}${actionKey}`, JSON.stringify(state));
  } catch {
    // Ignore storage write failures and fall back to no client-side cooldown.
  }
}

export function consumeClientRateLimit(
  actionKey: string,
  options: AbuseGuardOptions
): AbuseGuardDecision {
  const now = Date.now();
  const state = readState(actionKey);
  const attempts = state.attempts.filter((timestamp) => now - timestamp < options.windowMs);

  if (state.blockedUntil > now) {
    writeState(actionKey, { attempts, blockedUntil: state.blockedUntil });
    return {
      allowed: false,
      retryAfterMs: state.blockedUntil - now
    };
  }

  attempts.push(now);

  if (attempts.length > options.maxAttempts) {
    const blockedUntil = now + options.blockMs;
    writeState(actionKey, { attempts, blockedUntil });
    return {
      allowed: false,
      retryAfterMs: options.blockMs
    };
  }

  writeState(actionKey, { attempts, blockedUntil: 0 });
  return { allowed: true, retryAfterMs: 0 };
}

export function resetClientRateLimit(actionKey: string) {
  const storage = getStorage();
  if (!storage) {
    return;
  }

  try {
    storage.removeItem(`${STORAGE_PREFIX}${actionKey}`);
  } catch {
    // Ignore storage write failures and fall back to no client-side cooldown.
  }
}

export function formatRateLimitRetryAfter(retryAfterMs: number) {
  const totalSeconds = Math.max(1, Math.ceil(retryAfterMs / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (minutes === 0) {
    return `${totalSeconds}s`;
  }

  if (seconds === 0) {
    return `${minutes}m`;
  }

  return `${minutes}m ${seconds}s`;
}
