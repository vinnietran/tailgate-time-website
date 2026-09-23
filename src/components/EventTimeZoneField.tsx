import { useState } from "react";
import type { useEventTimeZone } from "../hooks/useEventTimeZone";
import { timeZoneLabel } from "../utils/eventTimeZone";

type Props = { zone: ReturnType<typeof useEventTimeZone>; canConfirm?: boolean };
const supportedZones = (Intl as typeof Intl & { supportedValuesOf?: (key: string) => string[] }).supportedValuesOf?.("timeZone") || [
  "America/New_York", "America/Chicago", "America/Denver", "America/Phoenix", "America/Los_Angeles", "America/Anchorage", "Pacific/Honolulu", "UTC"
];

export default function EventTimeZoneField({ zone, canConfirm = false }: Props) {
  const [editing, setEditing] = useState(false);
  const [manualZone, setManualZone] = useState(zone.timeZone);
  const options = [...new Set([zone.timeZone, "UTC", ...supportedZones])].sort();
  return (
    <div className="create-wizard-time-zone">
      <p><strong>Event timezone</strong><br />{timeZoneLabel(zone.timeZone)} <span>({zone.timeZone})</span></p>
      {!canConfirm ? <p className="meta-muted">{zone.confirmed ? "These times use your confirmed event timezone." : "Your device timezone is the starting point. We’ll check the venue’s timezone when you choose a location."}</p> : null}
      <div aria-live="polite">
        {zone.loading ? <p>Finding the timezone for this location…</p> : null}
        {canConfirm && zone.suggested ? <div>
          <p>This location uses <strong>{timeZoneLabel(zone.suggested)}</strong> ({zone.suggested}). Confirm to interpret the times you entered in this timezone. The clock times you entered will stay the same.</p>
          <button type="button" className="primary-button" onClick={() => zone.confirm(zone.suggested!, "location")}>Use location timezone</button>
        </div> : null}
        {canConfirm && zone.failed ? <p>We couldn’t detect the timezone. Choose and confirm it below to continue.</p> : null}
        {canConfirm && zone.confirmed ? <p>Confirmed. All event and timeline times use {timeZoneLabel(zone.timeZone)}.</p> : null}
      </div>
      {canConfirm && !zone.loading ? <>
        <button type="button" className="link-button" onClick={() => { setManualZone(zone.timeZone); setEditing(!editing); }}>
          {editing ? "Close timezone selection" : "Choose timezone manually"}
        </button>
        {editing || (!zone.confirmed && !zone.suggested) ? <div className="create-wizard-time-zone-controls">
          <label className="input-label" htmlFor="event-time-zone">Event timezone</label>
          <select id="event-time-zone" className="text-input create-wizard-input" value={manualZone} onChange={(event) => setManualZone(event.target.value)}>
            {options.map((value) => <option key={value} value={value}>{value.replace(/_/g, " ")}</option>)}
          </select>
          <button type="button" className="secondary-button" onClick={() => { zone.confirm(manualZone); setEditing(false); }}>Confirm timezone</button>
        </div> : null}
      </> : null}
    </div>
  );
}
