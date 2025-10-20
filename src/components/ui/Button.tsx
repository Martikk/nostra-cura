import React from "react";

export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({
  className = "",
  children,
  ...props
}) => (
  <button
    className={`rounded-2xl px-5 py-2 text-sm font-semibold shadow-md ring-1 ring-black/10 transition hover:-translate-y-px hover:shadow-lg active:translate-y-0 ${className}`}
    {...props}
  >
    {children}
  </button>
);