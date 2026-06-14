import React, { useMemo, useRef, useState, useCallback, useEffect } from "react";
import "./Services.css";


type Item = {
  title: string;
  icon?: React.ReactNode;
  text: string;
  yellowTop?: string;
  yellowBottom?: string;
  buttonLabel?: string;
  buttonHref?: string;
};

const FALLBACK: Item = {
  title: "Coming soon",
  icon: <span aria-hidden>🛠️</span>,
  text: "Services will appear here shortly.",
};

const items: Item[] = [
  {
    title: "Individuals",
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

  yellowTop: "Pressure affects everyone differently.",

  text:
    "Sometimes it shows up in the decisions we make. Sometimes it shows up in what we carry, how we react, or the direction we find ourselves moving without fully understanding why. Our work with individuals is focused on creating space to slow down, reflect, and better understand what matters most. The goal is not to provide answers or tell people what to do. The goal is to create conditions where answers can emerge. When things slow down, it becomes easier to see what matters and move forward with confidence.",
  buttonLabel: "Contact Us",
  buttonHref: "/Contact-Us",
},
  {
    title: "Teams",
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

  yellowTop: "Every team experiences pressure.",

  text:
    "Deadlines, responsibilities, communication challenges, changing priorities, and constant demands can make it difficult to see what is really happening beneath the surface. Over time, teams can find themselves reacting to pressure rather than understanding what is driving it. Our approach is simple. We help teams slow things down, examine what matters, and better understand the relationships, responsibilities, and decisions that shape their work. Through conversation, observation, and practical tools, we create conditions where answers can emerge. When things slow down, it becomes easier to align around what matters and move forward together with confidence.",
  buttonLabel: "Contact Us",
  buttonHref: "/Contact-Us",
},
{
  title: "Workbooks",
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

  yellowTop: "Self-guided reflection and practical tools.",

  text:
    "Our workbooks are designed to help individuals and teams slow down, organize their thinking, and focus on what matters most. Each workbook provides simple frameworks, exercises, and questions that encourage reflection and support better decision-making. Built from real experience in construction, they are designed to be practical, approachable, and easy to apply in everyday life and work. Whether used independently or alongside our services, they create space to explore ideas, responsibilities, and opportunities for improvement. Sometimes the most important answers are already there—they simply need space to emerge.",
  buttonLabel: "VIEW WORKBOOKS",
  buttonHref: "/workbooks",
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

{current.yellowTop && (
  <p className="svc__yellow svc__yellow--top">
    {current.yellowTop}
  </p>
)}

<p className="svc__text">
  <em>{current.text}</em>
</p>

{current.yellowBottom && (
  <p className="svc__yellow svc__yellow--bottom">
    {current.yellowBottom}
  </p>
)}

{current.buttonLabel && current.buttonHref && (
  <a className="svc__button" href={current.buttonHref}>
    {current.buttonLabel} <span>›</span>
  </a>
)}
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