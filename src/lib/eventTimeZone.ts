import { httpsCallable } from "firebase/functions";
import { functions } from "./firebase";
import { validTimeZone } from "../utils/eventTimeZone";

export async function lookupEventTimeZone(coords: { lat: number; lng: number }): Promise<string> {
  if (!functions) throw new Error("Timezone lookup unavailable");
  const lookup = httpsCallable<{ lat: number; lng: number }, { timeZone: string }>(
    functions, "resolveEventTimeZone", { timeout: 12000 }
  );
  const result = await lookup(coords);
  const timeZone = validTimeZone(result.data.timeZone);
  if (!timeZone) throw new Error("Invalid timezone response");
  return timeZone;
}
