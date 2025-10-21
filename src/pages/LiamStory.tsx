import { useEffect, useRef, useState } from "react";
import Footer from "../components/layout/Footer";
import "./LiamStory.css";
import { Toaster, toast } from 'react-hot-toast';

/* === Typewriter (без дёрганья макета) === */
function Typewriter({
  text,
  speed = 95,
  jitter = 35,
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
  const prefReduce =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    if (prefReduce) {
      setI(text.length);
      return;
    }
    let idx = 0;
    let alive = true;
    let timer = 0 as unknown as number;

    const tick = () => {
      if (!alive) return;
      idx = Math.min(idx + 1, text.length);
      setI(idx);
      if (idx < text.length) {
        const next = speed + (Math.random() * jitter - jitter / 2);
        timer = window.setTimeout(tick, Math.max(30, next)) as unknown as number;
      }
    };

    timer = window.setTimeout(tick, speed) as unknown as number;
    return () => {
      alive = false;
      window.clearTimeout(timer);
    };
  }, [text, speed, jitter, prefReduce]);

  return (
    <span className={`typewriter ${className}`} aria-label={ariaLabel ?? text}>
      <span className="typewriter__ghost" aria-hidden>
        {text}
      </span>
      <span className="typewriter__text">{text.slice(0, i)}</span>
      {i < text.length && <span className="typewriter__caret" aria-hidden />}
    </span>
  );
}

