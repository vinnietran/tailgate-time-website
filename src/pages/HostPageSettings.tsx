import { type ChangeEvent, type FormEvent, useEffect, useMemo, useState } from "react";
import AppShell from "../components/AppShell";
import TopBar from "../components/TopBar";
import { useAuth } from "../hooks/useAuth";
import { useHostProfile } from "../hooks/useHostProfile";
import { useUserProfile } from "../hooks/useUserProfile";
import {
  saveHostProfile,
  trackHostPageEvent,
  uploadHostGalleryImage,
  uploadHostPageImage
} from "../lib/hostProfile";
import type { HostProfileDraft } from "../types/hostProfile";
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
  const publicUrl = `${origin}/hosts/${draft.slug || "your-host-page"}`;
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
    await navigator.clipboard.writeText(publicUrl);
    setNotice("Public link copied.");
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
            <a className="primary-button" href={publicUrl} target="_blank" rel="noreferrer">View Public Page</a>
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
          <form className="host-settings-card" onSubmit={submit}>
            <div className="host-settings-url">
              <span>Your public URL</span>
              <strong>{publicUrl}</strong>
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
                <small>{draft.description?.length || 0} / 3000</small>
              </label>
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
                  <small>Changing this URL may break links you have shared previously.</small>
                ) : null}
              </label>
            </div>

            <div className="host-settings-image-grid">
              <label className="host-settings-image-field">
                <span>Logo / profile image</span>
                {draft.logoUrl ? <img className="host-settings-logo-preview" src={draft.logoUrl} alt="Logo preview" /> : <div className="host-settings-image-placeholder">Logo</div>}
                <input type="file" accept="image/*" onChange={(e) => void handleImage("logo", e)} />
                <small>{uploading === "logo" ? "Uploading…" : "Square images work best."}</small>
              </label>
              <label className="host-settings-image-field">
                <span>Cover image</span>
                {draft.coverImageUrl ? <img className="host-settings-cover-preview" src={draft.coverImageUrl} alt="Cover preview" /> : <div className="host-settings-image-placeholder cover">Cover</div>}
                <input type="file" accept="image/*" onChange={(e) => void handleImage("cover", e)} />
                <small>{uploading === "cover" ? "Uploading…" : "Wide images work best."}</small>
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

            {formError ? <div className="error-banner">{formError}</div> : null}
            {notice ? <div className="host-settings-success">{notice}</div> : null}
            <div className="host-settings-save-row">
              <button className="primary-button" type="submit" disabled={saving || Boolean(uploading) || uploadingGallery}>
                {saving ? "Saving…" : "Save Host Page"}
              </button>
            </div>
          </form>
        ) : null}
      </div>
    </AppShell>
  );
}
