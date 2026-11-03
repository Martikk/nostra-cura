import { useEffect, useRef, useState } from "react";
import "./Typewriter.css";

/** Full copy stays accessible and reserves its final space; the visual types only once. */
export default function Typewriter({ text }: { text: string }) {
 const ref = useRef<HTMLSpanElement>(null);
 const [visible, setVisible] = useState(text.length);
 useEffect(() => {
  const el=ref.current; if (!el) return;
  const media=window.matchMedia("(prefers-reduced-motion: reduce)");
  if (media.matches) return;
  let timer: ReturnType<typeof setInterval> | undefined;
  const stop = () => { if (timer) clearInterval(timer); setVisible(text.length); };
  const observer=new IntersectionObserver(entries=>{
   if (!entries.some(entry=>entry.isIntersecting)) return;
   observer.disconnect(); setVisible(0); const start=performance.now();
   timer=setInterval(()=>{
    const count=Math.min(text.length,Math.floor((performance.now()-start)/22));
    setVisible(count); if (count===text.length && timer) clearInterval(timer);
   },32);
  },{threshold:.15});
  observer.observe(el);
  const onPreference=()=>{if(media.matches){observer.disconnect();stop();}};
  media.addEventListener("change",onPreference);
  return ()=>{observer.disconnect();if(timer)clearInterval(timer);media.removeEventListener("change",onPreference);};
 },[text]);
 return <span ref={ref} className="typing-copy">
  <span className="typing-copy__reserve" aria-hidden="true">{text}</span>
  <span className="typing-copy__ink" aria-hidden="true">{text.slice(0,visible)}{visible<text.length&&<span className="typing-copy__caret">|</span>}</span>
  <span className="typing-copy__accessible">{text}</span>
 </span>;
}
