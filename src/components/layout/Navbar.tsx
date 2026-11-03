import { scrollToSection } from "../../hooks/useHashScroll";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Navbar.css";

const SECTIONS = ["home", "about", "services", "team", "stories", "contact"] as const;
type SectionId = typeof SECTIONS[number];

/** Читаем CSS-переменную --nav-h (fallback 92px) */
function useNavOffset(fallback = 92) {
  return useMemo(() => {
    if (typeof window === "undefined") return fallback;
    const root = getComputedStyle(document.documentElement);
    const raw = root.getPropertyValue("--nav-h").trim();
    const px = parseInt(raw.replace("px", ""), 10);
    return Number.isFinite(px) ? px + 12 /* небольшой зазор */ : fallback;
  }, [fallback]);
}

export default function Navbar() {
  const [active, setActive] = useState<SectionId>("home");
  const [open, setOpen] = useState(false);
  const wasOpen = useRef(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const NAV_OFFSET = useNavOffset();

  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";

  // Подсветка текущей секции (работает только на главной)
  useEffect(() => {
    if (!isHome) return;
    const observers: IntersectionObserver[] = [];

    SECTIONS.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const io = new IntersectionObserver(
        ([entry]) => entry.isIntersecting && setActive(id),
        {
          threshold: 0.5,
          rootMargin: `-${Math.max(0, NAV_OFFSET - 8)}px 0px -20% 0px`,
        }
      );
      io.observe(el);
      observers.push(io);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [NAV_OFFSET, isHome]);

  // Блокируем скролл страницы при открытом меню
  useEffect(() => {
    const root = document.documentElement;
    if (open) root.classList.add("no-scroll");
    else root.classList.remove("no-scroll");
    return () => root.classList.remove("no-scroll");
  }, [open]);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 901px)");
    const closeOnDesktop = () => { if (desktop.matches) setOpen(false); };
    desktop.addEventListener("change", closeOnDesktop);
    return () => desktop.removeEventListener("change", closeOnDesktop);
  }, []);

  // Закрытие по ESC и возврат фокуса на кнопку
  useEffect(() => {
    if (!open) return;
    const links = Array.from(document.querySelectorAll<HTMLAnchorElement>('#mobile-sheet a'));
    links[0]?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "Tab") {
        const first = btnRef.current, last = links[links.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last?.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus(); }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (!open && wasOpen.current) btnRef.current?.focus({ preventScroll: true });
    wasOpen.current = open;
  }, [open]);

  // Локальный скролл по секции (на главной)
const scrollToId = scrollToSection;

  // Универсальный обработчик: если мы НЕ на главной — уходим на /#id, иначе плавно скроллим
  const goTo = (id: SectionId, e?: React.MouseEvent) => {
    e?.preventDefault();
    setOpen(false);
    if (isHome) {
      navigate(`/#${id}`);
      scrollToId(id);
    } else {
      navigate(`/#${id}`); // Router-переход на главную с hash
    }
  };

  return (
    <>
    <header className={"nav" + (open ? " nav--menu-open" : "")}>
      <div className="nav__inner">
        {/* Бренд → домой */}
        <Link
          className="brand"
          to="/#home"
          aria-label="Nostra Cura — Home"
          onClick={(e) => goTo("home", e)}
        >
<img className="brand__nccg" src="/images/nccg-logo-header-440.webp" alt="NCCG — Nostra Cura Consulting Group" width={440} height={147} />
        </Link>

        {/* Десктоп-меню */}
        <nav className="nav__links nav__links--desktop" aria-label="Primary">
          {SECTIONS.map((id) => (
            <Link
              key={id}
              to={`/#${id}`}
              className={active === id && isHome ? "active" : ""}
              aria-current={active === id && isHome ? "page" : undefined}
              onClick={(e) => goTo(id, e)}
            >
              {id.charAt(0).toUpperCase() + id.slice(1)}
            </Link>
          ))}
        </nav>

        {/* Кнопка меню (мобилка) */}
        <button
          ref={btnRef}
          className={"nav__menu-btn" + (open ? " is-open" : "")}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-sheet"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="nav__menu-label">Menu</span>
          <span className="nav__burger" aria-hidden />
        </button>
      </div>

    </header>
      {/* Overlays are siblings: header backdrop-filter must not contain fixed panels. */}
      <div
        className={"nav__backdrop" + (open ? " is-open" : "")}
        onClick={() => setOpen(false)}
        aria-hidden={true}
      />

      {/* Выезжающая панель */}
      <div
        id="mobile-sheet"
        className={"nav__sheet" + (open ? " is-open" : "")}
        inert={!open}
        aria-hidden={!open}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
      >
        <nav className="nav__links nav__links--mobile">
          {SECTIONS.map((id) => (
            <Link
              key={id}
              to={`/#${id}`}
              className={active === id && isHome ? "active" : ""}
              aria-current={active === id && isHome ? "page" : undefined}
              onClick={(e) => goTo(id, e)}
            >
              {id.charAt(0).toUpperCase() + id.slice(1)}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}