import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "./Team.css";
import { useAutoAdvance } from "../hooks/useAutoAdvance";
// import { Link } from "react-router-dom"; // если используешь SPA-навигацию — замени <a> на <Link>

type Member = {
  name?: string;
  role?: string;
  photo?: string;
  ctaLabel?: string;
  ctaHref?: string;
  isCta?: boolean;
  titleCta?: string;
  textCta?: string;
};

const FALLBACK: Member = {
  name: "Coming soon",
  role: "—",
  photo: "https://res.cloudinary.com/dzytbkc5l/image/upload/v1760976790/liam/324_xuolp6.png",
};

const slidesData: Member[] = [
  {
    name: "Liam Dillon",
    role: "Consultant & Coach",
    photo:
      "https://res.cloudinary.com/dzytbkc5l/image/upload/v1760984212/liam/68ee59cb1509a05d8708757d_main_Liam_ewlmpq.jpg",
    ctaLabel: "Read More",
    ctaHref: "/liam",
  },
  {
    isCta: true,
    titleCta: "Join our team",
    textCta:
      "We’re always looking for dedicated people to grow with us. If you’re passionate about helping people and want to build a better future, let’s connect.",
    ctaLabel: "Contact Us",
    ctaHref: "#contact",
  },
];

export default function Team() {
  const slides = useMemo<Member[]>(
    () => (Array.isArray(slidesData) && slidesData.length ? slidesData.filter(Boolean) : [FALLBACK]),
    []
  );
  const len = slides.length;

  const [index, setIndex] = useState(0);
  const [animKey, setAnimKey] = useState(0);

  const cardRef = useRef<HTMLDivElement>(null);
  const drag = useRef({ startX: 0, dx: 0, dragging: false });

  const clamp = useCallback((i: number) => ((i % len) + len) % len, [len]);
  useEffect(() => setIndex((i) => clamp(i)), [len, clamp]);

  const go = useCallback(
    (dir: 1 | -1) => {
      setIndex((i) => clamp(i + dir));
      setAnimKey((k) => k + 1);
    },
    [clamp]
  );

  // автоплей + пауза при фокусе/hover
  const auto =
    typeof useAutoAdvance === "function"
      ? useAutoAdvance(() => go(1), { interval: 6000, respectVisibility: true })
      : { setPaused: undefined as ((p: boolean) => void) | undefined };
  const { setPaused } = auto;

  const current = slides[clamp(index)] ?? FALLBACK;

  // ---- swipe/drag (Pointer Events) ----
  const DRAG_ACTIVATE_PX = 8;

  const onPointerDown = (e: React.PointerEvent) => {
    // мышь: только ЛКМ; тач/стилус: всегда
    if (e.pointerType === "mouse" && e.buttons !== 1) return;

    // если старт по интерактиву — НЕ запускаем drag и НЕ берём capture
    const t = e.target as Element | null;
    if (t && t.closest("a, button, [role='button'], .btn")) {
      drag.current = { startX: 0, dx: 0, dragging: false };
      return;
    }

    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
    drag.current = { startX: e.clientX, dx: 0, dragging: false };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d.startX && !d.dragging) return;
    d.dx = e.clientX - d.startX;

    if (!d.dragging && Math.abs(d.dx) >= DRAG_ACTIVATE_PX) d.dragging = true;
    if (d.dragging) {
      cardRef.current?.style.setProperty("--dx", `${d.dx}px`);
    }
  };

  const endPointer = (e?: React.PointerEvent) => {
    const d = drag.current;
    cardRef.current?.style.setProperty("--dx", `0px`);

    if (!d.dragging) {
      drag.current = { startX: 0, dx: 0, dragging: false };
      if (e) (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
      return;
    }

    const { dx } = d;
    drag.current = { startX: 0, dx: 0, dragging: false };

    if (dx > 80) go(-1);
    else if (dx < -80) go(1);

    if (e) (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
  };

  const onPointerUp = (e: React.PointerEvent) => endPointer(e);
  const onPointerCancel = (e: React.PointerEvent) => endPointer(e);

  // стопим старт drag на интерактивах
  const stopDragOnPointerDown = {
    onPointerDown: (e: React.PointerEvent) => {
      e.stopPropagation();
      drag.current = { startX: 0, dx: 0, dragging: false };
      cardRef.current?.style.setProperty("--dx", `0px`);
    },
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") go(1);
    if (e.key === "ArrowLeft") go(-1);
  };

  return (
    <section
      id="team"
      className="team"
      onMouseEnter={() => setPaused?.(true)}
      onMouseLeave={() => setPaused?.(false)}
      onFocus={() => setPaused?.(true)}
      onBlur={() => setPaused?.(false)}
    >
      <h2 className="team__title">OUR TEAM</h2>

      <div className="team__container">
        <div className="team__row">
          <button type="button" className="navbtn navbtn--left" aria-label="Previous" onClick={() => go(-1)}>
            <span>❮</span>
          </button>

          <div
            ref={cardRef}
            className="teamcard"
            key={animKey}
            role="region"
            aria-roledescription="carousel"
            aria-label="Team"
            tabIndex={0}
            onKeyDown={onKey}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerCancel}
          >
            {current.isCta ? (
              <div className="teamcard__cta">
                <h3 className="cta__title">{current.titleCta}</h3>
                <p className="cta__text"><em>{current.textCta}</em></p>
                {current.ctaHref && (
                  // <Link to={current.ctaHref} className="btn" draggable={false} {...stopDragOnPointerDown}>
                  <a href={current.ctaHref} className="btn" draggable={false} {...stopDragOnPointerDown}>
                    {current.ctaLabel ?? "Contact"}
                  </a>
                  // </Link>
                )}
              </div>
            ) : (
              <div className="teamcard__grid">
                <div className="teamcard__photo">
                  <img
                    src={current.photo}
                    alt={current.name ? `${current.name} portrait` : ""}
                    loading="lazy"
                    decoding="async"
                    draggable={false}
                  />
                </div>
                <div className="teamcard__info">
                  <h3 className="teamcard__name">{current.name ?? "—"}</h3>
                  <p className="teamcard__role">{current.role ?? ""}</p>
                  {current.ctaHref && (
                    // <Link to={current.ctaHref} className="btn" draggable={false} {...stopDragOnPointerDown}>
                    <a href={current.ctaHref} className="btn" draggable={false} {...stopDragOnPointerDown}>
                      {current.ctaLabel ?? "Read More"}
                    </a>
                    // </Link>
                  )}
                </div>
              </div>
            )}
          </div>

          <button type="button" className="navbtn navbtn--right" aria-label="Next" onClick={() => go(1)}>
            <span>❯</span>
          </button>
        </div>

        <div className="team__controls" aria-label="Carousel controls">
          <button className="team__btn team__btn--prev" onClick={() => go(-1)} aria-label="Previous"><span>❮</span></button>

          <div className="team__dots" role="tablist" aria-label="Team tabs">
            {slides.map((s, i) => {
              const active = i === clamp(index);
              return (
                <button
                  key={i}
                  type="button"
                  role="tab"
                  className={"dot" + (active ? " active" : "")}
                  aria-label={s.isCta ? "Join our team" : s.name ?? `Slide ${i + 1}`}
                  aria-current={active ? "true" : undefined}
                  tabIndex={active ? 0 : -1}
                  onClick={() => { setIndex(i); setAnimKey((k) => k + 1); }}
                />
              );
            })}
          </div>

          <button className="team__btn team__btn--next" onClick={() => go(1)} aria-label="Next"><span>❯</span></button>
        </div>
      </div>
    </section>
  );
}