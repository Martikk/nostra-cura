import { useEffect, useRef } from 'react';
import { FiCheck } from 'react-icons/fi';

export default function ContactSuccess({ personal = false, onReset }: { personal?: boolean; onReset: () => void }) {
  const confirmation = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = confirmation.current;
    element?.focus({ preventScroll: true });
    element?.scrollIntoView({ block: 'center', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  }, []);
  return (
    <div className="contact-confirmation" role="status" tabIndex={-1} ref={confirmation}>
      <span className="contact-confirmation__icon"><FiCheck aria-hidden="true" /></span>
      <h3>Message sent</h3>
      <p>Thank you for reaching out.<br />{personal ? 'I’ll' : 'We’ll'} get back to you as soon as possible.</p>
      <button type="button" className="btn" onClick={onReset}>Send another message</button>
    </div>
  );
}
