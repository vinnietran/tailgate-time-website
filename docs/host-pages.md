# Public Host Pages

## Data model

Public profiles live in `hostProfiles/{hostUserId}`. Only the following fields are returned publicly: `enabled`, `slug`, `displayName`, `tagline`, `description`, `logoUrl`, `coverImageUrl`, `galleryImageUrls` (up to eight HTTPS images), `location`, and `publicPageSetupCompleted`.

Slug ownership and redirects live in `hostSlugClaims/{slug}`. A claim contains the owning host ID and the current canonical slug. When a host changes their slug, the old claim remains as an alias and the server-rendered route returns a permanent redirect.

Profile writes and slug reservations are performed only by authenticated callable functions. The functions derive the target profile from the caller UID and verify that the caller already has a Host Page, an explicit host role, or owns a tailgate. The public callable strips host UIDs and event ownership IDs from its response.

## New hosts

`initializeHostProfileOnFirstEvent` creates the base profile and globally unique slug when a host creates their first event. The transaction creates the profile and slug claim atomically. It never changes a slug later when the host display name changes.

## Existing-host backfill

Install the function dependencies, authenticate Application Default Credentials for the intended Firebase project, and run:

```sh
cd functions
npm install
GOOGLE_CLOUD_PROJECT=tailgatetime-prod npm run backfill:host-pages
```

The script scans authoritative ownership fields on `tailgateEvents`, creates only missing profiles, and reserves duplicate-name suffixes transactionally. It is idempotent and logs every created, existing, and failed host. Run it separately for each Firebase project that should expose Host Pages.

## Deployment

Deploy the functions before hosting so the `/hosts/**` and `/sitemap-hosts.xml` rewrites have live targets:

```sh
firebase deploy --project tailgatetime-prod --only functions
npm run build:prod
firebase deploy --project tailgatetime-prod --only hosting
```

Repeat with the appropriate project and build mode for other environments. No Firestore public-read rule or composite index is required: public reads and all writes pass through the functions, while server rendering uses the Admin SDK. Existing Storage rules must continue to allow authenticated hosts to upload under `profilePictures/{uid}.*` and `tailgateCovers/{uid}/**`, the same storage families used by existing profile and event images.

## SEO and caching

Firebase Hosting sends clean `/hosts/{slug}` requests to `renderHostPage`. It returns host-specific title, description, canonical, Open Graph, Twitter, and Organization JSON-LD markup with indexable HTML. `/sitemap-hosts.xml` lists enabled profiles, and `robots.txt` advertises it. Browser navigation uses the React version of the page; legacy hash URLs are upgraded to clean routes on load.

## Intentionally deferred

- Follow/notification behavior is not added; the public template leaves room beside the share action.
- Past tailgates are omitted from the initial page so upcoming events remain the focus.
