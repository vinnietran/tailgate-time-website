/** The checkout function replaces the literal token before sending URLs to Stripe. */
export function checkoutReturnUrls(origin: string, eventId: string) {
  const base = `${origin}/tailgates/${encodeURIComponent(eventId)}`;
  return {
    successUrl: `${base}?checkout=success&purchaseId={purchaseId}`,
    cancelUrl: `${base}?checkout=cancel&purchaseId={purchaseId}`
  };
}
