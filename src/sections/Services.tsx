import SectionCarousel from "../components/SectionCarousel";
import type { CarouselSlide } from "../components/SectionCarousel";
const slides: CarouselSlide[] = [
  {
    "title": "Individuals",
    "lead": "Practical support for personal and professional challenges.",
    "text": "Everyone faces challenges in their personal and professional lives. Whether you're dealing with work pressures, important decisions, personal responsibilities, or uncertainty about what comes next, having someone to talk things through with can help.\n\nWe work one-on-one with individuals to understand their circumstances, identify challenges, and develop practical tools and strategies to help them make informed decisions and manage their responsibilities.",
    "action": {
      "label": "Contact Us",
      "href": "/#contact"
    }
  },
  {
    "title": "Teams",
    "lead": "Helping teams and businesses work better together.",
    "text": "Managing people and running a business comes with challenges. Communication, leadership, workplace relationships, competing priorities, and daily responsibilities all influence how a team performs.\n\nWe work with businesses and their teams to identify areas for improvement, strengthen communication, clarify responsibilities, and develop practical tools and systems that support better day-to-day operations and a healthier, more productive working environment.",
    "action": {
      "label": "Contact Us",
      "href": "/#contact"
    }
  },
  {
    "title": "Workbooks",
    "lead": "Practical tools for personal and professional development.",
    "text": "Our workbooks provide a structured approach to working through personal and professional challenges. Each workbook is organized into eight sessions with straightforward questions, exercises, and practical tools that help people better understand their circumstances, responsibilities, and goals.\n\nDesigned for everyday use, they can be completed independently or alongside our consulting services, giving individuals and teams the flexibility to work at their own pace.",
    "action": {
      "label": "Ask About Workbooks",
      "href": "/#contact"
    }
  }
];
export default function Services() {
 return <SectionCarousel id="services" title="OUR SERVICES" background="https://res.cloudinary.com/dzytbkc5l/image/upload/v1760976795/liam/Services_xctjkn.jpg" slides={slides} />;
}
