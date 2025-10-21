import { useEffect, useRef, useState } from "react";
import Footer from "../components/layout/Footer";
import "./LiamStory.css";

/* === Typewriter (JS) === */
function Typewriter({
  text,
  speed = 90,          // мс на символ (медленнее = больше число)
  jitter = 30,         // небольшая рандомизация, чтобы «живее»
  className = "",
  ariaLabel,
}: {
  text: string;
  speed?: number;
  jitter?: number;
  className?: string;
  ariaLabel?: string;
}) {
  const [i, setI] = useState(0);
  const prefReduce = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    if (prefReduce) { setI(text.length); return; }
    let idx = 0;
    let alive = true;

    const tick = () => {
      if (!alive) return;
      idx = Math.min(idx + 1, text.length);
      setI(idx);
      if (idx < text.length) {
        const next = speed + (Math.random() * jitter - jitter / 2);
        timer = window.setTimeout(tick, Math.max(30, next));
      }
    };

    let timer = window.setTimeout(tick, speed);
    return () => { alive = false; window.clearTimeout(timer); };
  }, [text, speed, jitter, prefReduce]);

  // видимый набираемый слой + «призрак» для фиксации размера
  return (
    <span className={`typewriter ${className}`} aria-label={ariaLabel ?? text}>
      <span className="typewriter__ghost" aria-hidden>{text}</span>
      <span className="typewriter__text">{text.slice(0, i)}</span>
      {/* курсор */}
      {i < text.length && <span className="typewriter__caret" aria-hidden />}
    </span>
  );
}

