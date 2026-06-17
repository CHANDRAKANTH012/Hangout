import "./ScrollText.css";
import { useEffect, useRef } from "react";

const WORDS = [
  { text: "THE",      gradient: false },
  { text: "BEST",     gradient: true },
  { text: "MEMORIES", gradient: false },
  { text: "START",    gradient: false },
  { text: "WHEN",     gradient: false },
  { text: "PEOPLE",   gradient: false },
  { text: "ACTUALLY", gradient: false },
  { text: "SHOW UP.", gradient: true  },
];

const ScrollText = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const spanRefs   = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const spans = spanRefs.current.filter(Boolean) as HTMLSpanElement[];
    const total = spans.length;

    const onScroll = () => {
      const rect     = section.getBoundingClientRect();
      // console.log("RECT: ",rect)
      const vh       = window.innerHeight;
      // console.log("VH: ",vh)

      /*
        progress 0 → section top hits bottom of viewport
        progress 1 → section bottom leaves top of viewport
        Divide evenly across words — last word completes exactly
        as the section exits, no end-delay.
      */
      const scrolled  = vh - rect.top;
      // console.log("SCROLLED: ",scrolled)
      const range     = section.offsetHeight + vh;
      // console.log("RANGE: ",range)

      const SCROLL_SPEED = 1.6
      const progress  = Math.min(Math.max((scrolled / range)*SCROLL_SPEED, 0), 1);
      // console.log("PROGRESS: ",progress)
      

      spans.forEach((span, i) => {
        const wordStart = i / total;
        const wordEnd   = (i + 1) / total;

        if (progress >= wordEnd) {
          span.classList.add("word-revealed");
          span.classList.remove("word-partial");
          span.style.removeProperty("--fill-pct");
        } else if (progress > wordStart) {
          const pct = ((progress - wordStart) / (wordEnd - wordStart)) * 100;
          span.classList.add("word-partial");
          span.classList.remove("word-revealed");
          span.style.setProperty("--fill-pct", `${pct.toFixed(2)}%`);
        } else {
          span.classList.remove("word-revealed", "word-partial");
          span.style.removeProperty("--fill-pct");
        }
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section className="scroll-text-section" ref={sectionRef} id="scroll-story">
      <div className="st-blob st-blob-1" aria-hidden="true" />
      <div className="st-blob st-blob-2" aria-hidden="true" />

      <div className="st-inner">
        <h2
          className="st-headline"
          aria-label="The best memories start when people actually show up."
        >
          {WORDS.map((word, i) => (
            <span
              key={i}
              className={`st-word${word.gradient ? " st-word--gradient" : ""}`}
              ref={(el) => { spanRefs.current[i] = el; }}
              aria-hidden="true"
            >
              <span className="st-word-ghost">{word.text}</span>
              <span className="st-word-fill">{word.text}</span>
            </span>
          ))}
        </h2>
      </div>
    </section>
  );
};

export default ScrollText;