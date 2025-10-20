import React, { useEffect, useRef, useState } from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaXTwitter,
  FaYoutube,
  FaTiktok,
} from "react-icons/fa6";
import "./Footer.css";

export default function Footer() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <footer
      ref={ref}
      className={`footer ${visible ? "footer--visible" : ""}`}
    >
      {/* светящаяся линия */}
      <div className="footer__topline" aria-hidden="true" />

      <div className="footer__inner">
        {/* БРЕНД */}
        <a className="brand brand--footer" href="/" aria-label="Nostra Cura home">
          <img
            className="brand__mark"
            src="https://res.cloudinary.com/dzytbkc5l/image/upload/v1760976794/liam/Logo_kp1mab.png"
            alt=""
            width={56}
            height={32}
            loading="lazy"
            decoding="async"
          />
          <img
            className="brand__wordmark"
            src="https://res.cloudinary.com/dzytbkc5l/image/upload/v1760976792/liam/image_hk1hq2.png"
            alt="NOSTRA CURA — Consulting Group"
            width={220}
            height={32}
            loading="lazy"
            decoding="async"
          />
        </a>

        {/* СОЦСЕТИ */}
        <nav className="social" aria-label="Social links">
          <a
            className="social__link"
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
          >
            <FaFacebookF />
          </a>
          <a
            className="social__link"
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
          >
            <FaInstagram />
          </a>
          <a
            className="social__link"
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="X (Twitter)"
          >
            <FaXTwitter />
          </a>
          <a
            className="social__link"
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="YouTube"
          >
            <FaYoutube />
          </a>
          <a
            className="social__link"
            href="https://tiktok.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="TikTok"
          >
            <FaTiktok />
          </a>
        </nav>
      </div>
    </footer>
  );
}