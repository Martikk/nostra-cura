# Contact delivery

Both React forms send URL-encoded requests to `/.netlify/functions/contact`.
The function sends through Resend and chooses the recipient server-side:

- `contact-main` → `info@nccg.ca`
- `contact-liam` → `liam@nccg.ca`

Required Netlify environment variables (Functions scope, production):

- `RESEND_API_KEY`: a Resend Sending access key restricted to `forms.nccg.ca`.
- `CONTACT_FROM_EMAIL`: `NCCG Website <website@forms.nccg.ca>`.

Never commit an API key or put it in a `VITE_` variable. Redeploy after configuring
runtime variables. Verify `forms.nccg.ca` in Resend before enabling production.
Leave Microsoft 365 MX/SPF records for `nccg.ca` unchanged.

The handler validates input and origin, ignores a filled honeypot, uses provider
idempotency keys for identical submissions in a ten-minute time bucket, and has a
Netlify platform rate limit of five requests per IP/domain per minute. Origin and
honeypot checks reduce casual abuse; they are not CAPTCHA authentication.

A successful response means Resend accepted the message, not that the recipient
opened it. Use Resend delivery/bounce logs for delivery verification. Visitor
addresses are Reply-To, never From. Form content and secrets are not logged by the
handler. Existing Netlify Forms submissions remain available in the dashboard;
new requests handled by this function are not saved as Netlify Forms submissions.

Before release: run `npm run lint`, `npm run build`, `npm test`, then submit both
live forms and check their separate recipients in Resend delivery logs.
