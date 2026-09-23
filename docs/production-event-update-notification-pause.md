# Temporary production Event Updated notification pause

Requested on 2026-09-09. Target: `tailgatetime-prod`, `us-central1`, `sendUpdateNotificationsOnEventChange`.

The deployed source was downloaded and modified only to return before the generic event-details notification block when `GCLOUD_PROJECT === "tailgatetime-prod"`. RSVP, schedule, and pin notifications earlier in the handler remain intact. Other functions and lot-legends were not changed.

The source-only Cloud Functions update preserves the existing runtime, trigger, environment, and service settings. No test event writes or notifications were sent.

## Restore

The original deployed source is `gs://gcf-v2-sources-483414039896-us-central1/sendUpdateNotificationsOnEventChange/function-source.zip`, generation `1768421727494344`. Its configuration snapshot is locally backed up at `/tmp/event-update-function-backup.json`, and its source archive at `/tmp/event-update-deployed-source.zip`.

To resume, restore that exact original build source with a `buildConfig.source`-only update, or remove the temporary production guard in a subsequent deployment. This pause was applied to the deployed source; redeploying the unchanged mobile repository handler will also resume these notifications. Do not redeploy it while the pause is required.
