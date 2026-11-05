import ContactSuccess from "../components/ContactSuccess";
import { submitContact } from "../contact";
import { FiMail, FiUsers, FiSend, FiLock } from "react-icons/fi";
import { useEffect, useRef, useState } from "react";
import Footer from "../components/layout/Footer";
import "./LiamStory.css";
import { Toaster, toast } from 'react-hot-toast';

/* === Магнитные бейджи/пиллы — отключаем на тач, оптимизируем через rAF === */
function useMagnetic() {

  const hoverCapable =
    typeof window !== "undefined" &&
    window.matchMedia?.("(hover: hover) and (pointer: fine)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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
  const rootRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const marquee=rootRef.current?.querySelector(".marquee");
    if (!marquee) return;
    const observer=new IntersectionObserver(([entry])=>marquee.classList.toggle("is-visible",entry.isIntersecting));
    observer.observe(marquee); return ()=>observer.disconnect();
  }, []);


  type Theme = "light" | "dark";
  const [theme, setTheme] = useState<Theme>("light");
  useEffect(() => {
    try { const saved = localStorage.getItem("liamTheme"); if (saved === "dark" || saved === "light") setTheme(saved); } catch { /* Storage may be unavailable. */ }
  }, []);
  const toggleTheme = () => setTheme((t) => {
    const next = t === "light" ? "dark" : "light";
    try { localStorage.setItem("liamTheme", next); } catch { /* Theme still works without storage. */ }
    return next;
  });



  const magnet = useMagnetic();

  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  return (
    <main
      id="main-content"
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
<div className="welcome__photo">
  <img
    src="https://res.cloudinary.com/dzytbkc5l/image/upload/f_auto,q_auto,w_700,dpr_auto/liam/68ee59cb1509a05d8708757d_main_Liam_ewlmpq.jpg"
    srcSet="
      https://res.cloudinary.com/dzytbkc5l/image/upload/f_auto,q_auto,w_480,dpr_auto/liam/68ee59cb1509a05d8708757d_main_Liam_ewlmpq.jpg 480w,
      https://res.cloudinary.com/dzytbkc5l/image/upload/f_auto,q_auto,w_700,dpr_auto/liam/68ee59cb1509a05d8708757d_main_Liam_ewlmpq.jpg 700w,
      https://res.cloudinary.com/dzytbkc5l/image/upload/f_auto,q_auto,w_980,dpr_auto/liam/68ee59cb1509a05d8708757d_main_Liam_ewlmpq.jpg 980w
    "
    sizes="(max-width: 980px) 60vw, 520px"
    alt="Liam Dillon portrait"
    fetchPriority="high"
    width={700}
    height={1050}
    loading="eager"
    decoding="async"
  />
</div>

          <div className="welcome__content">
            <span className="chip">Welcome</span>

            <h1 className="welcome__title">
              Meet <span className="accent">Liam Dillon</span>
            </h1>

            <p className="welcome__lead">I've spent over 15 years working in the construction industry, starting in the trades and eventually moving into project management and leadership.</p>
            <p className="welcome__lead">Along the way, I've experienced professional success, personal struggles, setbacks, and new beginnings. Those experiences have taught me that building a successful career or business means very little if we lose sight of the people behind it.</p>
            <p className="welcome__lead">That's why I founded Nostra Cura Consulting Group Inc. — to bring together my professional experience, personal lessons, and belief that we can build better businesses while building better lives.</p>
          </div>
        </div>
      </section>

      {/* ===== HERO ===== */}
      <section className="liam__hero" style={{ minHeight: "380px" }}>
        <div className="liam__hero-bg" aria-hidden />
        <div className="liam__hero-glow" aria-hidden />
        <div className="liam__hero-inner reveal up">
          <p className="eyebrow">Liam Dillon — My Story</p>
          <h2 className="liam__title">
            From the trades to leadership. <br className="md" />
            A different perspective on success.
          </h2>

          <div className="liam__badges">
            <span
              className="badge is-magnetic"
              onPointerMove={magnet.onMove}
              onPointerLeave={magnet.onLeave}
            >
              15+ Years <em>in Construction</em>
            </span>
            <span
              className="badge is-magnetic"
              onPointerMove={magnet.onMove}
              onPointerLeave={magnet.onLeave}
            >
              Red Seal Endorsed <em>Refrigeration Mechanic</em>
            </span>
            <span
              className="badge is-magnetic"
              onPointerMove={magnet.onMove}
              onPointerLeave={magnet.onLeave}
            >
              PMP Certified <em>Project Manager</em>
            </span>
            <span
              className="badge is-magnetic"
              onPointerMove={magnet.onMove}
              onPointerLeave={magnet.onLeave}
            >
              Founder &amp; Consultant <em>NCCG Inc.</em>
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
<p className="lead">One thing I've learned over the years is that everyone has a story. We all experience challenges, make mistakes, learn lessons, and find our own way forward.</p>
<p className="lead">I've worked alongside some incredible people and seen firsthand how much leadership, workplace culture, and the decisions we make can affect our lives, both professionally and personally.</p>
<p className="lead">I believe good business doesn't need to be complicated, and good leadership doesn't need to be intimidating. It starts with treating people well, communicating honestly, taking responsibility, and continually looking for ways to improve.</p>
<p className="lead">These are the principles I believe in, the values I try to live by, and the foundation of Nostra Cura Consulting Group Inc.</p>

        </div>
      </section>

      {/* ===== CHAPTERS ===== */}
      <section className="liam__chapters">
        <div className="container">
          <article className="chapter reveal fade">
<div className="chapter__media">
<img
  width={1000}
  height={1500}
  className="ph-img"
  src="https://res.cloudinary.com/dzytbkc5l/image/upload/f_auto,q_auto,w_640/liam/68ee59cb0deae2deb8dba77b_2_Liam_bwumbk.jpg"
  srcSet="
    https://res.cloudinary.com/dzytbkc5l/image/upload/f_auto,q_auto,w_400/liam/68ee59cb0deae2deb8dba77b_2_Liam_bwumbk.jpg 400w,
    https://res.cloudinary.com/dzytbkc5l/image/upload/f_auto,q_auto,w_640/liam/68ee59cb0deae2deb8dba77b_2_Liam_bwumbk.jpg 640w,
    https://res.cloudinary.com/dzytbkc5l/image/upload/f_auto,q_auto,w_900/liam/68ee59cb0deae2deb8dba77b_2_Liam_bwumbk.jpg 900w
  "
  sizes="(max-width:700px) calc(100vw - 56px), 360px"
  alt=""
  loading="lazy"
  decoding="async"
/>
</div>
            <div className="chapter__content">
              <h2>Where I Started</h2><p>I started my career as a warehouse helper in commercial refrigeration before becoming a Red Seal Refrigeration Mechanic. Working in the trades gave me an appreciation for hard work, practical problem-solving, and the people who keep our industry moving.</p><p>Those early years also gave me firsthand experience with the challenges, responsibilities, and pressures that come with working in construction.</p>
            </div>
          </article>

          <article className="chapter chapter--rtl reveal fade">
<div className="chapter__media">
  <img
    width={748}
    height={1123}
  className="ph-img"
    src="https://res.cloudinary.com/dzytbkc5l/image/upload/f_auto,q_auto,w_640/v1761063637/liam/68ee810d5b386ba479b80e09_homepage_luwtfx.jpg"
    srcSet="
      https://res.cloudinary.com/dzytbkc5l/image/upload/f_auto,q_auto,w_400/v1761063637/liam/68ee810d5b386ba479b80e09_homepage_luwtfx.jpg 400w,
      https://res.cloudinary.com/dzytbkc5l/image/upload/f_auto,q_auto,w_640/v1761063637/liam/68ee810d5b386ba479b80e09_homepage_luwtfx.jpg 640w,
      https://res.cloudinary.com/dzytbkc5l/image/upload/f_auto,q_auto,w_900/v1761063637/liam/68ee810d5b386ba479b80e09_homepage_luwtfx.jpg 900w
    "
    sizes="(max-width:700px) calc(100vw - 56px), 360px"
    alt=""
    loading="lazy"
    decoding="async"
  />
</div>
            <div className="chapter__content">
              <h2>Lessons Along the Way</h2><p>My career and personal life haven't always followed a straight path. I've experienced successes, setbacks, and plenty of lessons along the way.</p><p>Through those experiences, I've learned the importance of asking for help, taking responsibility, and being willing to make changes. They've also shaped how I approach challenges, work with people, and understand the pressures we all face in our professional and personal lives.</p>
            </div>
          </article>

          <article className="chapter reveal fade">
<div className="chapter__media">
  <img
    width={748}
    height={965}
  className="ph-img"
    src="https://res.cloudinary.com/dzytbkc5l/image/upload/f_auto,q_auto,w_640/v1761063637/liam/68ee59cbcdffd92983de6047_4_Liam_nzuwny.jpg"
    srcSet="
      https://res.cloudinary.com/dzytbkc5l/image/upload/f_auto,q_auto,w_400/v1761063637/liam/68ee59cbcdffd92983de6047_4_Liam_nzuwny.jpg 400w,
      https://res.cloudinary.com/dzytbkc5l/image/upload/f_auto,q_auto,w_640/v1761063637/liam/68ee59cbcdffd92983de6047_4_Liam_nzuwny.jpg 640w,
      https://res.cloudinary.com/dzytbkc5l/image/upload/f_auto,q_auto,w_900/v1761063637/liam/68ee59cbcdffd92983de6047_4_Liam_nzuwny.jpg 900w
    "
    sizes="(max-width:700px) calc(100vw - 56px), 360px"
    alt=""
    loading="lazy"
    decoding="async"
  />
</div>
            <div className="chapter__content">
              <h2>A Different Perspective</h2><p>Moving from the trades into project management and leadership gave me a different perspective on the construction industry. I've seen firsthand how the decisions we make as leaders affect not only the success of a business, but also the people working within it. I believe that building successful organizations and supporting the people behind them are equally important.</p><p>I believe we can do better at both.</p>

            </div>
          </article>
        </div>
      </section>

      {/* ===== QUOTE ===== */}
      <section className="liam__quote liam__quote--plain reveal up">
        <div className="container">
          <blockquote>“Success means more when the people behind it are doing well.”</blockquote>
        </div>
      </section>

      {/* ===== CONTACT ===== */}
      <section className="liam__contact" id="contact-liam">
        <div className="contactcard">
          <div className="contactcard__info">
            <h2>Contact Liam</h2>
            <p>Have a question, an idea, or something you'd like to discuss? I'd be happy to hear from you.</p>
            <div className="contactcard__email-row"><span className="contactcard__icon"><FiMail aria-hidden="true" /></span><div><h3>Email</h3><a className="contactcard__email" href="mailto:liam@nccg.ca">liam@nccg.ca</a></div></div>
            <div className="contactcard__welcome"><FiUsers aria-hidden="true" /><div><p>I value every conversation and will respond as soon as possible.</p><strong>Thank you for reaching out.</strong></div></div>
          </div>
          <div className="liam-contact__fields">

          {sent ? (
            <ContactSuccess personal onReset={() => setSent(false)} />
          ) : (

<form
  name="contact-liam"
  method="POST"
  data-netlify="true"
  data-netlify-honeypot="bot-field"
  className="contactcard__form"
  onSubmit={async (e) => {
    e.preventDefault();
    if (sending) return;
    const form = e.currentTarget;
    const fd = new FormData(form);

    const name = fd.get('name')?.toString().trim();
    const email = fd.get('email')?.toString().trim();
    const message = fd.get('message')?.toString().trim();
    if (!name || !email || !message) {
      toast.error('Please fill in all required fields.');
      return;
    }

    setSending(true);
    toast.loading('Sending...');

    try {

      fd.set('form-name', 'contact-liam');

      await submitContact(new URLSearchParams(Array.from(fd.entries(), ([key, value]) => [key, String(value)])).toString());
      toast.dismiss();

      setSent(true);
      form.reset();
    } catch (error) {
      toast.dismiss();
      toast.error(error instanceof Error ? error.message : 'Failed to send. Try again later.');
    } finally {
      setSending(false);
    }
  }}
>
  {/* honeypot для антиспама */}
  <p hidden>
    <label>Don’t fill this out: <input name="bot-field" /></label>
  </p>

  <label htmlFor="name">Name*
    <input id="name" name="name" type="text" autoComplete="name" enterKeyHint="next" required placeholder="Your name" />
  </label>
  <label htmlFor="phone">Phone
    <input id="phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" enterKeyHint="next" placeholder="Your phone number" />
  </label>
  <label htmlFor="email">Email Address*
    <input id="email" name="email" type="email" inputMode="email" autoComplete="email" enterKeyHint="next" required placeholder="Your email address" />
  </label>
  <label htmlFor="message">What would you like to discuss?*
    <textarea id="message" name="message" required placeholder="Tell me a little about what you’re looking for..." rows={4} />
  </label>

  {/* скрытое имя формы (дублируем для надёжности) */}
  <input type="hidden" name="form-name" value="contact-liam" />

  <button type="submit" disabled={sending} className="btn btn--submit"><FiSend aria-hidden="true" />{sending ? "Sending..." : "Send Message"}</button>
  <p className="contactcard__privacy"><FiLock aria-hidden="true" />We use your details to respond to your enquiry. <a href="/privacy/">Privacy Policy</a>.</p>
</form>

          )}
          </div>
        </div>
      </section>
<Toaster position="top-right" />
      <Footer />
    </main>
  );
}
