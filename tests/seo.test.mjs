import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
const home = await readFile(new URL('../dist/index.html', import.meta.url), 'utf8');
const liam = await readFile(new URL('../dist/liam/index.html', import.meta.url), 'utf8');
const notFound = await readFile(new URL('../dist/404.html', import.meta.url), 'utf8');
for (const [name, html, path] of [['home',home,'/'],['liam',liam,'/liam']]) {
  test(`${name}: crawlable HTML, unique heading and canonical`, () => {
    assert.equal((html.match(/<h1[ >]/g) || []).length, 1);
    assert.ok(html.includes(`rel="canonical" href="https://nostracura.ca${path}"`));
    assert.ok(html.includes(`property="og:url" content="https://nostracura.ca${path}"`));
    const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map(m=>m[1]);
    assert.equal(new Set(ids).size, ids.length);
    assert.ok(html.includes('application/ld+json'));
    assert.ok(html.includes('Founder &amp; Consultant'));
  });
}
test('routes have distinct titles and descriptions before JavaScript runs', () => {
  for (const pattern of [/<title>(.*?)<\/title>/, /name="description" content="([^"]+)"/]) assert.notEqual(home.match(pattern)[1],liam.match(pattern)[1]);
  assert.ok(liam.includes('Lessons Along the Way'));
});
test('404 is excluded from indexing and sitemap has exactly the live routes', async () => {
  assert.ok(notFound.includes('content="noindex,follow"'));
  const sitemap = await readFile(new URL('../dist/sitemap.xml', import.meta.url),'utf8');
  assert.deepEqual([...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>m[1]).sort(),['https://nostracura.ca/','https://nostracura.ca/liam']);
});
test('service calls to action do not link to missing pages', () => {
  assert.ok(home.includes('href="/#contact"'));
  assert.ok(!home.includes('href="/Contact-Us"'));
  assert.ok(!home.includes('href="/workbooks"'));
});
test('both Netlify forms include discoverable honeypot declarations', () => {
  for (const name of ['contact-main','contact-liam']) {
    const form=home.match(new RegExp(`<form name="${name}"[^>]*hidden[^>]*>([\\s\\S]*?)<\\/form>`));
    assert.ok(form, name);
    assert.ok(form[1].includes('name="bot-field"'));
  }
});

test('all carousel content is present without waiting for user interaction', () => {
  for (const title of ['Our Mission', 'What We Do', 'Teams', 'Workbooks']) assert.ok(home.includes(title));
  assert.ok(home.includes('Each workbook is organized into eight sessions'));
});

test('structured data matches each route and identifies the company', () => {
 const schema = html => JSON.parse(html.match(/<script type="application\/ld\+json"[^>]*>(.*?)<\/script>/s)[1]);
 const a=schema(home)['@graph'], b=schema(liam)['@graph'];
 assert.ok(a.some(node=>node['@type']==='Organization' && node.name==='Nostra Cura Consulting Group Inc.'));
 assert.ok(a.some(node=>node['@type']==='WebPage' && node.url==='https://nostracura.ca/'));
 assert.ok(b.some(node=>node['@type']==='ProfilePage' && node.mainEntity.name==='Liam Dillon'));
});
test('home prioritizes responsive hero images and defers section backgrounds', () => {
 assert.ok(home.includes('rel="preload" as="image"'));
 assert.ok(home.includes('fetchpriority="high"'));
 assert.ok(home.includes('class="nc-section__background"'));
 assert.ok(home.includes('loading="lazy"'));
 assert.ok(home.includes('aria-label="Read More about Liam Dillon"'));
});
