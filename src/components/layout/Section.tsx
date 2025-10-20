import React from "react";

type SectionProps = {
  id?: string;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  bgImage?: string; // url('/images/...') from public
  overlay?: boolean;
  className?: string;
  contentClassName?: string;
};

export const Section: React.FC<SectionProps> = ({
  id,
  title,
  subtitle,
  children,
  bgImage,
  overlay = false,
  className = "",
  contentClassName = "",
}) => (
  <section
    id={id}
    // scroll-mt ensures anchor links stop below the fixed navbar
    className={`relative w-full scroll-mt-24 py-16 md:py-24 ${bgImage ? "bg-cover bg-center" : ""} ${className}`}
    style={bgImage ? { backgroundImage: `url(${bgImage})` } : undefined}
  >
    {overlay && <div className="absolute inset-0 bg-black/40" />}
    <div className={`relative mx-auto max-w-6xl px-4 ${contentClassName}`}>
      {(title || subtitle) && (
        <header className="mb-10 max-w-3xl text-white drop-shadow">
          {subtitle && (
            <p className="text-sm uppercase tracking-widest opacity-90">{subtitle}</p>
          )}
          {title && <h2 className="mt-1 text-3xl font-extrabold md:text-4xl">{title}</h2>}
        </header>
      )}
      {children}
    </div>
  </section>
);
