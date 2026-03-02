import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  Timestamp
} from "firebase/firestore";
import { getBlob, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useNavigate, useParams } from "react-router-dom";
import AppShell from "../components/AppShell";
import { useAuth } from "../hooks/useAuth";
import { useDialog } from "../hooks/useDialog";
import { db, storage } from "../lib/firebase";
import { formatDateTime } from "../utils/format";

const placeholderAvatar =
  "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y";

type EventFeedPost = {
  id: string;
  userId?: string;
  displayName?: string;
  text: string;
  imageUrls: string[];
  timestamp?: unknown;
};

type ComposerImage = {
  id: string;
  file: File;
  previewUrl: string;
};

type EventFeedGalleryState = {
  isOpen: boolean;
  imageUrls: string[];
  index: number;
};

function firstString(...values: unknown[]): string | undefined {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }
  return undefined;
}

function normalizeDate(value: unknown): Date | null {
  if (!value) return null;
  if (value instanceof Date) return value;
  if (typeof value === "string" || typeof value === "number") {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  const timestamp = value as { toDate?: () => Date; seconds?: number };
  if (typeof timestamp.toDate === "function") {
    try {
      const parsed = timestamp.toDate();
      return Number.isNaN(parsed.getTime()) ? null : parsed;
    } catch {
      return null;
    }
  }

  if (typeof timestamp.seconds === "number") {
    const parsed = new Date(timestamp.seconds * 1000);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  return null;
}

function normalizeImageUrls(data: Record<string, unknown>) {
  const urlsFromArray = Array.isArray(data.imageUrls)
    ? data.imageUrls.filter((value): value is string => typeof value === "string")
    : [];
  const primaryImage = firstString(data.imageUrl);
  if (primaryImage && !urlsFromArray.includes(primaryImage)) {
    return [primaryImage, ...urlsFromArray];
  }
  return urlsFromArray;
}

function formatAbsoluteTimestamp(timestamp: unknown) {
  const date = normalizeDate(timestamp);
  if (!date) return "Just now";
  return date.toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  });
}

function formatRelativeTimestamp(timestamp: unknown) {
  const date = normalizeDate(timestamp);
  if (!date) return "";
  const diffMs = date.getTime() - Date.now();
  const diffSeconds = Math.round(diffMs / 1000);
  const absSeconds = Math.abs(diffSeconds);

  if (absSeconds < 45) return "just now";
  if (absSeconds < 3600) {
    const minutes = Math.round(absSeconds / 60);
    return diffSeconds < 0 ? `${minutes}m ago` : `in ${minutes}m`;
  }
  if (absSeconds < 86400) {
    const hours = Math.round(absSeconds / 3600);
    return diffSeconds < 0 ? `${hours}h ago` : `in ${hours}h`;
  }
  const days = Math.round(absSeconds / 86400);
  return diffSeconds < 0 ? `${days}d ago` : `in ${days}d`;
}

function toEventFeedPost(id: string, data: Record<string, unknown>): EventFeedPost {
  return {
    id,
    userId: firstString(data.userId, data.uid),
    displayName: firstString(data.displayName),
    text: firstString(data.text, data.message) ?? "",
    imageUrls: normalizeImageUrls(data),
    timestamp: data.timestamp
  };
}

function isHttpUrl(value: string) {
  return /^https?:\/\//i.test(value);
}

function inferMimeTypeFromValue(value: string) {
  const lower = value.toLowerCase();
  if (lower.includes(".png")) return "image/png";
  if (lower.includes(".webp")) return "image/webp";
  if (lower.includes(".gif")) return "image/gif";
  if (lower.includes(".heic")) return "image/heic";
  return "image/jpeg";
}

function toInlineImageUrl(urlValue: string) {
  if (!isHttpUrl(urlValue)) return urlValue;

  try {
    const parsed = new URL(urlValue);
    const isFirebaseStorageHost =
      parsed.hostname === "firebasestorage.googleapis.com" ||
      parsed.hostname === "storage.googleapis.com";
    if (!isFirebaseStorageHost) return urlValue;

    if (!parsed.searchParams.has("alt")) {
      parsed.searchParams.set("alt", "media");
    }
    if (!parsed.searchParams.has("response-content-disposition")) {
      parsed.searchParams.set("response-content-disposition", "inline");
    }
    if (!parsed.searchParams.has("response-content-type")) {
      parsed.searchParams.set("response-content-type", inferMimeTypeFromValue(urlValue));
    }

    return parsed.toString();
  } catch {
    return urlValue;
  }
}

