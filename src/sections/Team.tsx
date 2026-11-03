import SectionCarousel from "../components/SectionCarousel";
import type { CarouselSlide } from "../components/SectionCarousel";
const slides: CarouselSlide[] = [
 { title: "Liam Dillon", lead: "Founder & Consultant", image: "https://res.cloudinary.com/dzytbkc5l/image/upload/f_auto,q_auto,w_440/liam/68ee59cb1509a05d8708757d_main_Liam_ewlmpq.jpg", imageAlt: "Liam Dillon portrait", action: {label:"Read Liam’s Story",href:"/liam/"} },
 { title: "Join our team", text: "We’re always looking for dedicated people to grow with us. If you’re passionate about helping people and want to build a better future, let’s connect.", action: {label:"Contact Us",href:"/#contact"} }
];
export default function Team() {
 return <SectionCarousel id="team" title="OUR TEAM" background="https://res.cloudinary.com/dzytbkc5l/image/upload/v1760976790/liam/4rd_p8hq1m.png" slides={slides} />;
}
