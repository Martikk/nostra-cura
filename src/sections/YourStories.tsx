import { useState, useRef, useCallback } from "react";
import type { KeyboardEvent } from "react";
import "./YourStories.css";

type Story = { text: string };

const stories: Story[] = [
  {
    text:
      "“Many professionals in construction face burnout and constant pressure. We step in by helping them set healthier boundaries, balance work and life, and rediscover pride in their craft. Our goal is to remind people they don’t have to carry the weight alone.”",
  },
  {
    text:
      "“Behind every project are people who deserve to thrive, not just survive. We help professionals find stability, confidence, and tools for long-term success—so they can focus on what truly matters: building a better life alongside building better structures.”",
  },
  {
    text:
      "“Leadership in construction requires more than technical expertise—it requires empathy, awareness, and resilience. Our mission is to help leaders strengthen teams, prevent burnout, and create cultures where people feel valued and supported.”",
  },
];

export default function YourStories() {
  const len = stories.length;
  const [index, setIndex] = useState(0);

  const clamp = useCallback((i: number) => ((i % len) + len) % len, [len]);
  const go = useCallback((dir: 1 | -1) => setIndex((i) => clamp(i + dir)), [clamp]);

  // auto-advance (7s), уважает prefers-reduced-motion и видимость вкладки
  // useEffect(() => {
  //   const media = window.matchMedia?.("(prefers-reduced-motion: reduce)");
  //   if (media?.matches || paused) return;

  //   const tick = () => {
  //     if (document.visibilityState === "visible") go(1);
  //   };
  //   const id = window.setInterval(tick, 7000);
  //   return () => window.clearInterval(id);
  // }, [go, paused]);

  // клавиатура
  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight") go(1);
    if (e.key === "ArrowLeft") go(-1);
  };

  // свайп
  const drag = useRef({ startX: 0, dx: 0, dragging: false });
  const onDown = (x: number) => (drag.current = { startX: x, dx: 0, dragging: true });
  const onMove = (x: number) => {
    if (!drag.current.dragging) return;
    drag.current.dx = x - drag.current.startX;
  };
  const onUp = () => {
    if (!drag.current.dragging) return;
    const { dx } = drag.current;
    drag.current.dragging = false;
    if (dx > 80) go(-1);
    else if (dx < -80) go(1);
  };

  const current = stories[clamp(index)];

  return (
    <section className="stories" id="stories">
      <h2 className="stories__title">YOUR STORIES</h2>

      {/* контейнер: стрелка — карточка — стрелка (desktop) */}
      <div className="stories__row">
        <button
          type="button"
          className="navbtn navbtn--left"
          aria-label="Previous"
          onClick={() => go(-1)}
        >
          <span>❮</span>
        </button>

<div
  className="storycard"
  role="region"
  aria-roledescription="carousel"
  aria-label="Stories"
  aria-live="polite"
  tabIndex={0}
  onKeyDown={onKeyDown}
  onMouseLeave={onUp}              // оставили onUp, чтобы свайп/drag нормально завершался
  onMouseDown={(e) => onDown(e.clientX)}
  onMouseMove={(e) => onMove(e.clientX)}
  onMouseUp={onUp}
  onTouchStart={(e) => onDown(e.touches[0].clientX)}
  onTouchMove={(e) => onMove(e.touches[0].clientX)}
  onTouchEnd={onUp}
>
        <div className="storycard__stars" aria-hidden="true">
          {Array.from({ length: 5 }).map((_, i) => (
            <img
              key={i}
              className="storycard__star"
              src="https://res.cloudinary.com/dzytbkc5l/image/upload/v1760976788/liam/2sp6am4qncmf05qzut_fmmlir.svg"
              alt=""
              loading="lazy"
              decoding="async"
            />
          ))}
        </div>

        <p className="storycard__text">
          <em>{current.text}</em>
        </p>

        {/* точки для десктопа (внутри карточки) */}
        <div className="svc__dots" role="tablist" aria-label="Story tabs">
          {stories.map((_, i) => {
            const active = i === ((index % len) + len) % len;
            return (
              <button
                key={i}
                type="button"
                role="tab"
                className={"dot" + (active ? " active" : "")}
                aria-label={`Go to story ${i + 1}`}
                aria-current={active ? 'true' : undefined}
                tabIndex={active ? 0 : -1}
                onClick={() => setIndex(i)}
              />
            );
          })}
        </div>
      </div>

      <button
        type="button"
        className="navbtn navbtn--right"
        aria-label="Next"
        onClick={() => go(1)}
      >
        <span>❯</span>
      </button>
      </div>

      {/* нижняя панель для мобилки */}
      <div className="stories__controls" aria-label="Carousel controls">
        <button
          className="stories__btn stories__btn--prev"
          onClick={() => go(-1)}
          aria-label="Previous"
        >
          <span>❮</span>
        </button>

        <div className="stories__dots" role="tablist" aria-label="Story tabs (mobile)">
          {stories.map((_, i) => {
            const active = i === ((index % len) + len) % len;
            return (
              <button
                key={i}
                type="button"
                role="tab"
                className={"dot" + (active ? " active" : "")}
                aria-label={`Go to story ${i + 1}`}
                aria-current={active ? 'true' : undefined}
                tabIndex={active ? 0 : -1}
                onClick={() => setIndex(i)}
              />
            );
          })}
        </div>

        <button
          className="stories__btn stories__btn--next"
          onClick={() => go(1)}
          aria-label="Next"
        >
          <span>❯</span>
        </button>
      </div>
    </section>
  );
}