import SectionCarousel from "../components/SectionCarousel";
import type { CarouselSlide } from "../components/SectionCarousel";
const slides: CarouselSlide[] = [
  {
    "title": "Our Vision",
    "lead": "Better communities built by people in construction.",
    "text": "The construction industry helps shape the places where people live, work, and connect. Behind every project are individuals, families, teams, and businesses whose contributions extend far beyond the job site.\n\nWe believe that stronger communities begin with stronger people. When individuals and organizations are doing well, the benefits extend beyond their workplaces and into their homes and communities."
  },
  {
    "title": "Our Mission",
    "lead": "Helping individuals and teams navigate decisions, responsibilities, and pressure with confidence.",
    "text": "Working in construction comes with challenges that affect people both personally and professionally. Whether working in the field, managing projects, or running a business, the decisions we make and responsibilities we carry can have a significant impact on our lives.\n\nOur mission is to help individuals and teams develop the knowledge, skills, and confidence to manage these challenges more effectively."
  },
  {
    "title": "What We Do",
    "lead": "Practical consulting for individuals and teams in construction.",
    "text": "Nostra Cura Consulting Group Inc. works with individuals, teams, and businesses throughout the construction industry. We provide consulting services focused on personal development, leadership, workplace challenges, and everyday decision-making.\n\nThrough one-on-one conversations, group discussions, and structured workbooks, we help people identify challenges, develop practical tools and systems, and find ways to improve how they work, lead, and manage their responsibilities."
  }
];
export default function About() {
 return <SectionCarousel id="about" title="ABOUT US" background="https://res.cloudinary.com/dzytbkc5l/image/upload/v1760976788/liam/2nd_dag9lb.png" slides={slides} />;
}
