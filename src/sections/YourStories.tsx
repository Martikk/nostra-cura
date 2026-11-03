import SectionCarousel from "../components/SectionCarousel";
import type { CarouselSlide } from "../components/SectionCarousel";
const slides: CarouselSlide[] = [
  {
    "text": "\u201cMany professionals in construction face burnout and constant pressure. We step in by helping them set healthier boundaries, balance work and life, and rediscover pride in their craft. Our goal is to remind people they don\u2019t have to carry the weight alone.\u201d",
    "quote": true
  },
  {
    "text": "\u201cBehind every project are people who deserve to thrive, not just survive. We help professionals find stability, confidence, and tools for long-term success\u2014so they can focus on what truly matters: building a better life alongside building better structures.\u201d",
    "quote": true
  },
  {
    "text": "\u201cLeadership in construction requires more than technical expertise\u2014it requires empathy, awareness, and resilience. Our mission is to help leaders strengthen teams, prevent burnout, and create cultures where people feel valued and supported.\u201d",
    "quote": true
  }
];
export default function YourStories() {
 return <SectionCarousel id="stories" title="YOUR STORIES" background="https://res.cloudinary.com/dzytbkc5l/image/upload/v1760976796/liam/story_rmz1og.png" slides={slides} />;
}
