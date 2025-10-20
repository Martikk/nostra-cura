import React from "react";
import "./Navbar.css";

export default function Navbar() {
  return (
    <header className="nav">
      <div className="nav__inner">
        {/* Блок 1: Лого + текст */}
        <a className="brand" href="/">
          <img
            className="brand__logo"
            src="https://res.cloudinary.com/dzytbkc5l/image/upload/v1760976794/liam/Logo_kp1mab.png"        // положи свой svg/png в /public или /src/assets и обнови путь
            alt="Nostra Cura logo"
            width={70}
            height={40}
          />
<img
            className="brand__logo_text"
            src="https://res.cloudinary.com/dzytbkc5l/image/upload/v1760976792/liam/image_hk1hq2.png"       
            alt="Nostra Cura logo"
            width={200}
            height={32}
          />
        </a>

        {/* Блок 2: Nav links */}
        <nav className="nav__links">
          <a href="#home">Home</a>
          <a href="#about">About</a>
          <a href="#services">Services</a>
          <a href="#team">Team</a>
          <a href="#stories">Stories</a>
          <a href="#contact">Contact</a>
        </nav>
      </div>
    </header>
  );
}