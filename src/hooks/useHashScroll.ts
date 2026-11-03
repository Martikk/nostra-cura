import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  // Sections reserve their own header space; Home must always return to zero.
  const top = id === "home" ? 0 : el.getBoundingClientRect().top + window.scrollY;
  window.scrollTo({ top: Math.max(0, top), behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
}

export function useHashScroll() {
  const { hash, pathname } = useLocation();
  useEffect(() => {
    if (hash) scrollToSection(decodeURIComponent(hash.slice(1)));
    else window.scrollTo({ top: 0, behavior: "instant" });
  }, [hash, pathname]);
}