export default function LiamStory() {
  const rootRef = useRef<HTMLDivElement>(null);

  // ===== THEME (default: light) =====
  type Theme = "light" | "dark";
  const [theme, setTheme] = useState<Theme>(() => {
    const saved =
      (typeof window !== "undefined"
        ? localStorage.getItem("liamTheme")
        : null) as Theme | null;
    return saved ?? "light";
  });
  useEffect(() => { localStorage.setItem("liamTheme", theme); }, [theme]);
  const toggleTheme = () => setTheme((t) => (t === "light" ? "dark" : "light"));

  // ===== Reveal + light parallax =====
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            (e.target as HTMLElement).classList.add("is-inview");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.2 }
    );
    root.querySelectorAll<HTMLElement>(".reveal").forEach((el) => io.observe(el));

    const onScroll = () => {
      const y = window.scrollY * 0.25;
      root.style.setProperty("--hero-shift", `${y}px`);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className={`liam ${theme === "light" ? "liam--light" : "liam--dark"}`}
    >
      {/* Theme toggle */}
      <button
        type="button"
        className="theme-toggle"
        onClick={toggleTheme}
        aria-label={theme === "light" ? "Switch to dark theme" : "Switch to light theme"}
      >
        <span className="theme-toggle__knob" />
        <span className="theme-toggle__sun" aria-hidden>☀️</span>
        <span className="theme-toggle__moon" aria-hidden>🌙</span>
      </button>

      {/* ===== WELCOME (split) ===== */}
      <section className="liam__welcome">
        <div className="welcome__inner container">
          <div
            className="welcome__photo"
            role="img"
            aria-label="Portrait of Liam Dillon"
            style={{
              backgroundImage:
                'url("https://res.cloudinary.com/dzytbkc5l/image/upload/v1760984212/liam/68ee59cb1509a05d8708757d_main_Liam_ewlmpq.jpg")',
            }}
          />

          <div className="welcome__content">
            <span className="chip">Welcome</span>

            <h2 className="welcome__title">
              Welcome to coaching with <span className="accent">Liam Dillon</span>
            </h2>

            <p className="welcome__lead">
              My first introduction to mental fitness came through years in construction.
              What started as survival turned into purpose: helping people and crews find
              clarity, resilience, and growth.
            </p>

            {/* typing (JS) */}
            <div className="welcome__quote">
              <span className="quote-mark" aria-hidden>“</span>
              <Typewriter
                className="welcome__type"
                text={`For over 15 years, I’ve helped turn struggle into growth—so people can build not only projects, but fulfilling lives.`}
                speed={95}   // медленнее → увеличивай, например 110–130
                jitter={35}
                ariaLabel="For over 15 years, I’ve helped turn struggle into growth—so people can build not only projects, but fulfilling lives."
              />
            </div>
          </div>
        </div>
      </section>
      {/* ===== HERO ===== */}
      <section className="liam__hero">
        <div
          className="liam__hero-bg"
          style={{
            backgroundImage:
              'url("hhttps://res.cloudinary.com/dzytbkc5l/image/upload/v1760984212/liam/68ee59cb1509a05d8708757d_main_Liam_ewlmpq.jpg")',
          }}
          aria-hidden
        />
        <div className="liam__hero-glow" aria-hidden />
        <div className="liam__hero-inner reveal up">
          <p className="eyebrow">Liam Dillon — My Story</p>
          <h1 className="liam__title">
            From the trades to leadership. <br className="md" />
            From struggle to purpose.
          </h1>

          <div className="liam__badges">
            <span className="badge reveal up" style={{ animationDelay: "120ms" }}>
              15+ Years <em>in Construction</em>
            </span>
            <span className="badge reveal up" style={{ animationDelay: "220ms" }}>
              Red Seal <em>Refrigeration Mechanic</em>
            </span>
            <span className="badge reveal up" style={{ animationDelay: "320ms" }}>
              PMP <em>Project Manager</em>
            </span>
            <span className="badge reveal up" style={{ animationDelay: "420ms" }}>
              Advocate <em>Mental Health & Growth</em>
            </span>
          </div>
        </div>

        <div className="marquee" aria-hidden>
          <div className="marquee__track">
            <span>integrity • people first • quality • growth • purpose • </span>
            <span>integrity • people first • quality • growth • purpose • </span>
            <span>integrity • people first • quality • growth • purpose • </span>
          </div>
        </div>
      </section>

      {/* ===== INTRO ===== */}
      <section className="liam__intro">
        <div className="container">
          <p className="lead reveal up">
            My name is Liam Dillon and this is my story. I have been in the construction
            industry for over 15 years. I started out working as a warehouse helper for a
            commercial refrigeration company. After some time, I was offered the opportunity
            to sign up as a Refrigeration Mechanic apprentice. I completed my apprenticeship
            training and received my Refrigeration Mechanic Red Seal Certification. Through
            all this time, things never felt quite right. I was always searching for meaning
            and fulfillment in life—usually in all the wrong places.
          </p>
          <p className="lead reveal up">
            I bounced around multiple companies and experienced being laid off with no clue
            what to do. Eventually, I challenged the Project Management Professional exam,
            passed, and moved into leadership. Through those years I battled mental health
            and substance abuse issues. I was lost. My life fell apart as these problems
            took over. Luckily, I survived and rebuilt. Now I live a life beyond my wildest
            dreams—and I want to help others do the same. This is my purpose.
          </p>
        </div>
      </section>

      {/* ===== CHAPTERS ===== */}
      <section className="liam__chapters">
        <div className="container">
          <article className="chapter reveal fade">
            <div className="chapter__media">
              <div
                className="ph-img"
                style={{
                  backgroundImage:
                    'url("https://res.cloudinary.com/dzytbkc5l/image/upload/v1760984212/liam/68ee59cb1509a05d8708757d_main_Liam_ewlmpq.jpg")',
                }}
              />
            </div>
            <div className="chapter__content">
              <h3>Where I Started</h3>
              <p>
                I began as a warehouse helper in commercial refrigeration. I earned my Red
                Seal as a Refrigeration Mechanic and learned the trade on job sites—with
                real responsibility.
              </p>
            </div>
          </article>

          <article className="chapter chapter--rtl reveal fade">
            <div className="chapter__media">
              <div
                className="ph-img"
                style={{
                  backgroundImage:
                    'url("https://res.cloudinary.com/dzytbkc5l/image/upload/v1760984212/liam/68ee59cb1509a05d8708757d_main_Liam_ewlmpq.jpg")',
                }}
              />
            </div>
            <div className="chapter__content">
              <h3>Losing My Way</h3>
              <p>
                Layoffs, wrong turns, and battles with mental health and substance abuse
                left me lost. I learned that white-knuckling through pain isn’t strength—
                vulnerability and help are.
              </p>
            </div>
          </article>

          <article className="chapter reveal fade">
            <div className="chapter__media">
              <div
                className="ph-img"
                style={{
                  backgroundImage:
                    'url("https://res.cloudinary.com/dzytbkc5l/image/upload/v1760984212/liam/68ee59cb1509a05d8708757d_main_Liam_ewlmpq.jpg")',
                }}
              />
            </div>
            <div className="chapter__content">
              <h3>Rebuilding</h3>
              <p>
                I chose change. I pursued project management, passed the PMP, and shifted
                into leadership. Mentorship, structure, and accountability rebuilt my life
                and career.
              </p>
              <ul className="pill-grid">
                <li className="pill">Integrity</li>
                <li className="pill">People First</li>
                <li className="pill">Quality</li>
                <li className="pill">Growth</li>
              </ul>
            </div>
          </article>
        </div>
      </section>

      {/* ===== QUOTE ===== */}
      <section className="liam__quote reveal up">
        <div className="container">
          <blockquote>
            “I was working — <em>but I wasn’t fulfilled.</em>”
          </blockquote>
        </div>
      </section>

      {/* ===== CTA BOTTOM ===== */}
      <section className="liam__cta-bottom reveal up">
        <div className="container">
          <h3>Ready to build something meaningful?</h3>
          <p>Reach out—let’s talk about leadership, culture and healthier teams.</p>
          <div className="liam__cta">
            <a className="btn btn--primary" href="/#contact">
              Contact Liam
            </a>
            <a className="btn btn--ghost" href="/#services">
              See our services
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}