function extractStoragePathFromValue(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return null;

  if (!isHttpUrl(trimmed)) {
    return trimmed.replace(/^\/+/, "");
  }

  if (trimmed.startsWith("gs://")) {
    const withoutScheme = trimmed.slice("gs://".length);
    const firstSlash = withoutScheme.indexOf("/");
    if (firstSlash < 0) return null;
    return withoutScheme.slice(firstSlash + 1);
  }

  try {
    const parsed = new URL(trimmed);
    const oSegmentMatch = parsed.pathname.match(/\/o\/(.+)$/);
    if (oSegmentMatch?.[1]) {
      return decodeURIComponent(oSegmentMatch[1]);
    }

    if (parsed.hostname === "storage.googleapis.com") {
      const segments = parsed.pathname.split("/").filter(Boolean);
      if (segments.length >= 2) {
        return decodeURIComponent(segments.slice(1).join("/"));
      }
    }
  } catch {
    return null;
  }

  return null;
}

export default function EventFeed() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { confirm } = useDialog();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const activeComposerPreviewUrlsRef = useRef<string[]>([]);
  const attemptedImageResolutionRef = useRef<Set<string>>(new Set());
  const attemptedBlobImageFallbackRef = useRef<Set<string>>(new Set());
  const createdBlobImageUrlsRef = useRef<string[]>([]);

  const [eventName, setEventName] = useState("Tailgate");
  const [eventStartAt, setEventStartAt] = useState<Date | null>(null);
  const [posts, setPosts] = useState<EventFeedPost[]>([]);
  const [feedLoading, setFeedLoading] = useState(true);
  const [feedError, setFeedError] = useState<string | null>(null);
  const [composerText, setComposerText] = useState("");
  const [composerImages, setComposerImages] = useState<ComposerImage[]>([]);
  const [posting, setPosting] = useState(false);
  const [composerError, setComposerError] = useState<string | null>(null);
  const [deletingPostId, setDeletingPostId] = useState<string | null>(null);
  const [displayNamesByUserId, setDisplayNamesByUserId] = useState<Record<string, string>>({});
  const [profilePicturesByUserId, setProfilePicturesByUserId] = useState<Record<string, string>>(
    {}
  );
  const [imageLoadErrorsByKey, setImageLoadErrorsByKey] = useState<Record<string, string>>({});
  const [loadedPostImagesByKey, setLoadedPostImagesByKey] = useState<Record<string, true>>({});
  const [recoveringPostImagesByKey, setRecoveringPostImagesByKey] = useState<
    Record<string, true>
  >({});
  const [resolvedPostImageUrlsByRaw, setResolvedPostImageUrlsByRaw] = useState<
    Record<string, string>
  >({});
  const [blobImageUrlsByRaw, setBlobImageUrlsByRaw] = useState<Record<string, string>>({});
  const [galleryState, setGalleryState] = useState<EventFeedGalleryState>({
    isOpen: false,
    imageUrls: [],
    index: 0
  });

  const canPost =
    (composerText.trim().length > 0 || composerImages.length > 0) && !posting;
  const eventPath = id ? `/tailgates/${encodeURIComponent(id)}` : "/discover";
  const feedPath = id ? `/tailgates/${encodeURIComponent(id)}/feed` : "/discover";
  const composerAvatar = user?.uid
    ? profilePicturesByUserId[user.uid] ?? placeholderAvatar
    : placeholderAvatar;

  const avatarUserIds = useMemo(() => {
    const ids = new Set<string>();
    posts.forEach((post) => {
      if (post.userId) ids.add(post.userId);
    });
    if (user?.uid) ids.add(user.uid);
    return Array.from(ids);
  }, [posts, user?.uid]);

  const missingDisplayNameUserIds = useMemo(() => {
    const ids = new Set<string>();
    posts.forEach((post) => {
      if (!post.userId) return;
      if (post.displayName) return;
      if (displayNamesByUserId[post.userId]) return;
      ids.add(post.userId);
    });
    return Array.from(ids);
  }, [displayNamesByUserId, posts]);

  useEffect(() => {
    activeComposerPreviewUrlsRef.current = composerImages.map((image) => image.previewUrl);
  }, [composerImages]);

  useEffect(() => {
    return () => {
      activeComposerPreviewUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
      createdBlobImageUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  useEffect(() => {
    if (!id) {
      setFeedLoading(false);
      setFeedError("Missing tailgate id.");
      return;
    }
    if (!db) {
      setFeedLoading(false);
      setFeedError("Event feed is unavailable right now.");
      return;
    }

    setFeedLoading(true);
    setFeedError(null);

    const eventRef = doc(db, "tailgateEvents", id);
    const eventUnsubscribe = onSnapshot(
      eventRef,
      (snapshot) => {
        if (!snapshot.exists()) {
          setEventName("Tailgate");
          setEventStartAt(null);
          return;
        }

        const data = snapshot.data() as Record<string, unknown>;
        setEventName(firstString(data.eventName, data.name, data.title) ?? "Tailgate");
        setEventStartAt(
          normalizeDate(data.dateTime) ??
            normalizeDate(data.startDateTime) ??
            normalizeDate(data.startAt) ??
            null
        );
      },
      (eventError) => {
        console.error("Failed to load event metadata for feed", eventError);
      }
    );

    const postsQuery = query(
      collection(db, "eventPosts", id, "posts"),
      orderBy("timestamp", "desc")
    );
    const postsUnsubscribe = onSnapshot(
      postsQuery,
      (snapshot) => {
        const nextPosts = snapshot.docs.map((snapshotDoc) =>
          toEventFeedPost(snapshotDoc.id, snapshotDoc.data() as Record<string, unknown>)
        );
        setPosts(nextPosts);
        setFeedLoading(false);
      },
      (snapshotError) => {
        console.error("Failed to load event feed posts", snapshotError);
        setFeedError("Unable to load event feed right now.");
        setFeedLoading(false);
      }
    );

    return () => {
      eventUnsubscribe();
      postsUnsubscribe();
    };
  }, [id]);

  useEffect(() => {
    if (!db || missingDisplayNameUserIds.length === 0) return;
    let isCancelled = false;

    const fetchDisplayNames = async () => {
      const mappedEntries = await Promise.all(
        missingDisplayNameUserIds.map(async (userId) => {
          try {
            const userSnapshot = await getDoc(doc(db, "users", userId));
            if (!userSnapshot.exists()) return [userId, "Tailgater"] as const;
            const data = userSnapshot.data() as Record<string, unknown>;
            const nameFromFields = firstString(
              data.displayName,
              [firstString(data.firstName), firstString(data.lastName)]
                .filter(Boolean)
                .join(" "),
              data.name
            );
            return [userId, nameFromFields ?? "Tailgater"] as const;
          } catch {
            return [userId, "Tailgater"] as const;
          }
        })
      );

      if (isCancelled) return;
      const nextMap: Record<string, string> = {};
      mappedEntries.forEach(([userId, displayName]) => {
        nextMap[userId] = displayName;
      });
      setDisplayNamesByUserId((previous) => ({ ...previous, ...nextMap }));
    };

    void fetchDisplayNames();
    return () => {
      isCancelled = true;
    };
  }, [missingDisplayNameUserIds]);

  useEffect(() => {
    if (!storage || avatarUserIds.length === 0) return;
    const missingUserIds = avatarUserIds.filter((userId) => !profilePicturesByUserId[userId]);
    if (missingUserIds.length === 0) return;
    let isCancelled = false;

    const fetchAvatars = async () => {
      const mappedEntries = await Promise.all(
        missingUserIds.map(async (userId) => {
          try {
            const photoUrl = await getDownloadURL(ref(storage, `profilePictures/${userId}.jpg`));
            return [userId, photoUrl] as const;
          } catch {
            return [userId, placeholderAvatar] as const;
          }
        })
      );

      if (isCancelled) return;
      const nextMap: Record<string, string> = {};
      mappedEntries.forEach(([userId, photoUrl]) => {
        nextMap[userId] = photoUrl;
      });
      setProfilePicturesByUserId((previous) => ({ ...previous, ...nextMap }));
    };

    void fetchAvatars();
    return () => {
      isCancelled = true;
    };
  }, [avatarUserIds, profilePicturesByUserId]);

  useEffect(() => {
    if (!storage || posts.length === 0) return;
    let isCancelled = false;

    const rawImageUrls = Array.from(
      new Set(
        posts.flatMap((post) =>
          post.imageUrls
            .map((url) => url.trim())
            .filter((url) => url.length > 0)
        )
      )
    );

    const urlsToResolve = rawImageUrls.filter((rawUrl) => {
      if (resolvedPostImageUrlsByRaw[rawUrl]) return false;
      if (attemptedImageResolutionRef.current.has(rawUrl)) return false;
      if (!isHttpUrl(rawUrl)) return true;
      if (
        rawUrl.includes("firebasestorage.googleapis.com") ||
        rawUrl.includes("storage.googleapis.com")
      ) {
        return true;
      }
      return false;
    });

    if (urlsToResolve.length === 0) return;

    const resolveUrlFromStorage = async (rawUrl: string) => {
      const normalized = rawUrl.replace(/^\/+/, "");
      try {
        if (!isHttpUrl(normalized)) {
          return await getDownloadURL(ref(storage, normalized));
        }
        if (
          normalized.includes("firebasestorage.googleapis.com") ||
          normalized.includes("storage.googleapis.com")
        ) {
          return await getDownloadURL(ref(storage, normalized));
        }
        return normalized;
      } catch {
        return rawUrl;
      }
    };

    const resolveUrls = async () => {
      const mappedEntries = await Promise.all(
        urlsToResolve.map(async (rawUrl) => {
          attemptedImageResolutionRef.current.add(rawUrl);
          const resolvedUrl = await resolveUrlFromStorage(rawUrl);
          return [rawUrl, resolvedUrl] as const;
        })
      );

      if (isCancelled) return;
      const nextMap: Record<string, string> = {};
      mappedEntries.forEach(([rawUrl, resolvedUrl]) => {
        if (resolvedUrl && resolvedUrl !== rawUrl) {
          nextMap[rawUrl] = resolvedUrl;
        }
      });
      if (Object.keys(nextMap).length > 0) {
        setResolvedPostImageUrlsByRaw((previous) => ({ ...previous, ...nextMap }));
      }
    };

    void resolveUrls();

    return () => {
      isCancelled = true;
    };
  }, [posts, resolvedPostImageUrlsByRaw]);

  const clearComposerImages = () => {
    setComposerImages((previous) => {
      previous.forEach((image) => URL.revokeObjectURL(image.previewUrl));
      return [];
    });
  };

  const removeComposerImage = (imageId: string) => {
    setComposerImages((previous) => {
      const imageToRemove = previous.find((image) => image.id === imageId);
      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.previewUrl);
      }
      return previous.filter((image) => image.id !== imageId);
    });
  };

  const handleFileSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;
    if (!fileList?.length) {
      event.target.value = "";
      return;
    }

    const selectedImages = Array.from(fileList)
      .filter((file) => file.type.startsWith("image/"))
      .map((file, index) => ({
        id: `${Date.now()}-${index}-${Math.random().toString(36).slice(2, 8)}`,
        file,
        previewUrl: URL.createObjectURL(file)
      }));

    if (selectedImages.length === 0) {
      setComposerError("Please choose image files.");
      event.target.value = "";
      return;
    }

    setComposerError(null);
    setComposerImages((previous) => [...previous, ...selectedImages]);
    event.target.value = "";
  };

  const handlePost = async () => {
    if (!id) return;
    if (!canPost) return;
    if (!db || !storage) {
      setComposerError("Event feed is unavailable right now.");
      return;
    }
    if (!user?.uid) {
      navigate(`/login?mode=login&redirect=${encodeURIComponent(feedPath)}`);
      return;
    }

    setPosting(true);
    setComposerError(null);

    try {
      const uploadedImageUrls: string[] = [];
      for (const [index, composerImage] of composerImages.entries()) {
        const extension = composerImage.file.type.split("/")[1] || "jpg";
        const filename = `eventImages/${id}/${Date.now()}-${index}-${Math.random()
          .toString(36)
          .slice(2, 10)}.${extension}`;
        const fileRef = ref(storage, filename);
        await uploadBytes(fileRef, composerImage.file);
        const imageUrl = await getDownloadURL(fileRef);
        uploadedImageUrls.push(imageUrl);
      }

      let displayName =
        firstString(user.displayName, displayNamesByUserId[user.uid]) ?? "";
      if (!displayName) {
        try {
          const userSnapshot = await getDoc(doc(db, "users", user.uid));
          if (userSnapshot.exists()) {
            const userData = userSnapshot.data() as Record<string, unknown>;
            displayName =
              firstString(
                userData.displayName,
                [firstString(userData.firstName), firstString(userData.lastName)]
                  .filter(Boolean)
                  .join(" "),
                userData.name
              ) ?? "";
          }
        } catch {
          displayName = "";
        }
      }

      await addDoc(collection(db, "eventPosts", id, "posts"), {
        userId: user.uid,
        displayName: displayName || "Tailgater",
        text: composerText.trim(),
        imageUrls: uploadedImageUrls,
        imageUrl: uploadedImageUrls[0] ?? null,
        timestamp: Timestamp.now()
      });

      setComposerText("");
      clearComposerImages();
    } catch (postError) {
      console.error("Failed to post event feed update", postError);
      setComposerError("Unable to share update. Please try again.");
    } finally {
      setPosting(false);
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!id || !db) return;
    const confirmed = await confirm({
      title: "Delete this post?",
      message: "This post will be permanently removed from the event feed.",
      confirmLabel: "Delete",
      cancelLabel: "Keep post",
      tone: "danger"
    });
    if (!confirmed) return;

    setDeletingPostId(postId);
    try {
      await deleteDoc(doc(db, "eventPosts", id, "posts", postId));
    } catch (deleteError) {
      console.error("Failed to delete event feed post", deleteError);
      setFeedError("Unable to delete this post right now.");
    } finally {
      setDeletingPostId(null);
    }
  };

  const openGallery = (imageUrls: string[], index: number) => {
    if (imageUrls.length === 0) return;
    setGalleryState({
      isOpen: true,
      imageUrls,
      index: Math.max(0, Math.min(index, imageUrls.length - 1))
    });
  };

  const closeGallery = () => {
    setGalleryState((previous) => ({ ...previous, isOpen: false }));
  };

  const goToPreviousGalleryImage = () => {
    setGalleryState((previous) => ({
      ...previous,
      index:
        previous.index <= 0
          ? previous.imageUrls.length - 1
          : previous.index - 1
    }));
  };

  const goToNextGalleryImage = () => {
    setGalleryState((previous) => ({
      ...previous,
      index:
        previous.index >= previous.imageUrls.length - 1
          ? 0
          : previous.index + 1
    }));
  };

  const downloadGalleryImage = () => {
    const imageUrl = galleryState.imageUrls[galleryState.index];
    if (!imageUrl) return;
    const link = document.createElement("a");
    link.href = imageUrl;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.download = `event-feed-image-${galleryState.index + 1}.jpg`;
    link.click();
  };

  const getDisplayImageUrl = (rawUrl: string) => {
    const normalized = rawUrl.trim();
    const resolved =
      blobImageUrlsByRaw[rawUrl] ??
      blobImageUrlsByRaw[normalized] ??
      resolvedPostImageUrlsByRaw[rawUrl] ??
      resolvedPostImageUrlsByRaw[normalized] ??
      normalized;
    return toInlineImageUrl(resolved);
  };

  const canBrowserDecodeBlob = async (blob: Blob) =>
    await new Promise<boolean>((resolve) => {
      const objectUrl = URL.createObjectURL(blob);
      const image = new Image();
      image.onload = () => {
        URL.revokeObjectURL(objectUrl);
        resolve(true);
      };
      image.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        resolve(false);
      };
      image.src = objectUrl;
    });

  const blobLooksLikeHeif = async (blob: Blob) => {
    try {
      const buffer = await blob.slice(0, 128).arrayBuffer();
      const bytes = new Uint8Array(buffer);
      if (bytes.length < 12) return false;

      const toAscii = (start: number, length: number) =>
        Array.from(bytes.slice(start, start + length))
          .map((byte) => String.fromCharCode(byte))
          .join("");

      const fileTypeBox = toAscii(4, 4).toLowerCase();
      if (fileTypeBox !== "ftyp") return false;

      const header = toAscii(8, Math.max(0, bytes.length - 8)).toLowerCase();
      return /(heic|heix|hevc|heim|heis|mif1|msf1)/.test(header);
    } catch {
      return false;
    }
  };

  const convertHeifBlobWithHeicTo = async (blob: Blob) => {
    try {
      const converterModule = await import("heic-to");
      const convertHeic = converterModule.heicTo as (args: {
        blob: Blob;
        type: string;
        quality?: number;
      }) => Promise<Blob>;
      const convertedBlob = await convertHeic({
        blob,
        type: "image/jpeg",
        quality: 0.92
      });
      if (!(convertedBlob instanceof Blob)) return null;
      const convertedDecodable = await canBrowserDecodeBlob(convertedBlob);
      return convertedDecodable ? convertedBlob : null;
    } catch {
      return null;
    }
  };

  const convertHeifBlobWithHeic2Any = async (blob: Blob) => {
    try {
      const converterModule = await import("heic2any");
      const convertHeicToAny = converterModule.default as (
        options: Record<string, unknown>
      ) => Promise<Blob | Blob[]>;
      const converted = await convertHeicToAny({
        blob,
        toType: "image/jpeg",
        quality: 0.92
      });
      const convertedBlob = Array.isArray(converted) ? converted[0] : converted;
      if (!(convertedBlob instanceof Blob)) return null;
      const convertedDecodable = await canBrowserDecodeBlob(convertedBlob);
      return convertedDecodable ? convertedBlob : null;
    } catch {
      return null;
    }
  };

  const convertBlobToJpegIfNeeded = async (blob: Blob) => {
    const alreadyDecodable = await canBrowserDecodeBlob(blob);
    if (alreadyDecodable) return blob;
    const looksLikeHeif = await blobLooksLikeHeif(blob);
    if (!looksLikeHeif) return null;

    const convertedWithHeicTo = await convertHeifBlobWithHeicTo(blob);
    if (convertedWithHeicTo) return convertedWithHeicTo;

    return await convertHeifBlobWithHeic2Any(blob);
  };

  const createBlobImageFallback = async (rawUrl: string) => {
    const candidate = getDisplayImageUrl(rawUrl);
    const normalizedCandidate = candidate.trim();
    if (!normalizedCandidate) return false;
    if (normalizedCandidate.startsWith("blob:") || normalizedCandidate.startsWith("data:")) return false;
    if (attemptedBlobImageFallbackRef.current.has(normalizedCandidate)) return false;
    attemptedBlobImageFallbackRef.current.add(normalizedCandidate);

    try {
      const candidateStoragePath =
        extractStoragePathFromValue(rawUrl) ?? extractStoragePathFromValue(normalizedCandidate);
      let blob: Blob | null = null;

      if (candidateStoragePath) {
        try {
          blob = await getBlob(ref(storage, candidateStoragePath));
        } catch {
          blob = null;
        }
      }

      if (!blob) {
        const response = await fetch(normalizedCandidate);
        if (!response.ok) return false;
        blob = await response.blob();
      }

      if (blob.size <= 0) return false;
      if (blob.type.startsWith("text/") || blob.type.includes("json") || blob.type.includes("xml")) {
        return false;
      }

      const typedBlob =
        blob.type && blob.type.startsWith("image/")
          ? blob
          : new Blob([blob], { type: inferMimeTypeFromValue(normalizedCandidate) });
      const renderableBlob = await convertBlobToJpegIfNeeded(typedBlob);
      if (!(renderableBlob instanceof Blob)) return false;
      const blobUrl = URL.createObjectURL(renderableBlob);
      createdBlobImageUrlsRef.current.push(blobUrl);

      const normalizedRaw = rawUrl.trim();
      setBlobImageUrlsByRaw((previous) => ({
        ...previous,
        [rawUrl]: blobUrl,
        [normalizedRaw]: blobUrl,
        [normalizedCandidate]: blobUrl
      }));
      return true;
    } catch {
      // Keep existing source when blob fallback cannot be created.
      return false;
    }
  };

  const handlePostImageError = async (rawUrl: string) => {
    if (!storage) return false;
    const normalized = rawUrl.trim().replace(/^\/+/, "");
    if (!normalized) return false;
    if (resolvedPostImageUrlsByRaw[rawUrl] || resolvedPostImageUrlsByRaw[normalized]) {
      return await createBlobImageFallback(rawUrl);
    }

    let resolvedStorageUrl = false;
    try {
      const resolvedUrl = await getDownloadURL(ref(storage, normalized));
      setResolvedPostImageUrlsByRaw((previous) => ({
        ...previous,
        [rawUrl]: resolvedUrl,
        [normalized]: resolvedUrl
      }));
      resolvedStorageUrl = true;
    } catch {
      // Keep the existing src if we cannot resolve a storage-backed url.
    }

    const createdBlobFallback = await createBlobImageFallback(rawUrl);
    return resolvedStorageUrl || createdBlobFallback;
  };

  return (
    <AppShell header={<div className="simple-header"><h1>Event Feed</h1></div>}>
      <section className="event-feed-page">
        <article className="tailgate-details-card event-feed-intro-card">
          <div className="section-header">
            <div>
              <h2>{eventName}</h2>
              <p className="section-subtitle">
                Share live updates, photos, and game-day wins together.
              </p>
            </div>
            <button
              type="button"
              className="secondary-button"
              onClick={() => navigate(eventPath)}
            >
              Back to details
            </button>
          </div>
          {eventStartAt ? (
            <p className="meta-muted">Starts {formatDateTime(eventStartAt)}</p>
          ) : null}
        </article>

        <article className="tailgate-details-card event-feed-composer-card">
          {user ? (
            <>
              <div className="event-feed-composer-row">
                <img
                  src={composerAvatar}
                  alt="Your profile"
                  className="event-feed-composer-avatar"
                />
                <textarea
                  className="text-input event-feed-composer-input"
                  placeholder="Share an update..."
                  value={composerText}
                  onChange={(event) => {
                    setComposerText(event.target.value);
                    if (composerError) setComposerError(null);
                  }}
                  rows={3}
                />
              </div>

              {composerImages.length > 0 ? (
                <div className="event-feed-composer-media">
                  <p className="event-feed-composer-media-label">Selected media</p>
                  <div className="event-feed-composer-media-grid">
                    {composerImages.map((image) => (
                      <div key={image.id} className="event-feed-composer-media-item">
                        <img src={image.previewUrl} alt="Selected upload" />
                        <button
                          type="button"
                          className="event-feed-composer-media-remove"
                          onClick={() => removeComposerImage(image.id)}
                          aria-label="Remove image"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              <div className="event-feed-composer-actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Add photos
                </button>
                <button
                  type="button"
                  className="primary-button"
                  disabled={!canPost}
                  onClick={() => void handlePost()}
                >
                  {posting ? "Posting..." : "Post"}
                </button>
              </div>
              <input
                ref={fileInputRef}
                className="event-feed-file-input"
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileSelection}
              />
              {composerError ? (
                <p className="tailgate-details-ticket-error">{composerError}</p>
              ) : null}
            </>
          ) : (
            <div className="event-feed-signin-note">
              <p className="meta-muted">
                Sign in to post updates and photos to this event feed.
              </p>
              <button
                type="button"
                className="primary-button"
                onClick={() =>
                  navigate(`/login?mode=login&redirect=${encodeURIComponent(feedPath)}`)
                }
              >
                Sign in
              </button>
            </div>
          )}
        </article>

        {feedError ? <p className="error-banner">{feedError}</p> : null}

        <section className="event-feed-post-list">
          {feedLoading ? (
            <article className="tailgate-details-card">
              <p className="meta-muted">Loading feed...</p>
            </article>
          ) : posts.length > 0 ? (
            posts.map((post) => {
              const authorName =
                firstString(
                  post.displayName,
                  post.userId ? displayNamesByUserId[post.userId] : undefined
                ) ?? "Tailgater";
              const avatarUrl = post.userId
                ? profilePicturesByUserId[post.userId] ?? placeholderAvatar
                : placeholderAvatar;
              const isCurrentUserPost = Boolean(user?.uid && post.userId === user.uid);
              const timestampLabel = formatAbsoluteTimestamp(post.timestamp);
              const relativeLabel = formatRelativeTimestamp(post.timestamp);

              return (
                <article key={post.id} className="tailgate-details-card event-feed-post-card">
                  <div className="event-feed-post-header">
                    <img
                      src={avatarUrl}
                      alt={`${authorName} avatar`}
                      className="event-feed-post-avatar"
                    />
                    <div className="event-feed-post-meta">
                      <p className="event-feed-post-author">{authorName}</p>
                      <p className="event-feed-post-time">{timestampLabel}</p>
                    </div>
                    {isCurrentUserPost ? (
                      <button
                        type="button"
                        className="link-button"
                        onClick={() => void handleDeletePost(post.id)}
                        disabled={deletingPostId === post.id}
                      >
                        {deletingPostId === post.id ? "Deleting..." : "Delete"}
                      </button>
                    ) : null}
                  </div>

                  {post.text ? <p className="event-feed-post-text">{post.text}</p> : null}

                  {post.imageUrls.length > 0 ? (
                    <div
                      className={`event-feed-post-images${
                        post.imageUrls.length === 1 ? " single" : ""
                      }`}
                    >
                      {post.imageUrls.map((imageUrl, index) => {
                        const imageKey = `${post.id}-${index}`;
                        const renderedUrl = getDisplayImageUrl(imageUrl);
                        const loadingStateKey = `${imageKey}:${renderedUrl}`;
                        const hasLoadError = Boolean(imageLoadErrorsByKey[imageKey]);
                        const isRecovering = Boolean(recoveringPostImagesByKey[imageKey]);
                        const isLoaded = Boolean(loadedPostImagesByKey[loadingStateKey]);
                        const showImageLoading = !isLoaded && (!hasLoadError || isRecovering);

                        return (
                          <button
                            key={`${post.id}-${imageUrl}-${index}`}
                            type="button"
                            className="event-feed-post-image-button"
                            onClick={() =>
                              openGallery(post.imageUrls.map((url) => getDisplayImageUrl(url)), index)
                            }
                          >
                            {showImageLoading ? (
                              <span className="event-feed-post-image-loading" aria-hidden="true">
                                <span className="event-feed-post-image-spinner" />
                              </span>
                            ) : null}
                            {hasLoadError && !isRecovering ? (
                              <span className="event-feed-post-image-fallback">
                                Image unavailable.{" "}
                                <a
                                  href={imageLoadErrorsByKey[imageKey]}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={(event) => event.stopPropagation()}
                                >
                                  Open image
                                </a>
                              </span>
                            ) : null}
                            <img
                              className={`event-feed-post-image${
                                showImageLoading ? " is-loading" : ""
                              }`}
                              src={renderedUrl}
                              alt={`Post image ${index + 1}`}
                              loading="lazy"
                              onLoad={() => {
                                setRecoveringPostImagesByKey((previous) => {
                                  if (!previous[imageKey]) return previous;
                                  const next = { ...previous };
                                  delete next[imageKey];
                                  return next;
                                });
                                setLoadedPostImagesByKey((previous) => {
                                  if (previous[loadingStateKey]) return previous;
                                  return { ...previous, [loadingStateKey]: true };
                                });
                                setImageLoadErrorsByKey((previous) => {
                                  if (!previous[imageKey]) return previous;
                                  const next = { ...previous };
                                  delete next[imageKey];
                                  return next;
                                });
                              }}
                              onError={() => {
                                setRecoveringPostImagesByKey((previous) => ({
                                  ...previous,
                                  [imageKey]: true
                                }));
                                void (async () => {
                                  const recovered = await handlePostImageError(imageUrl);
                                  setRecoveringPostImagesByKey((previous) => {
                                    if (!previous[imageKey]) return previous;
                                    const next = { ...previous };
                                    delete next[imageKey];
                                    return next;
                                  });
                                  if (recovered) {
                                    setImageLoadErrorsByKey((previous) => {
                                      if (!previous[imageKey]) return previous;
                                      const next = { ...previous };
                                      delete next[imageKey];
                                      return next;
                                    });
                                    return;
                                  }
                                  setImageLoadErrorsByKey((previous) => ({
                                    ...previous,
                                    [imageKey]: renderedUrl
                                  }));
                                })();
                              }}
                            />
                          </button>
                        );
                      })}
                    </div>
                  ) : null}

                  {relativeLabel ? (
                    <p className="event-feed-post-relative">{relativeLabel}</p>
                  ) : null}
                </article>
              );
            })
          ) : (
            <article className="tailgate-details-card event-feed-empty-state">
              <p className="event-feed-empty-state-title">No updates yet</p>
              <p className="meta-muted">
                Be the first to share how tailgate prep is going.
              </p>
            </article>
          )}
        </section>
      </section>

      {galleryState.isOpen && galleryState.imageUrls.length > 0 ? (
        <div className="event-feed-gallery-overlay" role="dialog" aria-modal="true">
          <button
            type="button"
            className="event-feed-gallery-backdrop"
            aria-label="Close image viewer"
            onClick={closeGallery}
          />
          <div className="event-feed-gallery-panel">
            <div className="event-feed-gallery-toolbar">
              <p>
                {galleryState.index + 1} / {galleryState.imageUrls.length}
              </p>
              <div className="event-feed-gallery-toolbar-actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={downloadGalleryImage}
                >
                  Download
                </button>
                <button
                  type="button"
                  className="secondary-button"
                  onClick={closeGallery}
                >
                  Close
                </button>
              </div>
            </div>
            <div className="event-feed-gallery-content">
              {galleryState.imageUrls.length > 1 ? (
                <button
                  type="button"
                  className="event-feed-gallery-nav"
                  onClick={goToPreviousGalleryImage}
                  aria-label="Previous image"
                >
                  ‹
                </button>
              ) : null}
              <img
                src={galleryState.imageUrls[galleryState.index]}
                alt={`Event media ${galleryState.index + 1}`}
                className="event-feed-gallery-image"
              />
              {galleryState.imageUrls.length > 1 ? (
                <button
                  type="button"
                  className="event-feed-gallery-nav"
                  onClick={goToNextGalleryImage}
                  aria-label="Next image"
                >
                  ›
                </button>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </AppShell>
  );
}
