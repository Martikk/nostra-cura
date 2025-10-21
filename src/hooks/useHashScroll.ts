import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/** Плавно скроллит к элементу по location.hash при монтировании/смене hash */
export function useHashScroll(offsetPx = 0) {
  const { hash, pathname } = useLocation();

  useEffect(() => {
    // ждём рендера секций на главной
    if (pathname !== "/") return;
    const id = hash?.replace("#", "");
    if (!id) return;
    const el = document.getElementById(id);
    if (!el) return;

    const top = el.getBoundingClientRect().top + window.scrollY - offsetPx;
    window.scrollTo({ top, behavior: "smooth" });
  }, [hash, pathname, offsetPx]);
}