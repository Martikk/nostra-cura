import { flushSync } from "react-dom";
import { useEffect, useId, useRef, useState } from "react";
import "./SectionCarousel.css";

export type CarouselSlide = {
 title?: string; lead?: string; text?: string; image?: string; imageAlt?: string;
 quote?: boolean; action?: { label: string; href: string };
};
function Chevron({ back = false }: { back?: boolean }) {
 return <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><path d={back ? "m15 5-7 7 7 7" : "m9 5 7 7-7 7"} /></svg>;
}
export function CardAction({ action }: { action: NonNullable<CarouselSlide["action"]> }) {
 return <a className="nc-action" href={action.href}>{action.label}</a>;
}
export default function SectionCarousel({ id, title, background, slides }: {
 id: string; title: string; background: string; slides: CarouselSlide[];
}) {
 const [index, setIndex] = useState(0);
 const stageRef = useRef<HTMLDivElement>(null);
 const animation = useRef<Animation | null>(null);
 const requestedIndex = useRef(0);
 const swapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
 useEffect(() => () => { if (swapTimer.current) clearTimeout(swapTimer.current); animation.current?.cancel(); }, []);
 const uid = useId();
 const pointer = useRef<{x:number;y:number} | null>(null);
 const change = (next: number, dir: number, keyboard = false) => {
   const target = (next + slides.length) % slides.length;
   requestedIndex.current = target;
   const frame = stageRef.current;
   const start = frame ? getComputedStyle(frame).transform : "none";
   const startOpacity = frame ? getComputedStyle(frame).opacity : "1";
   if (swapTimer.current) clearTimeout(swapTimer.current);
   animation.current?.cancel();
   if (!frame || keyboard) { setIndex(target); return; }
   if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
     setIndex(target);
     animation.current = frame.animate([{opacity:.45},{opacity:1}],{duration:160});
     return;
   }
   const distance = Math.min(frame.clientWidth * .16, 96);
   // Animate the complete surface; switch content during its invisible midpoint.
   animation.current = frame.animate([
     {transform:start === "none" ? "translateX(0px)" : start, opacity:startOpacity, offset:0, easing:"cubic-bezier(.23,1,.32,1)"},
     {transform:`translateX(${-dir*distance}px)`, opacity:0, offset:.4},
     {transform:`translateX(${dir*distance}px)`, opacity:0, offset:.401, easing:"cubic-bezier(.23,1,.32,1)"},
     {transform:"translateX(0px)", opacity:1, offset:1}
   ], {duration:300,easing:"linear"});
   // State changes remain reliable even if the browser pauses the animation timeline.
   swapTimer.current = setTimeout(() => {
     flushSync(() => setIndex(target));
     swapTimer.current = null;
   }, 120);
 };

 return <section id={id} className="nc-section" aria-labelledby={`${uid}-heading`}>
  <img className="nc-section__background" src={background.replace("/image/upload/", "/image/upload/f_auto,q_auto,w_1600/")}
   srcSet={`${background.replace("/image/upload/", "/image/upload/f_auto,q_auto,w_900/")} 900w, ${background.replace("/image/upload/", "/image/upload/f_auto,q_auto,w_1600/")} 1600w`}
   sizes="100vw" width="1600" height="1000" alt="" aria-hidden="true" loading="lazy" decoding="async" />
  <h2 id={`${uid}-heading`} className="nc-section__title">{title}</h2>
  <div className="nc-carousel" role="group" aria-roledescription="carousel" aria-label={title} tabIndex={0}
   onKeyDown={e => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault(); const dir = e.key === "ArrowRight" ? 1 : -1; change(requestedIndex.current + dir,dir,true);
   }}>
   <div className="nc-stage" ref={stageRef}
    onPointerDown={e => {
     if ((e.target as Element).closest("a,button") || (e.pointerType === "mouse" && e.button !== 0)) return;
     pointer.current = {x:e.clientX,y:e.clientY}; e.currentTarget.setPointerCapture(e.pointerId);
    }}
    onPointerCancel={() => {pointer.current = null;}}
    onPointerUp={e => {
     const start=pointer.current; pointer.current=null; if (!start) return;
     const dx=e.clientX-start.x,dy=e.clientY-start.y;
     if (Math.abs(dx)>60 && Math.abs(dx)>Math.abs(dy)*1.5) { const dir=dx<0?1:-1; change(requestedIndex.current+dir,dir); }
    }}>
    {slides.map((slide,i) => <div key={i} id={`${uid}-slide-${i}`} className="nc-card" data-active={index===i}
     aria-hidden={index!==i} inert={index!==i} role="group" aria-roledescription="slide" aria-label={`${i+1} of ${slides.length}`}>
     <div className={"nc-card__body"+(slide.image?" nc-card__body--portrait":"")}>
      {slide.image && <div className="nc-card__portrait"><img src={slide.image} alt={slide.imageAlt ?? ""} width="400" height="600" loading="lazy" decoding="async" draggable={false} /></div>}
      <div className="nc-card__copy">
       {slide.title && <h3 className="nc-card__title">{slide.title}</h3>}
       {slide.lead && <p className="nc-card__lead">{slide.lead}</p>}
       {slide.quote && <div className="nc-card__stars" aria-hidden="true">{Array.from({length:5},(_,n)=><img key={n} src="https://res.cloudinary.com/dzytbkc5l/image/upload/v1760976788/liam/2sp6am4qncmf05qzut_fmmlir.svg" alt="" width="20" height="20" />)}</div>}
       {slide.text && <div className={"nc-card__text"+(slide.quote?" nc-card__text--quote":"")}>{slide.text.split("\n\n").map(text=><p key={text}>{text}</p>)}</div>}
      </div>
     </div>
     {slide.action && <div className="nc-card__action"><CardAction action={slide.action} /></div>}
    </div>)}
   </div>
   <div className="nc-controls">
    <button className="nc-arrow" type="button" aria-label={`Previous ${title.toLowerCase()} slide`} onClick={()=>change(requestedIndex.current-1,-1)}><Chevron back /></button>
    <div className="nc-dots" role="group" aria-label="Choose a slide">{slides.map((slide,i)=><button key={i} type="button" className="nc-dot" aria-label={`Show ${slide.title ?? `story ${i+1}`}`} aria-pressed={index===i} aria-controls={`${uid}-slide-${i}`} onClick={()=>change(i,i>index?1:-1)} />)}</div>
    <button className="nc-arrow" type="button" aria-label={`Next ${title.toLowerCase()} slide`} onClick={()=>change(requestedIndex.current+1,1)}><Chevron /></button>
   </div>
   <span className="nc-sr" aria-live="polite" aria-atomic="true">{slides[index]?.title ?? `Story ${index+1}`} — {index+1} of {slides.length}</span>
  </div>
 </section>;
}
