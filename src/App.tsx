import React from "react";
import Navbar from "./components/layout/Navbar";
import Hero from "./sections/Hero";
import "./App.css";

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        {/* ниже можешь добавлять остальные секции */}
        <section style={{ height: "120vh", background: "#0b0e12" }} />
      </main>
    </>
  );
}