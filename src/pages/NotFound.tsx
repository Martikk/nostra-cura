import "./NotFound.css";

export default function NotFound() {
  return (
    <main className="nf">
      {/* мягкий фон + анимация частиц */}
      <div className="nf__bg" aria-hidden />
      <div className="nf__stars" aria-hidden />

      <section className="nf__card container">
        <div className="nf__eyebrow">Oops…</div>

        <h1 className="nf__title">
          <span className="nf__num">4</span>
          <span className="nf__zero">
            {/* маленькая иллюстрация (инлайн SVG) */}
            <svg viewBox="0 0 120 120" className="nf__svg" aria-hidden>
              <defs>
                <linearGradient id="g" x1="0" x2="1">
                  <stop offset="0" stopColor="#fff" />
                  <stop offset="1" stopColor="#dfe9ff" />
                </linearGradient>
              </defs>
              <circle cx="60" cy="60" r="52" fill="url(#g)" opacity="0.12" />
              <path d="M30 70c20-8 40-8 60 0" stroke="url(#g)" strokeWidth="6" fill="none" opacity=".6"/>
              <circle cx="44" cy="50" r="6" fill="#fff"/>
              <circle cx="76" cy="50" r="6" fill="#fff"/>
            </svg>
          </span>
          <span className="nf__num">4</span>
        </h1>

        <p className="nf__lead">
          The page you’re looking for doesn’t exist or moved.
        </p>

        <div className="nf__actions">
          <a className="btn btn--primary" href="/">Go home</a>
          <a className="btn btn--ghost" href="/#contact">Contact Liam</a>
        </div>

        <div className="nf__hint">
          Tip: you can also use the navigation above to find what you need.
        </div>
      </section>
    </main>
  );
}