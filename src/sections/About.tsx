import React, {
  useMemo,
  useRef,
  useState,
  useCallback,
  useEffect,
} from "react";
import "./About.css";

type AboutItem = {
  title: string;
  yellowTop?: string;
  text: string;
  yellowBottom?: string;
  buttonLabel?: string;
  buttonHref?: string;
};

const FALLBACK: AboutItem = {
  title: "Coming soon",
  yellowTop: "More information will appear here shortly.",
  text: "This section is being updated.",
};

const items: AboutItem[] = [
  {
    title: "Our Vision",
    yellowTop: "Better communities built by people in construction.",
    text:
      "The construction industry helps shape the places where people live, work, and connect. Behind every project are individuals, families, teams, and leaders whose influence extends far beyond the job site.We believe that stronger communities begin with stronger people. When individuals and teams are better equipped to navigate decisions, responsibilities, and pressure with confidence, the positive impact reaches into their workplaces, homes, and communities. Our vision is a construction industry where people are supported not only in the work they do, but in the lives they build.",
  },
  {
    title: "What We Do",
    yellowTop: "Creating conditions where answers can emerge.",
    text:
      "Many of the challenges people face are not caused by a lack of effort, ability, or commitment. Often, they are the result of operating under pressure for so long that important things become difficult to see. Our role is not to provide all the answers. Our role is to create space for individuals and teams to slow things down, examine what matters, and better understand the decisions and responsibilities in front of them. Through conversation, observation, reflection, and practical tools, we help create conditions where answers can emerge and meaningful progress can follow.",
  },
  {
    title: "Why It Matters",
    yellowTop: "Mental health cannot stay hidden on the jobsite.",
    text:
      "The construction industry faces real pressure, and too often people are expected to handle it alone. Stress, burnout, conflict, isolation, and personal struggles can affect safety, communication, leadership, and quality of life. Our work is focused on reducing stigma, opening dialogue, and helping people move forward with more clarity, confidence, and support.",
  },
];

export default function About() {
  const slides = useMemo<AboutItem[]>(
    () => (Array.isArray(items) && items.length ? items.filter(Boolean) : [FALLBACK]),
    []
  );

  const len = slides.length;

  const [index, setIndex] = useState(0);
  const [animKey, setAnimKey] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const drag = useRef({ startX: 0, dx: 0, dragging: false });

  const clampIndex = useCallback(
    (i: number) => ((i % len) + len) % len,
    [len]
  );

  useEffect(() => {
    setIndex((i) => clampIndex(i));
  }, [len, clampIndex]);

  const go = useCallback(
    (dir: 1 | -1) => {
      setIndex((i) => clampIndex(i + dir));
      setAnimKey((k) => k + 1);
    },
    [clampIndex]
  );

  const current = slides[clampIndex(index)] ?? FALLBACK;

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
    containerRef.current?.style.setProperty("--dx", "0px");

    if (dx > 80) go(-1);
    else if (dx < -80) go(1);
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") go(1);
    if (e.key === "ArrowLeft") go(-1);
  };

  return (
    <section className="about" id="about">
      <h1 className="about__title">ABOUT US</h1>

      <div className="about__container">
        <div className="about__row">
          <button
            type="button"
            className="aboutnav aboutnav--left"
            aria-label="Previous"
            onClick={() => go(-1)}
          >
            <span>❮</span>
          </button>

          <div
            ref={containerRef}
            className="aboutcard"
            key={animKey}
            role="region"
            aria-roledescription="carousel"
            aria-label="About us"
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
            <h2 className="aboutcard__title">{current.title}</h2>

            {current.yellowTop && (
              <p className="aboutcard__yellow aboutcard__yellow--top">
                {current.yellowTop}
              </p>
            )}

            <p className="aboutcard__text">
              <em>{current.text}</em>
            </p>

            {current.yellowBottom && (
              <p className="aboutcard__yellow aboutcard__yellow--bottom">
                {current.yellowBottom}
              </p>
            )}

            {current.buttonLabel && current.buttonHref && (
              <a className="aboutcard__button" href={current.buttonHref}>
                {current.buttonLabel} <span>›</span>
              </a>
            )}
          </div>

          <button
            type="button"
            className="aboutnav aboutnav--right"
            aria-label="Next"
            onClick={() => go(1)}
          >
            <span>❯</span>
          </button>
        </div>

        <div className="aboutcard__controls" aria-label="Carousel controls">
          <button
            className="aboutcard__btn aboutcard__btn--prev"
            onClick={() => go(-1)}
            aria-label="Previous"
          >
            <span>❮</span>
          </button>

          <div className="aboutcard__dots" role="tablist" aria-label="About tabs">
            {slides.map((s, i) => {
              const active =
                i === ((index % slides.length) + slides.length) % slides.length;

              return (
                <button
                  key={i}
                  type="button"
                  role="tab"
                  className={"aboutdot" + (active ? " active" : "")}
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
            className="aboutcard__btn aboutcard__btn--next"
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