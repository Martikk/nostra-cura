import React from "react";
import Navbar from "./components/layout/Navbar";
import Hero from "./sections/Hero";
import About from "./sections/About";
import "./App.css";
import Services from "./sections/Services";
import Team from "./sections/Team";
import YourStories from "./sections/YourStories";
import Footer from "./components/layout/Footer";
import { ErrorBoundary } from "./components/ErrorBoundary";
import Contact
 from "./sections/Contact";
export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <ErrorBoundary>
          <Services />
        </ErrorBoundary>
        <Team />
        <YourStories />
        <Contact />
        <Footer />
      </main>
    </>
  );
}