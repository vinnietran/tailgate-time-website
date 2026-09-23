# Event timezones

New events created in the web wizard store:

- `timeZone`: confirmed IANA identifier, e.g. `America/Chicago`.
- `timeZoneSource`: `location` for a Google lookup, or `manual` for an explicit host choice.
- `creatorTimeZone`: device timezone snapshot when the event is created. This is separate from the event timezone and is not a user profile preference.
- Existing `startDateTime`, `endDateTime`, `dateTime`, and `eventTargetTime` fields remain absolute Firestore timestamps. Schedule timestamps use the same event zone.

The wizard detects the venue zone from its resolved coordinates. A zone different from the current selection requires confirmation; this preserves the entered clock times and reinterprets them in the confirmed venue zone. Changing the location invalidates the previous confirmation. In-flight responses from an old location are ignored. Failed/unavailable lookups require explicit manual confirmation. Location confirmation revalidates the schedule in the final zone.

Conversions use `@js-temporal/polyfill` and reject nonexistent or ambiguous daylight-saving times with a visible validation error. Overnight ends advance by one calendar day in the event zone, not 24 elapsed hours. Durations and existing ticket-sale cutoff semantics remain elapsed-time calculations.

## Server configuration and release

Automatic lookup requires the new authenticated Firebase callable `resolveEventTimeZone` in `us-central1`.

1. Enable **Time Zone API** in the Google Cloud project associated with the server key (billing must be enabled).
2. Create a server API key restricted to Time Zone API. Browser/referrer-restricted keys should not be reused for this server request.
3. Store it in Firebase Secret Manager: `firebase functions:secrets:set GOOGLE_MAPS_TIME_ZONE_API_KEY --project <project-id>`.
4. Deploy the callable: `firebase deploy --only functions:resolveEventTimeZone --project <project-id>`.
5. Deploy the website together with the updated public-host-page functions (`getPublicHostPage` and `renderHostPage`) so those responses/rendered dates also carry the event timezone.
6. Verify a venue in a different timezone from the device. Confirm the zone, create a test event, and read back timestamps and timezone metadata.

The API key is never sent to the browser. The callable validates authentication and coordinate bounds, imposes a lookup timeout, and returns only a validated timezone ID. It uses Google's current timestamp to identify the geographical zone; returned offsets are intentionally ignored. Event-date DST rules are resolved from the zone ID during time conversion.

On 2026-09-09, `getPublicHostPage`, `renderHostPage`, and `resolveEventTimeZone` were deployed to `lot-legends`. Time Zone API was enabled and an API-restricted server key was stored as `GOOGLE_MAPS_TIME_ZONE_API_KEY` version 1. A live Dallas lookup returned `America/Chicago`. Hosting and other functions were not deployed; `tailgatetime-prod` and existing event timestamps were not changed. Other environments still need the configuration above.

## Existing events and other clients

Missing/invalid `timeZone` metadata preserves the existing device-time display; no legacy timestamp is rewritten or assigned a guessed zone. New-event timezone metadata is retained through dashboard/discover cards, details, edit controls, schedules, check-in, feed, promotion/success pages, and public host pages. Copying an event retains its timezone and captures the new creator's device timezone.

The existing details editor continues to use the saved event timezone when changing event times; editing a free-text location there does not re-geocode it or change its zone. Venue detection/confirmation is implemented in the creation wizard.

Any separate mobile app, notification service, or ticket-email producer must also read `timeZone`, render event-local times explicitly, and interpret edited local times using that zone. Those external clients are not part of this repository. Prefer the saved UTC timestamp for timers and delivery instants. Do not derive an event zone from a viewer's current device.

## Verification

- `node --test functions/test/event-time-zone.test.js`
- `npx playwright test tests/e2e/event-time-zone.spec.ts tests/e2e/create-wizard.spec.ts`
- `npm run typecheck`

Browser tests mock only the lookup boundary, never the date conversion, and verify cross-zone creation, manual fallback, and UTC timestamp results. Unit tests cover DST gaps/folds, winter/summer offsets, overnight transitions, invalid zones, and event-zone schedule round trips.

On 2026-09-09, both websites were released using their respective `lot-legends` and `tailgatetime-prod` build modes. The three timezone-related functions were also deployed to production and verified ACTIVE. Production has its own Time Zone API-restricted key in Secret Manager (version 1); a live Dallas lookup returned `America/Chicago`. Live hosting HTML matched each environment-specific build.

## Schedule countdown reference

`eventTargetTime` is independent of the tailgate start/end timestamps. The schedule's Countdown target time control writes only this field, and cards calculate the remaining time from each activity's end to this target, clamped to zero. Editing tailgate details preserves the target; setting a target preserves event details and activity timestamps. Activity entry defaults use the tailgate start, not the countdown target. Event listings and public host pages must not interpret `eventTargetTime` as the tailgate start. New events may initialize the target to the start as a default, after which it is independent.

The mobile `app/createtimeline.tsx` already writes only `eventTargetTime`. The web separation fix is local and awaits deployment; existing event dates were not repaired or rewritten.

The schedule countdown separation fix was deployed to both environments on 2026-09-09, using their matching build configurations. Only hosting, `getPublicHostPage`, and `renderHostPage` were deployed. Live HTML and active functions were verified, and the deployed production notification source still contains the temporary Event Updated pause.
