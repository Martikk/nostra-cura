import React, { useRef } from "react";
import "./Hero.css";

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);

  const onMove = (e: React.MouseEvent) => {
    const el = sectionRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;   // 0..1
    const y = (e.clientY - rect.top) / rect.height;   // 0..1
    // нормируем в -1..1
    const mx = (x - 0.5) * 2;
    const my = (y - 0.5) * 2;
    el.style.setProperty("--mx", String(mx));
    el.style.setProperty("--my", String(my));
  };

  return (
    <section id="home" className="hero" ref={sectionRef} onMouseMove={onMove}>
      {/* Живые лучи и мягкое свечение */}
      <div className="hero__rays" aria-hidden="true" />
      <div className="hero__glow" aria-hidden="true" />

      <div className="hero__inner">
        <h1 className="hero__title" tabIndex={0}>
          BUILDING BETTER<br />LIVES IN<br />CONSTRUCTION
        </h1>

        <p className="hero__subtitle">
          Helping construction professionals thrive, find<br />
          balance, and enjoy a healthier life.
        </p>
      </div>
    </section>
  );
}