import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { pageMetadata, structuredData } from "../seo";
export default function Seo() {
  const { pathname } = useLocation();
  useEffect(() => {
    const meta = pageMetadata(pathname);
    document.title = meta.title;
    let schema = document.querySelector<HTMLScriptElement>('script[data-nccg-schema]');
    if (!schema) {
      schema = document.createElement('script'); schema.type = 'application/ld+json';
      schema.dataset.nccgSchema = ''; document.head.appendChild(schema);
    }
    schema.textContent = JSON.stringify(structuredData(pathname));
    const set = (selector: string, content: string) => document.querySelector(selector)?.setAttribute("content", content);
    set('meta[name="description"]', meta.description);
    set('meta[name="robots"]', meta.robots);
    for (const prefix of ['og', 'twitter']) {
      for (const field of ['title', 'description'] as const) set(`meta[${prefix === 'og' ? 'property' : 'name'}="${prefix}:${field}"]`, meta[field]);
    }
    set('meta[property="og:url"]', meta.url);
    document.querySelector('link[rel="canonical"]')?.setAttribute('href', meta.url);
    document.querySelector('link[rel="alternate"][hreflang]')?.setAttribute('href', meta.url);
  }, [pathname]);
  return null;
}
