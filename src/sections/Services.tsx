import React, { useMemo, useRef, useState, useCallback, useEffect } from "react";
import "./Services.css";
import { useAutoAdvance } from "../hooks/useAutoAdvance"; 

type Item = {
  title: string;
  icon?: React.ReactNode;
  text: string;
};

const FALLBACK: Item = {
  title: "Coming soon",
  icon: <span aria-hidden>🛠️</span>,
  text: "Services will appear here shortly."
};

// ⚠️ Убедись, что этот массив реально не пустой на рантайме
const items: Item[] = [
  {
    title: "Consulting",
    icon: (
      <img
        className="svc__icon-img"
        src="https://res.cloudinary.com/dzytbkc5l/image/upload/v1760976787/liam/1nd_transparent_copy_tufazj.png"
        alt=""
        width={64}
        height={64}
        loading="lazy"
        decoding="async"
      />
    ),
    text:
      "With our years of experience in construction management we understand the struggles..." +
      " We offer strategies that let the company perform at its peak. Our goal is to create an environment " +
      "where everyone is supported to be the best version of themselves."
  },
  {
    title: "Coaching",
    icon: (
      <img
        className="svc__icon-img"
        src="https://res.cloudinary.com/dzytbkc5l/image/upload/v1760980430/liam/68b4c8d9f74d369d6682fa7d_2ndTransparent_vznyn3.png"
        alt=""
        width={64}
        height={64}
        loading="lazy"
        decoding="async"
      />
    ),
    text:
      "Our focus is the individual. We help people find meaning, bring out their best and lead fulfilling lives. " +
      "Using our experience we can work with anyone to make changes aimed at improving their overall well-being."
  },
  {
    title: "Workshops",
    icon: <span className="svc__icon" aria-hidden>📚</span>,
    text:
      "Hands-on workshops that remove stigma and expand mental-health awareness across crews and leadership. " +
      "Practical tools you can use the same week on site."
  }
];

export default function Services() {
  // Нормализуем слайды и всегда держим хотя бы FALLBACK
  const slides = useMemo(() => (Array.isArray(items) && items.length ? items.filter(Boolean) : [FALLBACK]), []);
  const len = slides.length;

  const [index, setIndex] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const drag = useRef({ startX: 0, dx: 0, dragging: false });
  const containerRef = useRef<HTMLDivElement>(null);

  const clampIndex = useCallback((i: number) => ((i % len) + len) % len, [len]);

  // Если по ходу жизни len изменится — поправим индекс
  useEffect(() => {
    setIndex((i) => clampIndex(i));
  }, [len, clampIndex]);

  const go = useCallback((dir: 1 | -1) => {
    setIndex((i) => clampIndex(i + dir));
    setAnimKey((k) => k + 1);
  }, [clampIndex]);

  // Автоплей (опционально). Если используешь мой хук — раскомментируй.
const { setPaused } = useAutoAdvance(() => go(1), { interval: 6000, respectVisibility: true });

  const current = slides[clampIndex(index)] ?? FALLBACK;

  // drag/swipe
  const onDown = (clientX: number) => { drag.current = { startX: clientX, dx: 0, dragging: true }; };
  const onMove = (clientX: number) => {
    if (!drag.current.dragging) return;
    drag.current.dx = clientX - drag.current.startX;
    containerRef.current?.style.setProperty("--dx", `${drag.current.dx}px`);
  };
  const onUp = () => {
    if (!drag.current.dragging) return;
    const { dx } = drag.current;
    drag.current.dragging = false;
    containerRef.current?.style.setProperty("--dx", `0px`);
    if (dx > 80) go(-1);
    else if (dx < -80) go(1);
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") go(1);
    if (e.key === "ArrowLeft") go(-1);
  };

  return (
    <section
      className="services"
      id="services"
      onMouseEnter={() => setPaused?.(true)}
      onMouseLeave={() => setPaused?.(false)}
      onFocus={() => setPaused?.(true)}
      onBlur={() => setPaused?.(false)}
    >
      <h2 className="services__title">OUR SERVICES</h2>

      <button type="button" className="navbtn navbtn--left" aria-label="Previous" onClick={() => go(-1)}>
        <span>❮</span>
      </button>
      <button type="button" className="navbtn navbtn--right" aria-label="Next" onClick={() => go(1)}>
        <span>❯</span>
      </button>

      <div
        ref={containerRef}
        className="svc"
        key={animKey}
        role="region"
        aria-roledescription="carousel"
        aria-label="Services"
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
        <div className="svc__head">
          <h3 className="svc__title">
            {current.title ?? "Untitled"}
            {current.icon && <span className="svc__iconwrap">{current.icon}</span>}
          </h3>
        </div>

        <p className="svc__text"><em>{current.text ?? ""}</em></p>

        <div className="svc__dots" role="tablist" aria-label="Service tabs">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              className={"dot" + (i === clampIndex(index) ? " active" : "")}
              aria-label={`Go to ${slides[i]?.title ?? `Slide ${i + 1}`}`}
              aria-selected={i === clampIndex(index)}
              tabIndex={i === clampIndex(index) ? 0 : -1}
              onClick={() => { setIndex(i); setAnimKey(k => k + 1); }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}