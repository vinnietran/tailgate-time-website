import { httpsCallable } from "firebase/functions";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { functions, storage, trackCustomEvent } from "./firebase";
import type {
  HostProfileDraft,
  OwnedHostProfile,
  PublicHostPageData,
} from "../types/hostProfile";
import { mockTailgates } from "../data/mockTailgates";

const MOCK_PROFILE: OwnedHostProfile = {
  hostId: "dev-host-001",
  enabled: true,
  slug: "demo-host",
  displayName: "Demo Host",
  tagline: "Game day starts with us.",
  description:
    "We bring fans together for welcoming, high-energy tailgates with great food and unforgettable game-day traditions.",
  location: "Pittsburgh, PA",
  logoUrl: "/images/buffalo_tailgates-logo.png",
  coverImageUrl: "/images/bt1.jpg",
  galleryImageUrls: ["/images/bt2.jpg", "/images/bt3.jpg", "/images/bt4.jpg"],
  publicPageSetupCompleted: false
};

function callable<TRequest, TResponse>(name: string) {
  if (!functions) return null;
  return httpsCallable<TRequest, TResponse>(functions, name);
}

export async function ensureHostProfile(): Promise<OwnedHostProfile> {
  const fn = callable<Record<string, never>, OwnedHostProfile>("ensureHostProfile");
  if (!fn) return MOCK_PROFILE;
  const result = await fn({});
  return result.data;
}

export async function saveHostProfile(draft: HostProfileDraft): Promise<OwnedHostProfile> {
  const fn = callable<HostProfileDraft, OwnedHostProfile>("saveHostProfile");
  if (!fn) return { ...MOCK_PROFILE, ...draft, publicPageSetupCompleted: true };
  const result = await fn(draft);
  return result.data;
}

export async function getPublicHostPage(slug: string): Promise<PublicHostPageData> {
  const fn = callable<{ slug: string }, PublicHostPageData>("getPublicHostPage");
  if (!fn) {
    if (slug !== MOCK_PROFILE.slug) throw new Error("Host page not found.");
    return {
      profile: (({ hostId: _hostId, ...publicFields }) => publicFields)(MOCK_PROFILE),
      upcomingTailgates: mockTailgates.filter(
        (event) =>
          event.hostUserId === MOCK_PROFILE.hostId &&
          event.visibilityType !== "private" &&
          event.startDateTime >= new Date() &&
          event.status !== "cancelled"
      ).map(({ hostUserId: _hostUserId, ...publicEvent }) => publicEvent)
    };
  }
  const result = await fn({ slug });
  return {
    ...result.data,
    upcomingTailgates: result.data.upcomingTailgates.map((event) => ({
      ...event,
      startDateTime: new Date(event.startDateTime),
      endDateTime: event.endDateTime ? new Date(event.endDateTime) : undefined
    }))
  };
}

export async function uploadHostPageImage(
  hostId: string,
  kind: "logo" | "cover",
  file: File
) {
  if (!storage) return URL.createObjectURL(file);
  const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const objectPath = kind === "logo"
    ? `profilePictures/${hostId}.${extension}`
    : `tailgateCovers/${hostId}/host-page-cover.${extension}`;
  const objectRef = ref(storage, objectPath);
  await uploadBytes(objectRef, file, { contentType: file.type });
  return getDownloadURL(objectRef);
}

export async function uploadHostGalleryImage(hostId: string, file: File) {
  if (!storage) return URL.createObjectURL(file);
  const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const uniquePart = typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const objectRef = ref(
    storage,
    `tailgateCovers/${hostId}/host-page-gallery/${uniquePart}.${extension}`
  );
  await uploadBytes(objectRef, file, { contentType: file.type });
  return getDownloadURL(objectRef);
}

export async function trackHostPageEvent(
  name:
    | "host_page_view"
    | "host_page_event_click"
    | "host_page_share"
    | "host_page_setup_started"
    | "host_page_setup_completed",
  params: Record<string, string | boolean | undefined>
) {
  trackCustomEvent(name, params);
}
