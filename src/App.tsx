import { Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Hero from "./sections/Hero";
import About from "./sections/About";
import Services from "./sections/Services";
import Team from "./sections/Team";
import YourStories from "./sections/YourStories";
import Contact from "./sections/Contact";
import Footer from "./components/layout/Footer";
import LiamStory from "./pages/LiamStory";
import { useHashScroll } from "./hooks/useHashScroll";

export default function App() {
  // смещение под высоту навигации (подбери под свой header)
  useHashScroll(84);

  return (
    <>
      <Navbar />

      <Routes>
        {/* Главная */}
        <Route
          path="/"
          element={
            <>
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
          }
        />

        {/* Отдельная страница Liam */}
        <Route path="/liam" element={<LiamStory />} />
      </Routes>
    </>
  );
}