import { createServer } from 'vite';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
try {
  const { render, pageMetadata, structuredData } = await server.ssrLoadModule('/src/entry-server.tsx');
  const template = await readFile('dist/index.html', 'utf8');
  const escape = value => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;');
  for (const path of ['/', '/liam', '/privacy', '/404']) {
    const meta = pageMetadata(path);
    let html = template.replace(/<title>.*?<\/title>/s, `<title>${escape(meta.title)}</title>`);
    for (const [key, value] of Object.entries({ description: meta.description, robots: meta.robots, 'og:title': meta.title, 'og:description': meta.description, 'og:url': meta.url, 'twitter:title': meta.title, 'twitter:description': meta.description })) {
      html = html.replace(new RegExp(`(<meta (?:name|property)="${key}" content=")[^"]*("\\s*/?>)`), (_, a, b) => a + escape(value) + b);
    }
    html = html.replace(/(<link rel="canonical" href=")[^"]*/, '$1' + meta.url).replace(/(<link rel="alternate" href=")[^"]*/, '$1' + meta.url);
    html = html.replace('<div id="root"></div>', () => `<div id="root">${render(path)}</div>`);
    if (path === '/') {
      const base = 'https://res.cloudinary.com/dzytbkc5l/image/upload/';
      const asset = 'v1766885184/liam/hero_2_m5kicm.png';
      html = html.replace('</head>', `<link rel="preload" as="image" href="${base}f_auto,q_auto,w_900/${asset}" media="(max-width:700px)" fetchpriority="high"><link rel="preload" as="image" href="${base}f_auto,q_auto,w_1600/${asset}" media="(min-width:701px)" fetchpriority="high"></head>`);
    }
    html = html.replace('</head>',  `<script type="application/ld+json" data-nccg-schema>${JSON.stringify(structuredData(path)).replaceAll('<', '\\u003c')}</script></head>`);
    const file = path === '/' ? 'dist/index.html' : path === '/404' ? 'dist/404.html' : `dist${path}/index.html`;
    if (path !== '/' && path !== '/404') await mkdir(`dist${path}`, { recursive: true });
    await writeFile(file, html);
    console.log('Prerendered', file);
  }
} finally { await server.close(); }
