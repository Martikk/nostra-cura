import Seo from "./components/Seo";
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
import NotFound from "./pages/NotFound";

export default function App() {
  // смещение под высоту навигации (подбери под свой header)
  useHashScroll();

  return (
    <>
      <Seo />
      <a className="skip-link" href="#main-content">Skip to content</a>
      <Navbar />

      <Routes>
        {/* Главная */}
        <Route
          path="/"
          element={
            <>
              <main id="main-content">
                <Hero />
                <About />
                <Services />
                <Team />
                <YourStories />
                <Contact />
              </main>
              <Footer />
            </>
          }
        />

        {/* Отдельная страница Liam */}
        <Route path="/liam" element={<LiamStory />} />
          <Route path="*" element={<NotFound />} />   {/* ← сюда */}
      </Routes>
    </>
  );
}