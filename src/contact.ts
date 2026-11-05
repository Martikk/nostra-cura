/** Send only to the same-origin server; credentials and recipients stay server-side. */
export async function submitContact(body: string) {
  const response = await fetch('/.netlify/functions/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
    signal: AbortSignal.timeout(15000),
  });
  const result = await response.json().catch(() => null);
  if (!response.ok || result?.ok !== true) {
    throw new Error(response.status === 429
      ? 'Please wait a minute before sending another message.'
      : result?.error || 'Unable to send. Please try again or email us directly.');
  }
}
