import type { TailgateEvent } from "../types";

export type PublicHostProfile = {
  enabled: boolean;
  slug: string;
  displayName: string;
  tagline?: string;
  description?: string;
  logoUrl?: string;
  coverImageUrl?: string;
  galleryImageUrls?: string[];
  location?: string;
  publicPageSetupCompleted: boolean;
};

export type OwnedHostProfile = PublicHostProfile & { hostId: string };

export type PublicHostEvent = Omit<TailgateEvent, "hostUserId">;

export type PublicHostPageData = {
  profile: PublicHostProfile;
  upcomingTailgates: PublicHostEvent[];
};

export type HostProfileDraft = Pick<
  PublicHostProfile,
  "displayName" | "tagline" | "description" | "logoUrl" | "coverImageUrl" | "galleryImageUrls" | "location" | "slug"
>;
