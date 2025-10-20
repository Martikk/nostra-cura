import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "./Team.css";
import { useAutoAdvance } from "../hooks/useAutoAdvance";

type Member = {
  name?: string;
  role?: string;
  photo?: string;      // url
  ctaLabel?: string;
  ctaHref?: string;
  // если это CTA-слайд
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
    ctaHref: "#contact",
  },
  // CTA финальный слайд
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
  const slides = useMemo(
    () => (Array.isArray(slidesData) && slidesData.length ? slidesData.filter(Boolean) : [FALLBACK]),
    []
  );
  const len = slides.length;

  const [index, setIndex] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const drag = useRef({ startX: 0, dx: 0, dragging: false });

  const clamp = useCallback((i: number) => ((i % len) + len) % len, [len]);

  useEffect(() => setIndex(i => clamp(i)), [len, clamp]);

  const go = useCallback((dir: 1 | -1) => {
    setIndex(i => clamp(i + dir));
    setAnimKey(k => k + 1);
  }, [clamp]);

  // авто-листание
  const { setPaused } = useAutoAdvance(() => go(1), { interval: 6000 });

  const current = slides[clamp(index)] ?? FALLBACK;

  // drag/swipe
  const onDown = (x: number) => { drag.current = { startX: x, dx: 0, dragging: true }; };
  const onMove = (x: number) => {
    if (!drag.current.dragging) return;
    drag.current.dx = x - drag.current.startX;
    cardRef.current?.style.setProperty("--dx", `${drag.current.dx}px`);
  };
  const onUp = () => {
    if (!drag.current.dragging) return;
    const { dx } = drag.current;
    drag.current.dragging = false;
    cardRef.current?.style.setProperty("--dx", `0px`);
    if (dx > 80) go(-1);
    else if (dx < -80) go(1);
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") go(1);
    if (e.key === "ArrowLeft") go(-1);
  };

  return (
    <section
      id="team"
      className="team"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <h2 className="team__title">OUR TEAM</h2>

      <button className="navbtn navbtn--left" aria-label="Previous" onClick={() => go(-1)}>
        <span>❮</span>
      </button>
      <button className="navbtn navbtn--right" aria-label="Next" onClick={() => go(1)}>
        <span>❯</span>
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
        onMouseDown={(e) => onDown(e.clientX)}
        onMouseMove={(e) => onMove(e.clientX)}
        onMouseLeave={onUp}
        onMouseUp={onUp}
        onTouchStart={(e) => onDown(e.touches[0].clientX)}
        onTouchMove={(e) => onMove(e.touches[0].clientX)}
        onTouchEnd={onUp}
      >
        {current.isCta ? (
          <div className="teamcard__cta">
            <h3 className="cta__title">{current.titleCta}</h3>
            <p className="cta__text"><em>{current.textCta}</em></p>
            {current.ctaHref && (
              <a href={current.ctaHref} className="btn">
                {current.ctaLabel ?? "Contact"}
              </a>
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
              />
            </div>
            <div className="teamcard__info">
              <h3 className="teamcard__name">{current.name ?? "—"}</h3>
              <p className="teamcard__role">{current.role ?? ""}</p>
              {current.ctaHref && (
                <a href={current.ctaHref} className="btn">
                  {current.ctaLabel ?? "Read More"}
                </a>
              )}
            </div>
          </div>
        )}

        {/* точки — для десктопа (внутри карточки) */}
        <div className="svc__dots" role="tablist" aria-label="Team tabs">
          {slides.map((s, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              className={"dot" + (i === clamp(index) ? " active" : "")}
              aria-label={s.isCta ? "Join our team" : s.name ?? `Slide ${i + 1}`}
              aria-selected={i === clamp(index)}
              tabIndex={i === clamp(index) ? 0 : -1}
              onClick={() => { setIndex(i); setAnimKey(k => k + 1); }}
            />
          ))}
        </div>
      </div>

      {/* нижняя панель — для мобилки */}
      <div className="team__controls" aria-label="Carousel controls">
        <button
          className="team__btn team__btn--prev"
          onClick={() => go(-1)}
          aria-label="Previous"
        >
          <span>❮</span>
        </button>

        <div className="team__dots" role="tablist" aria-label="Team tabs (mobile)">
          {slides.map((_, i) => {
            const active = i === clamp(index);
            return (
              <button
                key={i}
                type="button"
                role="tab"
                className={"dot" + (active ? " active" : "")}
                aria-label={`Go to slide ${i + 1}`}
                aria-selected={active}
                tabIndex={active ? 0 : -1}
                onClick={() => { setIndex(i); setAnimKey(k => k + 1); }}
              />
            );
          })}
        </div>

        <button
          className="team__btn team__btn--next"
          onClick={() => go(1)}
          aria-label="Next"
        >
          <span>❯</span>
        </button>
      </div>
    </section>
  );
}