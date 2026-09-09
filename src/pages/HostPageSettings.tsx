import { type ChangeEvent, type FormEvent, useEffect, useMemo, useState } from "react";
import AppShell from "../components/AppShell";
import TopBar from "../components/TopBar";
import { useAuth } from "../hooks/useAuth";
import { useHostProfile } from "../hooks/useHostProfile";
import { useUserProfile } from "../hooks/useUserProfile";
import {
  getPublicHostPage,
  saveHostProfile,
  trackHostPageEvent,
  uploadHostGalleryImage,
  uploadHostPageImage
} from "../lib/hostProfile";
import { HostPageView } from "./PublicHostPage";
import type { PublicHostEvent, HostProfileDraft } from "../types/hostProfile";
import { getFirstName } from "../utils/format";
import { normalizeHostSlug, validateHostSlug } from "../utils/hostSlug";

const EMPTY_DRAFT: HostProfileDraft = {
  displayName: "",
  tagline: "",
  description: "",
  logoUrl: "",
  coverImageUrl: "",
  galleryImageUrls: [],
  location: "",
  slug: ""
};

export default function HostPageSettings() {
  const { user } = useAuth();
  const { profile: userProfile } = useUserProfile(user?.uid);
  const { profile, setProfile, loading, error, refresh } = useHostProfile(Boolean(user));
  const [draft, setDraft] = useState<HostProfileDraft>(EMPTY_DRAFT);
  const [view, setView] = useState<"edit" | "preview">("edit");
  const [previewSize, setPreviewSize] = useState<"desktop" | "mobile">("desktop");
  const [events, setEvents] = useState<PublicHostEvent[]>([]);
  const [eventsError, setEventsError] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<"logo" | "cover" | null>(null);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (!profile) return;
    setDraft({
      displayName: profile.displayName,
      tagline: profile.tagline || "",
      description: profile.description || "",
      logoUrl: profile.logoUrl || "",
      coverImageUrl: profile.coverImageUrl || "",
      galleryImageUrls: profile.galleryImageUrls || [],
      location: profile.location || "",
      slug: profile.slug
    });
  }, [profile]);

  useEffect(() => {
    void trackHostPageEvent("host_page_setup_started", { hostId: user?.uid });
  }, [user?.uid]);

  const origin = typeof window === "undefined" ? "https://tailgatetime.com" : window.location.origin;
  const publicUrl = `${origin}/hosts/${profile?.slug || "your-host-page"}`;
  const dirty = Boolean(profile && (Object.keys(EMPTY_DRAFT) as (keyof HostProfileDraft)[]).some(
    (key) => JSON.stringify(draft[key] || (key === "galleryImageUrls" ? [] : "")) !== JSON.stringify(profile[key] || (key === "galleryImageUrls" ? [] : ""))
  ));
  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = ""; };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);
  useEffect(() => {
    if (!profile?.slug) return;
    let active = true;
    getPublicHostPage(profile.slug).then((result) => {
      if (active) { setEvents(result.upcomingTailgates); setEventsError(false); }
    }).catch(() => { if (active) setEventsError(true); });
    return () => { active = false; };
  }, [profile?.slug]);
  const slugError = useMemo(() => (draft.slug ? validateHostSlug(draft.slug) : null), [draft.slug]);
  const firstName = getFirstName(userProfile?.displayName || user?.displayName || user?.email);

  const update = (field: keyof HostProfileDraft, value: string) => {
    setDraft((current) => ({ ...current, [field]: value }));
  };

  const handleImage = async (kind: "logo" | "cover", event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !profile) return;
    if (!file.type.startsWith("image/")) {
      setFormError("Choose a valid image file.");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setFormError("Images must be 8 MB or smaller.");
      return;
    }
    setUploading(kind);
    setFormError(null);
    try {
      const url = await uploadHostPageImage(profile.hostId, kind, file);
      update(kind === "logo" ? "logoUrl" : "coverImageUrl", url);
    } catch (reason) {
      setFormError(reason instanceof Error ? reason.message : "Image upload failed.");
    } finally {
      setUploading(null);
    }
  };

  const handleGalleryImages = async (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.currentTarget;
    const selectedFiles = Array.from(input.files || []);
    if (!profile || selectedFiles.length === 0) return;

    const remainingSlots = 8 - (draft.galleryImageUrls?.length || 0);
    if (remainingSlots <= 0) {
      setFormError("The gallery can include up to 8 images.");
      input.value = "";
      return;
    }
    const files = selectedFiles.slice(0, remainingSlots);
    const invalidFile = files.find((file) => !file.type.startsWith("image/"));
    const oversizedFile = files.find((file) => file.size > 8 * 1024 * 1024);
    if (invalidFile || oversizedFile) {
      setFormError(
        invalidFile ? "Choose valid image files." : "Each gallery image must be 8 MB or smaller."
      );
      input.value = "";
      return;
    }

    setUploadingGallery(true);
    setFormError(null);
    try {
      const urls = await Promise.all(
        files.map((file) => uploadHostGalleryImage(profile.hostId, file))
      );
      setDraft((current) => ({
        ...current,
        galleryImageUrls: [...(current.galleryImageUrls || []), ...urls].slice(0, 8)
      }));
      if (selectedFiles.length > remainingSlots) {
        setNotice(`Added ${remainingSlots} images. The gallery limit is 8.`);
      }
    } catch (reason) {
      setFormError(reason instanceof Error ? reason.message : "Gallery upload failed.");
    } finally {
      setUploadingGallery(false);
      input.value = "";
    }
  };

  const removeGalleryImage = (index: number) => {
    setDraft((current) => ({
      ...current,
      galleryImageUrls: (current.galleryImageUrls || []).filter((_, imageIndex) => imageIndex !== index)
    }));
  };

  const moveGalleryImage = (index: number, direction: -1 | 1) => {
    setDraft((current) => {
      const images = [...(current.galleryImageUrls || [])];
      const target = index + direction;
      if (target < 0 || target >= images.length) return current;
      [images[index], images[target]] = [images[target], images[index]];
      return { ...current, galleryImageUrls: images };
    });
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setNotice(null);
    setFormError(null);
    if (!draft.displayName.trim()) {
      setFormError("Public host name is required.");
      return;
    }
    if (slugError) {
      setFormError(slugError);
      return;
    }
    setSaving(true);
    try {
      const saved = await saveHostProfile({
        ...draft,
        displayName: draft.displayName.trim(),
        tagline: draft.tagline?.trim(),
        description: draft.description?.trim(),
        location: draft.location?.trim(),
        slug: normalizeHostSlug(draft.slug)
      });
      setProfile(saved);
      setNotice("Your Host Page is live and up to date.");
      void trackHostPageEvent("host_page_setup_completed", { hostId: saved.hostId });
    } catch (reason) {
      setFormError(reason instanceof Error ? reason.message : "Unable to save your Host Page.");
    } finally {
      setSaving(false);
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl);
      setNotice("Public link copied.");
    } catch {
      setFormError("Couldn’t copy the link. You can copy your public URL below.");
    }
  };

  return (
    <AppShell header={<TopBar firstName={firstName} />} showHeaderActions={false}>
      <div className="host-settings-page">
        <div className="host-settings-heading">
          <div>
            <p className="host-settings-kicker">Host profile</p>
            <h1>Your TailgateTime Host Page</h1>
            <p>Give fans one place to learn about your tailgates and see everything you’re hosting.</p>
          </div>
          <div className="host-settings-actions">
            <button type="button" className="outline-button" onClick={copyLink} disabled={!profile}>Copy Link</button>
            {profile ? <a className="primary-button" href={publicUrl} target="_blank" rel="noreferrer">View Public Page</a> : null}
          </div>
        </div>

        {loading ? <div className="host-settings-card" aria-busy="true">Preparing your Host Page…</div> : null}
        {error ? (
          <div className="host-settings-service-error" role="alert">
            <div>
              <h2>Host Page editor couldn’t load</h2>
              <p>{error}</p>
            </div>
            <button type="button" className="outline-button" onClick={() => void refresh()}>
              Retry
            </button>
          </div>
        ) : null}
        {!loading && profile ? (
          <form className="host-designer" onSubmit={submit}>
            <div className="host-designer-toolbar">
              <div className="host-designer-tabs" role="group" aria-label="Designer view">
                <button type="button" aria-pressed={view === "edit"} onClick={() => setView("edit")}>Edit page</button>
                <button type="button" aria-pressed={view === "preview"} onClick={() => setView("preview")}>Live preview</button>
              </div>
              <span>{dirty ? "Unsaved changes" : "Saved version"}</span>
              <button className="primary-button" type="submit" disabled={saving || Boolean(uploading) || uploadingGallery}>
                {saving ? "Saving…" : "Save Host Page"}
              </button>
            </div>
            {formError ? <div className="error-banner" role="alert">{formError}</div> : null}
            {notice ? <div className="host-settings-success" role="status">{notice}</div> : null}
            {view === "preview" ? (
              <section className="host-designer-preview" aria-label="Live page preview">
                <div className="host-designer-preview-heading">
                  <p>Your changes appear here before you save. Sharing and event links are disabled in preview.</p>
                  <div className="host-designer-tabs" role="group" aria-label="Preview size">
                    <button type="button" aria-pressed={previewSize === "desktop"} onClick={() => setPreviewSize("desktop")}>Desktop</button>
                    <button type="button" aria-pressed={previewSize === "mobile"} onClick={() => setPreviewSize("mobile")}>Mobile</button>
                  </div>
                </div>
                {eventsError ? <p role="status">Event preview is unavailable. Your public events are managed separately.</p> : null}
                <div className={`host-designer-preview-frame ${previewSize}`}>
                  <HostPageView preview data={{ profile: { ...profile, ...draft, displayName: draft.displayName || "Your host name" }, upcomingTailgates: events }} />
                </div>
              </section>
            ) : (
            <fieldset disabled={saving} className="host-settings-card">
            <nav className="host-designer-steps" aria-label="Page editor sections">
              <a href="#host-story">01 · Your story</a>
              <a href="#host-visuals">02 · Look & feel</a>
              <a href="#host-sharing">03 · Share & events</a>
            </nav>
            <div className="host-designer-section-intro" id="host-story">
              <p className="host-settings-kicker">01 / Make it personal</p>
              <h2>Let fans get to know you.</h2>
              <p>A memorable name, a quick introduction, and your story make guests feel welcome before they arrive.</p>
            </div>
            <div className="host-settings-grid">
              <label>
                Public host or organization name
                <input value={draft.displayName} maxLength={100} onChange={(e) => update("displayName", e.target.value)} required />
              </label>
              <label>
                Location / home market
                <input value={draft.location} maxLength={120} placeholder="Buffalo, NY" onChange={(e) => update("location", e.target.value)} />
              </label>
              <label className="host-settings-wide">
                Tagline
                <input value={draft.tagline} maxLength={140} placeholder="Game day starts with us." onChange={(e) => update("tagline", e.target.value)} />
              </label>
              <label className="host-settings-wide">
                About your tailgates
                <textarea value={draft.description} maxLength={3000} rows={9} placeholder="Tell fans about your group, traditions, food, and what to expect…" onChange={(e) => update("description", e.target.value)} />
                <small>Introduce yourself, share your traditions, and explain what a first-time guest can expect. Use short paragraphs.</small>
                <small>{draft.description?.length || 0} / 3000</small>
              </label>
            </div>

            <div className="host-designer-section-intro" id="host-visuals">
              <p className="host-settings-kicker">02 / Set the scene</p>
              <h2>Show what game day feels like.</h2>
              <p>Use a recognizable portrait or logo, a wide cover, and photos of real moments with your guests.</p>
            </div>
            <div className="host-settings-image-grid">
              <label className="host-settings-image-field">
                <span>Logo / profile image</span>
                {draft.logoUrl ? <img className="host-settings-logo-preview" src={draft.logoUrl} alt="Logo preview" /> : <div className="host-settings-image-placeholder">Logo</div>}
                <input type="file" accept="image/*" disabled={Boolean(uploading) || saving} onChange={(e) => void handleImage("logo", e)} />
                <small>{uploading === "logo" ? "Uploading…" : "Use a square image, at least 400 × 400. Up to 8 MB."}</small>
              </label>
              <label className="host-settings-image-field">
                <span>Cover image</span>
                {draft.coverImageUrl ? <img className="host-settings-cover-preview" src={draft.coverImageUrl} alt="Cover preview" /> : <div className="host-settings-image-placeholder cover">Cover</div>}
                <input type="file" accept="image/*" disabled={Boolean(uploading) || saving} onChange={(e) => void handleImage("cover", e)} />
                <small>{uploading === "cover" ? "Uploading…" : "Try a 1600 × 600 image. Keep the main subject near the center. Up to 8 MB."}</small>
              </label>
            </div>

            <section className="host-settings-gallery-editor" aria-labelledby="host-gallery-heading">
              <div className="host-settings-gallery-heading">
                <div>
                  <h2 id="host-gallery-heading">Image gallery</h2>
                  <p>Show fans the atmosphere, food, traditions, and people behind your tailgates.</p>
                </div>
                <span>{draft.galleryImageUrls?.length || 0} / 8</span>
              </div>

              {(draft.galleryImageUrls?.length || 0) > 0 ? (
                <div className="host-settings-gallery-grid">
                  {draft.galleryImageUrls?.map((url, index) => (
                    <article className="host-settings-gallery-item" key={`${url}-${index}`}>
                      <img src={url} alt={`Gallery image ${index + 1}`} />
                      <div className="host-settings-gallery-item-actions">
                        <button
                          type="button"
                          onClick={() => moveGalleryImage(index, -1)}
                          disabled={index === 0}
                          aria-label={`Move gallery image ${index + 1} earlier`}
                        >
                          ←
                        </button>
                        <button
                          type="button"
                          onClick={() => moveGalleryImage(index, 1)}
                          disabled={index === (draft.galleryImageUrls?.length || 0) - 1}
                          aria-label={`Move gallery image ${index + 1} later`}
                        >
                          →
                        </button>
                        <button
                          type="button"
                          className="remove"
                          onClick={() => removeGalleryImage(index)}
                          aria-label={`Remove gallery image ${index + 1}`}
                        >
                          Remove
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="host-settings-gallery-empty">No gallery images added yet.</div>
              )}

              <label className={`host-settings-gallery-upload${(draft.galleryImageUrls?.length || 0) >= 8 ? " disabled" : ""}`}>
                <span>{uploadingGallery ? "Uploading gallery…" : "Add gallery images"}</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  disabled={uploadingGallery || (draft.galleryImageUrls?.length || 0) >= 8}
                  onChange={(event) => void handleGalleryImages(event)}
                />
              </label>
              <small className="host-settings-gallery-help">Select multiple images at once. Each image can be up to 8 MB.</small>
            </section>

            <div className="host-designer-section-intro" id="host-sharing">
              <p className="host-settings-kicker">03 / One link for every game day</p>
              <h2>Your home for upcoming events.</h2>
              <p>Your upcoming public events appear automatically. Private and cancelled events stay off this page.</p>
              <a className="outline-button" href="/dashboard">Manage your events →</a>
            </div>
            <div className="host-settings-url">
              <span>Your saved public URL</span><strong>{publicUrl}</strong>
              <small>Share this link in your social bio, group chats, and event promotions.</small>
            </div>
            <div className="host-settings-grid">
              <label className="host-settings-wide">
                Public URL slug
                <div className="host-settings-slug-row">
                  <span>{origin}/hosts/</span>
                  <input
                    value={draft.slug}
                    maxLength={64}
                    onBlur={() => update("slug", normalizeHostSlug(draft.slug))}
                    onChange={(e) => update("slug", e.target.value.toLowerCase())}
                  />
                </div>
                {slugError ? <small className="host-settings-field-error">{slugError}</small> : null}
                {profile.slug !== normalizeHostSlug(draft.slug) ? (
                  <small>Your previous URL will redirect to the new address after saving.</small>
                ) : null}
              </label>
            </div>
            </fieldset>
            )}
          </form>
        ) : null}
      </div>
    </AppShell>
  );
}
