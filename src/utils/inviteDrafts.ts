// Drafts stay outside attendees because backend attendee triggers deliver invitations.
export function copyInviteDrafts(values: unknown, hostId: string, newId: () => string) {
  if (!Array.isArray(values)) return [];
  return values.flatMap((entry) => {
    if (!entry || typeof entry !== "object") return [];
    const value = entry as Record<string, unknown>;
    if (String(value.status ?? "").toLowerCase() === "host" ||
        [value.userId, value.uid, value.id].includes(hostId)) return [];
    const contact: Record<string, string> = {};
    for (const key of ["name", "displayName", "phone", "email"]) {
      if (typeof value[key] === "string" && value[key].trim()) contact[key] = value[key].trim();
    }
    if (!Object.keys(contact).length) return [];
    return [{ ...contact, id: newId(), token: newId(), status: "Pending" }];
  });
}
