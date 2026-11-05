import { createHash } from 'node:crypto';

const recipients = { 'contact-main': 'info@nccg.ca', 'contact-liam': 'liam@nccg.ca' };
const allowedOrigins = new Set(['https://nccg.ca', 'https://www.nccg.ca']);
const reply = (status, error) => Response.json(error ? { error } : { ok: true }, {
  status, headers: { 'Cache-Control': 'no-store' },
});

export function createContactHandler({ env = process.env, send = fetch } = {}) {
  return async request => {
    if (request.method !== 'POST') return new Response(null, { status: 405, headers: { Allow: 'POST' } });
    if (!allowedOrigins.has(request.headers.get('origin'))) return reply(403, 'Please send your message from nccg.ca.');
    if (!request.headers.get('content-type')?.startsWith('application/x-www-form-urlencoded')) return reply(415, 'Unsupported form format.');
    if (Number(request.headers.get('content-length')) > 24000) return reply(413, 'Your message is too long.');
    let body;
    try { body = await request.text(); } catch { return reply(400, 'Unable to read your message.'); }
    if (Buffer.byteLength(body) > 24000) return reply(413, 'Your message is too long.');
    const data = new URLSearchParams(body);
    if (data.get('bot-field')) return reply(200);
    const form = data.get('form-name');
    if (!Object.hasOwn(recipients, form)) return reply(400, 'Unknown contact form.');
    const name = (data.get('name') || '').trim();
    const email = (data.get('email') || '').trim();
    const phone = (data.get('phone') || '').trim();
    const message = (data.get('message') || '').trim();
    if (!name || name.length > 120 || /[\r\n]/.test(name) || !email || email.length > 254 || !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email) || !message || message.length > 5000 || phone.length > 40 || (phone && !/^[+\d\s().-]{7,40}$/.test(phone))) {
      return reply(400, 'Please check your name, email, phone and message (up to 5,000 characters).');
    }
    if (!env.RESEND_API_KEY || !env.CONTACT_FROM_EMAIL) return reply(503, 'Email is temporarily unavailable. Please email us directly.');
    const payload = {
      from: env.CONTACT_FROM_EMAIL,
      to: [recipients[form]],
      reply_to: email,
      subject: form === 'contact-liam' ? 'NCCG — New enquiry for Liam' : 'NCCG — New website enquiry',
      text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone || 'Not provided'}\nPage: ${form === 'contact-liam' ? 'https://nccg.ca/liam/' : 'https://nccg.ca/'}\n\n${message}`,
    };
    // Identical retries within ten minutes share a provider idempotency key.
    const key = createHash('sha256').update(JSON.stringify(payload) + Math.floor(Date.now() / 600000)).digest('hex');
    try {
      const result = await send('https://api.resend.com/emails', {
        method: 'POST', signal: AbortSignal.timeout(10000),
        headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json', 'Idempotency-Key': `contact-${key}` },
        body: JSON.stringify(payload),
      });
      if (!result.ok) return reply(502, 'Your message could not be sent. Please try again or email us directly.');
      const receipt = await result.json();
      if (!receipt.id) return reply(502, 'Email delivery was not accepted. Please try again.');
      return reply(200);
    } catch {
      return reply(502, 'Email is temporarily unavailable. Please try again or email us directly.');
    }
  };
}

export default createContactHandler();
export const config = {
  rateLimit: { action: 'rate_limit', aggregateBy: ['ip', 'domain'], windowSize: 60, windowLimit: 5 },
};
