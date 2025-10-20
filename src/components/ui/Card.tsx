import React from "react";

export const Card: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className = "",
  children,
  ...props
}) => (
  <div
    className={`rounded-2xl bg-white/90 backdrop-blur shadow-xl ring-1 ring-black/5 ${className}`}
    {...props}
  >
    {children}
  </div>
);
