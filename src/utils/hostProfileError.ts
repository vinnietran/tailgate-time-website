type FirebaseLikeError = {
  code?: unknown;
  message?: unknown;
};

export function formatHostProfileError(reason: unknown) {
  const error = reason as FirebaseLikeError | null;
  const code = typeof error?.code === "string" ? error.code.toLowerCase() : "";
  const message = typeof error?.message === "string" ? error.message.trim() : "";

  if (
    code === "functions/not-found" ||
    code === "functions/internal" ||
    message.toLowerCase() === "internal"
  ) {
    return "The Host Page service is not available in this environment yet. Deploy the Host Page Firebase functions, then retry.";
  }

  if (code === "functions/unauthenticated") {
    return "Your session expired. Sign in again, then retry.";
  }

  if (code === "functions/permission-denied") {
    return "This account does not currently have permission to manage a Host Page.";
  }

  if (code === "functions/unavailable") {
    return "The Host Page service is temporarily unavailable. Check your connection and retry.";
  }

  return message || "Unable to load your Host Page. Please retry.";
}
