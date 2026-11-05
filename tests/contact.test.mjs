import test from 'node:test';
import assert from 'node:assert/strict';
import { createContactHandler } from '../netlify/functions/contact.mjs';
const env = { RESEND_API_KEY: 'test-only', CONTACT_FROM_EMAIL: 'NCCG <website@forms.nccg.ca>' };
const request = (fields = {}, origin = 'https://nccg.ca') => new Request('https://nccg.ca/.netlify/functions/contact', {
 method: 'POST', headers: { origin, 'Content-Type': 'application/x-www-form-urlencoded' },
 body: new URLSearchParams({ 'form-name': 'contact-main', name: 'Test Visitor', email: 'visitor@example.com', message: 'A website enquiry.', ...fields }),
});
test('routes each form to its fixed recipient and puts visitor in Reply-To', async () => {
 for (const [form, to] of [['contact-main','info@nccg.ca'],['contact-liam','liam@nccg.ca']]) {
  let payload;
  const handler=createContactHandler({ env, send: async (url, options) => {
   assert.equal(url,'https://api.resend.com/emails'); payload=JSON.parse(options.body);
   assert.ok(options.headers['Idempotency-Key']);
   return Response.json({id:'accepted'});
  }});
  assert.equal((await handler(request({'form-name':form,to:'attacker@example.com'}))).status,200);
  assert.deepEqual(payload.to,[to]); assert.equal(payload.reply_to,'visitor@example.com');
  assert.equal(payload.from,env.CONTACT_FROM_EMAIL);
 }
});
test('rejects invalid input, header injection, unknown forms and cross-origin requests before sending', async () => {
 const handler=createContactHandler({env,send:()=>assert.fail('must not send')});
 for(const fields of [{email:'invalid'},{email:'victim@example.com\r\nBcc: x@y.ca'},{name:'A\nB'},{message:''},{message:'x'.repeat(5001)},{'form-name':'unknown'},{phone:'letters'}]) assert.equal((await handler(request(fields))).status,400);
 assert.equal((await handler(request({},'https://other.example'))).status,403);
 assert.equal((await handler(new Request('https://nccg.ca/.netlify/functions/contact'))).status,405);
});
test('honeypot does not send email',async()=>{
 const handler=createContactHandler({env,send:()=>assert.fail('must not send')});
 assert.equal((await handler(request({'bot-field':'spam'}))).status,200);
});
test('configuration and upstream failures never report a successful send',async()=>{
 assert.equal((await createContactHandler({env:{}})(request())).status,503);
 for(const send of [async()=>new Response('',{status:429}),async()=>{throw Error('timeout')},async()=>Response.json({})]) {
  assert.equal((await createContactHandler({env,send})(request())).status,502);
 }
});
test('rejects oversized payloads',async()=>{
 assert.equal((await createContactHandler({env})(request({message:'x'.repeat(25000)}))).status,413);
});
