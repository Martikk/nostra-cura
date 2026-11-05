export const origin = "https://nccg.ca";
export function pageMetadata(path: string) {
  path = path.replace(/\/+$/, "") || "/";
  const known = path === "/" || path === "/liam" || path === "/privacy";
  const title = path === "/" ? "Construction Consulting for Individuals & Teams | NCCG" : path === "/liam" ? "Liam Dillon — Founder & Consultant | NCCG" : path === "/privacy" ? "Privacy Policy | NCCG" : "Page Not Found | NCCG";
  const description = path === "/privacy" ? "How NCCG handles website enquiries, contact details and technical information, including the role of Netlify and Resend. Contact us about privacy." : path === "/liam" ? "Meet Liam Dillon, founder of Nostra Cura Consulting Group. Discover his journey from the trades to leadership and his approach to supporting people in construction." : "Practical consulting for individuals and teams in construction. Explore personal development, leadership support and workbooks with Nostra Cura Consulting Group.";
  return { title, description, url: origin + (path === "/" ? "/" : path === "/liam" ? "/liam/" : path === "/privacy" ? "/privacy/" : path), robots: known ? "index,follow,max-image-preview:large" : "noindex,follow" };
}
export const organization = {
  "@context": "https://schema.org", "@type": "Organization",
  "@id": origin + "/#organization", name: "Nostra Cura Consulting Group Inc.",
  alternateName: "NCCG", url: origin, logo: origin + "/images/nccg-logo.webp",
  email: "info@nccg.ca", founder: { "@type": "Person", name: "Liam Dillon", url: origin + "/liam/", jobTitle: "Founder & Consultant" }
};

export function structuredData(path: string) {
 const page = pageMetadata(path);
 const person = { "@type": "Person", "@id": origin + "/liam#person", name: "Liam Dillon", jobTitle: "Founder & Consultant", url: origin + "/liam/", worksFor: { "@id": origin + "/#organization" } };
 const { "@context": context, ...company } = organization;
 return { "@context": context, "@graph": [company,
  { "@type": "WebSite", "@id": origin + "/#website", name: "Nostra Cura Consulting Group", url: origin, inLanguage: "en-CA", publisher: { "@id": origin + "/#organization" } },
  { "@type": page.url === origin + "/liam/" ? "ProfilePage" : "WebPage", "@id": page.url + "#webpage", url: page.url, name: page.title, description: page.description, inLanguage: "en-CA", isPartOf: { "@id": origin + "/#website" }, ...(page.url === origin + "/liam/" ? { mainEntity: person } : { about: { "@id": origin + "/#organization" } }) }
 ] };
}
