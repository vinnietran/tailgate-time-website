export const isDebugAuth =
  import.meta.env.VITE_DEBUG_AUTH === "true" || import.meta.env.DEV;

export function debugAuthLog(message: string, payload?: Record<string, unknown>) {
  if (!isDebugAuth) return;
  if (payload) {
    console.info(`[auth] ${message}`, payload);
  } else {
    console.info(`[auth] ${message}`);
  }
}