/* === Магнитные бейджи/пиллы — отключаем на тач, оптимизируем через rAF === */
function useMagnetic() {
  // детектим «наведение мышью» (десктопы/стилусы с hover)
  const hoverCapable =
    typeof window !== "undefined" &&
    window.matchMedia?.("(hover: hover) and (pointer: fine)").matches;

  // тач-девайсы: возвращаем no-op, чтобы не блокировать скролл
  if (!hoverCapable) {
    return {
      onMove: () => {},
      onLeave: () => {},
    };
  }

  let raf = 0;
  const onMove = (e: React.PointerEvent<HTMLElement>) => {
    const el = e.currentTarget as HTMLElement;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      el.style.setProperty("--x", `${x}px`);
      el.style.setProperty("--y", `${y}px`);
      const mx = (x / rect.width - 0.5) * 2; // -1..1
      const my = (y / rect.height - 0.5) * 2;
      el.style.setProperty("--mx", `${mx}`);
      el.style.setProperty("--my", `${my}`);
    });
  };

  const onLeave = (e: React.PointerEvent<HTMLElement>) => {
    const el = e.currentTarget as HTMLElement;
    el.style.removeProperty("--x");
    el.style.removeProperty("--y");
    el.style.removeProperty("--mx");
    el.style.removeProperty("--my");
  };

  return { onMove, onLeave };
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
  useEffect(() => {
    localStorage.setItem("liamTheme", theme);
  }, [theme]);
  const toggleTheme = () => setTheme((t) => (t === "light" ? "dark" : "light"));

  // ===== Reveal + parallax =====
  useEffect(() => {
    const root = rootRef.current;
    if (!root || typeof window === "undefined") return;

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

  const magnet = useMagnetic();

  // ===== форма =====
  const [sent, setSent] = useState(false);
  // const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   const fd = new FormData(e.currentTarget);
  //   const name = String(fd.get("name") || "").trim();
  //   const email = String(fd.get("email") || "").trim();
  //   const message = String(fd.get("message") || "").trim();
  //   if (!name || !email || !message) {
  //     alert("Please fill in Name, Email and Message.");
  //     return;
  //   }
  //   // TODO: отправка на ваш бэкенд / Netlify Forms
  //   setSent(true);
  //   (e.currentTarget as HTMLFormElement).reset();
  // };

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
        <span className="theme-toggle__sun" aria-hidden>
          ☀️
        </span>
        <span className="theme-toggle__moon" aria-hidden>
          🌙
        </span>
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

            <div className="welcome__quote">
              <span className="quote-mark" aria-hidden>
                “
              </span>
              <Typewriter
                className="welcome__type"
                text={`For over 15 years, I’ve helped turn struggle into growth—so people can build not only projects, but fulfilling lives.`}
                speed={110}
                jitter={25}
                ariaLabel="For over 15 years, I’ve helped turn struggle into growth—so people can build not only projects, but fulfilling lives."
              />
            </div>
          </div>
        </div>
      </section>

      {/* ===== HERO ===== */}
      <section className="liam__hero" style={{ minHeight: "380px" }}>
        <div className="liam__hero-bg" aria-hidden />
        <div className="liam__hero-glow" aria-hidden />
        <div className="liam__hero-inner reveal up">
          <p className="eyebrow">Liam Dillon — My Story</p>
          <h1 className="liam__title">
            From the trades to leadership. <br className="md" />
            From struggle to purpose.
          </h1>

          <div className="liam__badges">
            <button
              type="button"
              className="badge is-magnetic"
              onPointerMove={magnet.onMove}
              onPointerLeave={magnet.onLeave}
              aria-label="15+ Years in Construction"
            >
              15+ Years <em>in Construction</em>
            </button>
            <button
              type="button"
              className="badge is-magnetic"
              onPointerMove={magnet.onMove}
              onPointerLeave={magnet.onLeave}
              aria-label="Red Seal Refrigeration Mechanic"
            >
              Red Seal <em>Refrigeration Mechanic</em>
            </button>
            <button
              type="button"
              className="badge is-magnetic"
              onPointerMove={magnet.onMove}
              onPointerLeave={magnet.onLeave}
              aria-label="PMP Project Manager"
            >
              PMP <em>Project Manager</em>
            </button>
            <button
              type="button"
              className="badge is-magnetic"
              onPointerMove={magnet.onMove}
              onPointerLeave={magnet.onLeave}
              aria-label="Advocate Mental Health and Growth"
            >
              Advocate <em>Mental Health & Growth</em>
            </button>
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
                {["Integrity", "People First", "Quality", "Growth"].map((v) => (
                  <li key={v}>
                    <button
                      type="button"
                      className="pill is-magnetic"
                      onPointerMove={magnet.onMove}
                      onPointerLeave={magnet.onLeave}
                      aria-label={v}
                    >
                      {v}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </article>
        </div>
      </section>

      {/* ===== QUOTE ===== */}
      <section className="liam__quote liam__quote--plain reveal up">
        <div className="container">
          <blockquote>“I was working — <em>but I wasn’t fulfilled.</em>”</blockquote>
        </div>
      </section>

      {/* ===== CONTACT ===== */}
      <section className="liam__contact" id="contact-liam">
        <div className="container">
          <h3>Contact Liam</h3>
          <p className="contact__sub">Tell me a little about you and how I can help.</p>

          {sent ? (
            <div className="contact__success" role="status">
              Thanks! Your message has been sent. I’ll get back to you shortly.
            </div>
          ) : (
            // <form className="contact__form" onSubmit={onSubmit} noValidate>
            //   <div className="field">
            //     <label htmlFor="name">Name*</label>
            //     <div className="input-wrap">
            //       <input id="name" name="name" type="text" required placeholder="Your name" />
            //     </div>
            //   </div>

            //   <div className="field two">
            //     <div className="field">
            //       <label htmlFor="email">Email*</label>
            //       <div className="input-wrap">
            //         <input id="email" name="email" type="email" required placeholder="you@example.com" />
            //       </div>
            //     </div>
            //     <div className="field">
            //       <label htmlFor="phone">Phone</label>
            //       <div className="input-wrap">
            //         <input id="phone" name="phone" type="tel" placeholder="+1 (555) 000-0000" />
            //       </div>
            //     </div>
            //   </div>

            //   <div className="field">
            //     <label htmlFor="message">How can I help?*</label>
            //     <div className="input-wrap textarea">
            //       <textarea id="message" name="message" required placeholder="Write your text here" rows={6} />
            //     </div>
            //   </div>

            //   <div className="actions">
            //     <button type="submit" className="btn btn--primary">
            //       Send
            //     </button>
            //     <a className="btn btn--ghost" href="/#services">
            //       See our services
            //     </a>
            //   </div>
            // </form>

<form
  name="contact-liam"
  method="POST"
  data-netlify="true"
  data-netlify-honeypot="bot-field"
  className="contact__form"
  onSubmit={async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);

    // валидация перед отправкой
    const name = fd.get('name')?.toString().trim();
    const email = fd.get('email')?.toString().trim();
    const message = fd.get('message')?.toString().trim();
    if (!name || !email || !message) {
      toast.error('Please fill in all required fields.');
      return;
    }

    toast.loading('Sending...');

    try {
      // ОБЯЗАТЕЛЬНО для Netlify Forms
      fd.append('form-name', 'contact-liam');

      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(fd as any).toString(),
      });

      toast.dismiss();
      if (!res.ok) throw new Error('Submit failed');

      toast.success('Message sent successfully!');
      setSent(true);
      form.reset();
    } catch (err) {
      toast.dismiss();
      toast.error('Failed to send. Try again later.');
    }
  }}
  noValidate
>
  {/* honeypot для антиспама */}
  <p hidden>
    <label>Don’t fill this out: <input name="bot-field" /></label>
  </p>

  <div className="field">
    <label htmlFor="name">Name*</label>
    <div className="input-wrap">
      <input id="name" name="name" type="text" required placeholder="Your name" />
    </div>
  </div>

  <div className="field two">
    <div className="field">
      <label htmlFor="email">Email*</label>
      <div className="input-wrap">
        <input id="email" name="email" type="email" required placeholder="you@example.com" />
      </div>
    </div>
    <div className="field">
      <label htmlFor="phone">Phone</label>
      <div className="input-wrap">
        <input id="phone" name="phone" type="tel" placeholder="+1 (555) 000-0000" />
      </div>
    </div>
  </div>

  <div className="field">
    <label htmlFor="message">How can I help?*</label>
    <div className="input-wrap textarea">
      <textarea id="message" name="message" required placeholder="Write your text here" rows={6} />
    </div>
  </div>

  {/* скрытое имя формы (дублируем для надёжности) */}
  <input type="hidden" name="form-name" value="contact-liam" />

  {/* reCAPTCHA — ОБЯЗАТЕЛЬНО перед кнопками */}
  <div data-netlify-recaptcha="true"></div>

  <div className="actions">
    <button type="submit" className="btn btn--primary">Send</button>
    <a className="btn btn--ghost" href="/#services">See our services</a>
  </div>
</form>

          )}
        </div>
      </section>
<Toaster position="top-right" />
      <Footer />
    </div>
  );
}