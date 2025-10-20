import React, { useEffect, useMemo, useRef, useState } from "react";
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
  }, []);
}

export default function Navbar() {
  const [active, setActive] = useState<SectionId>("home");
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const NAV_OFFSET = useNavOffset();

  // Подсветка текущей секции
  useEffect(() => {
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
  }, [NAV_OFFSET]);

  // Блокируем скролл страницы при открытом меню
  useEffect(() => {
    const root = document.documentElement;
    if (open) root.classList.add("no-scroll");
    else root.classList.remove("no-scroll");
    return () => root.classList.remove("no-scroll");
  }, [open]);

  // Закрытие по ESC и возврат фокуса на кнопку
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (!open && btnRef.current) btnRef.current.focus();
  }, [open]);

  // Скролл с учётом высоты хедера
  const scrollToId = (id: SectionId) => {
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - NAV_OFFSET;
    window.scrollTo({ top, behavior: "smooth" });
  };

  const onLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, id: SectionId) => {
    e.preventDefault();
    setOpen(false);
    scrollToId(id);
  };

  return (
    <header className="nav">
      <div className="nav__inner">
        {/* Бренд */}
        <a
          className="brand"
          href="#home"
          aria-label="Nostra Cura — Home"
          onClick={(e) => {
            e.preventDefault();
            onLinkClick(e as unknown as React.MouseEvent<HTMLAnchorElement>, "home");
          }}
        >
          <img
            className="brand__logo"
            src="https://res.cloudinary.com/dzytbkc5l/image/upload/v1760976794/liam/Logo_kp1mab.png"
            alt="Nostra Cura logo"
            width={70}
            height={40}
          />
          <img
            className="brand__logo_text"
            src="https://res.cloudinary.com/dzytbkc5l/image/upload/v1760976792/liam/image_hk1hq2.png"
            alt="NOSTRA CURA"
            width={200}
            height={32}
          />
        </a>

        {/* Десктоп-меню */}
        <nav className="nav__links nav__links--desktop" aria-label="Primary">
          {SECTIONS.map((id) => (
            <a
              key={id}
              href={`#${id}`}
              className={active === id ? "active" : ""}
              aria-current={active === id ? "page" : undefined}
              onClick={(e) => onLinkClick(e, id)}
            >
              {id.charAt(0).toUpperCase() + id.slice(1)}
            </a>
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

      {/* Подложка */}
      <div
        className={"nav__backdrop" + (open ? " is-open" : "")}
        onClick={() => setOpen(false)}
        aria-hidden={true}
      />

      {/* Выезжающая панель */}
      <div
        id="mobile-sheet"
        className={"nav__sheet" + (open ? " is-open" : "")}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
      >
        <nav className="nav__links nav__links--mobile">
          {SECTIONS.map((id) => (
            <a
              key={id}
              href={`#${id}`}
              className={active === id ? "active" : ""}
              aria-current={active === id ? "page" : undefined}
              onClick={(e) => onLinkClick(e, id)}
            >
              {id.charAt(0).toUpperCase() + id.slice(1)}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}