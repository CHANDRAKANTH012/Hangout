import "./Cursororb.css";
import { useEffect, useRef, useState } from "react";

const CursorOrb = () => {
  // const orbRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  const [hovering, setHovering] = useState(false);
  const [clicking, setClicking] = useState(false);

  useEffect(() => {
    /* ─── Move orb + dot via CSS custom properties ──────────────
       Using CSS vars + CSS transition gives us the lag effect
       without JS animation loops — the orb has a slow transition,
       the dot has a fast one. We update both at the same time.
    ─────────────────────────────────────────────────────────── */
    const onMove = (e: MouseEvent) => {
      const { clientX: x, clientY: y } = e;

      // if (orbRef.current) {
      //   orbRef.current.style.setProperty("--orb-x", `${x}px`);
      //   orbRef.current.style.setProperty("--orb-y", `${y}px`);
      // }

      if (dotRef.current) {
        dotRef.current.style.setProperty("--dot-x", `${x}px`);
        dotRef.current.style.setProperty("--dot-y", `${y}px`);
      }
    };

    /* ─── Hover detection ───────────────────────────────────── */
    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive = target.closest(
        "a, button, [role='button'], input, textarea, label, select, .hover-lift",
      );
      setHovering(!!isInteractive);
    };

    /* ─── Click feedback ─────────────────────────────────────── */
    const onDown = () => setClicking(true);
    const onUp = () => setClicking(false);

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
    };
  }, []);

  return (
    <>
      {/* Large ambient orb — slow trail */}
      {/* <div ref={orbRef} className="cursor-orb" aria-hidden="true" /> */}

      {/* Tight cursor dot — snappy */}
      <div
        ref={dotRef}
        className={`cursor-dot${hovering ? " cursor-hovering" : ""}${clicking ? " cursor-clicking" : ""}`}
        aria-hidden="true"
      />
    </>
  );
};

export default CursorOrb;
