import { CardAction } from "../components/SectionCarousel";
import React, { useRef } from "react";
import "./Hero.css";

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);

  const onMove = (e: React.MouseEvent) => {
    const el = sectionRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;   // 0..1
    const y = (e.clientY - r.top) / r.height;   // 0..1
    el.style.setProperty("--mx", String((x - 0.5) * 2)); // -1..1
    el.style.setProperty("--my", String((y - 0.5) * 2)); // -1..1
  };

  return (
    <section id="home" className="hero" ref={sectionRef} onMouseMove={onMove}>
      <div className="hero__rays" aria-hidden="true" />
      <div className="hero__glow" aria-hidden="true" />
      <div className="hero__inner">
        <h1 className="hero__title">
          BUILDING BETTER<br />LIVES IN<br />CONSTRUCTION
        </h1>
        <p className="hero__subtitle">
          Helping individuals and teams navigate decisions,<br />
          responsibilities, and pressure with confidence.
        </p>
        <div className="hero__actions">
          <CardAction action={{ label: "Explore Services", href: "/#services" }} />
          <CardAction action={{ label: "Contact Us", href: "/#contact" }} />
        </div>
  </div>
    <div className="hero__tagline" aria-label="Slow Down. See Clearly. Live Better.">

    <span className="hero__tagline-line" />

    <span>Slow Down. See Clearly. Live Better.</span>

    <span className="hero__tagline-line" />

  </div>
    </section>
  );
}