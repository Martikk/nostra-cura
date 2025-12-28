import React, { useMemo, useRef, useState, useCallback, useEffect } from "react";
import "./Services.css";


type Item = {
  title: string;
  icon?: React.ReactNode;
  text: string;
};

const FALLBACK: Item = {
  title: "Coming soon",
  icon: <span aria-hidden>🛠️</span>,
  text: "Services will appear here shortly.",
};

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
      "With our years of experience in construction management we understand the struggles that not only companies are facing but also the struggles that the people are encountering daily. We have  been there. With this knowledge and experience we can offer strategies that will ultimately allow  the company to perform at its peak. Our goal is to create an environment where everyone at the organization is supported to be the best version of themselves. People are an organization’s most important asset. When the people are encouraged to grow, the company grows with them.",
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
      "Our focus is the individual person. Our main goal is to help everyone find meaning, bring out their best and lead fulfilling lives. Our experience ranges from just getting started in the industry, working in the field and progressing all the way to operations management. This allows us to relate to anyone at any level. We understand the challenges that people are facing on any given day, at any stage, and in any area of the construction industry. Using our experience and applying our techniques we can work with anyone to help them make changes aimed at improving their overall well-being. Once you start personal growth it never stops. Whatever point you feel that you are at, we can help.",
  },
  {
    title: "Workshops",
    icon: (
      <img
        className="svc__icon-img"
        src="https://res.cloudinary.com/dzytbkc5l/image/upload/v1764181821/output-onlinepngtools_rwbevd.png"
        alt=""
        width={64}
        height={64}
        loading="lazy"
        decoding="async"
      />
    ),
    text:
      "Our workshops are designed for both individuals and groups, using the same practical, people-focused approach we bring to consulting and coaching. Built on real experience in the construction industry, they address the daily pressures, communication challenges, and demands faced by workers and leaders alike. Each session provides tools that can be applied immediately—on site, in the office, and in everyday life. We create an environment where people feel comfortable engaging, asking questions, and building confidence. As individuals grow, teams strengthen. No matter where you are starting, our workshops provide clear, practical guidance to move forward."
  },
];

export default function Services() {
  // всегда хотя бы один слайд
  const slides = useMemo<Item[]>(
    () => (Array.isArray(items) && items.length ? items.filter(Boolean) : [FALLBACK]),
    []
  );
  const len = slides.length;

  const [index, setIndex] = useState(0);
  const [animKey, setAnimKey] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const drag = useRef({ startX: 0, dx: 0, dragging: false });

  const clampIndex = useCallback((i: number) => ((i % len) + len) % len, [len]);

  useEffect(() => {
    setIndex((i) => clampIndex(i));
  }, [len, clampIndex]);

  const go = useCallback(
    (dir: 1 | -1) => {
      setIndex((i) => clampIndex(i + dir));
      setAnimKey((k) => k + 1); // перезапуск анимации входа
    },
    [clampIndex]
  );


  const current = slides[clampIndex(index)] ?? FALLBACK;

  // Drag / swipe
  const onDown = (clientX: number) => {
    drag.current = { startX: clientX, dx: 0, dragging: true };
  };
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

  // Keyboard
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") go(1);
    if (e.key === "ArrowLeft") go(-1);
  };

  return (
    <section
      className="services"
      id="services"
    >
      <h2 className="services__title">OUR SERVICES</h2>

      <div className="services__container">
        {/* ряд: стрелка — карточка — стрелка (desktop) */}
        <div className="services__row">
          <button
            type="button"
            className="navbtn navbtn--left"
            aria-label="Previous"
            onClick={() => go(-1)}
          >
            <span>❮</span>
          </button>

          {/* карточка */}
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
                {current.title}
                {current.icon && (
                  <span className="svc__iconwrap">{current.icon}</span>
                )}
              </h3>
            </div>
            <p className="svc__text">
              <em>{current.text}</em>
            </p>
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

        {/* нижние контролы (мобилка) */}
        <div className="svc__controls" aria-label="Carousel controls">
          <button
            className="svc__btn svc__btn--prev"
            onClick={() => go(-1)}
            aria-label="Previous"
          >
            <span>❮</span>
          </button>
          <div className="svc__dots" role="tablist" aria-label="Service tabs">
            {slides.map((s, i) => {
              const active =
                i === ((index % slides.length) + slides.length) % slides.length;
              return (
                <button
                  key={i}
                  type="button"
                  role="tab"
                  className={"dot" + (active ? " active" : "")}
                  aria-label={`Go to ${s.title}`}
                  aria-current={active ? "true" : undefined}
                  tabIndex={active ? 0 : -1}
                  onClick={() => {
                    setIndex(i);
                    setAnimKey((k) => k + 1);
                  }}
                />
              );
            })}
          </div>
          <button
            className="svc__btn svc__btn--next"
            onClick={() => go(1)}
            aria-label="Next"
          >
            <span>❯</span>
          </button>
        </div>
      </div>
    </section>
  );

}