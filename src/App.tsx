import React from "react";
import Navbar from "./components/layout/Navbar";
import Hero from "./sections/Hero";
import About from "./sections/About";
import Services from "./sections/Services";
import Team from "./sections/Team";
import YourStories from "./sections/YourStories";
import Contact from "./sections/Contact";
import Footer from "./components/layout/Footer";

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <section id="home"><Hero /></section>
        <section id="about"><About /></section>
        <section id="services"><Services /></section>
        <section id="team"><Team /></section>
        <section id="stories"><YourStories /></section>
        <section id="contact"><Contact /></section>
      </main>
      <Footer />
    </>
  );
}