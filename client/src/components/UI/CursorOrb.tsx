import "./CursorOrb.css";
import { useEffect, useRef } from "react";

const CursorOrb = () => {
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    if (!dot) return;

    /* ─── Move dot via CSS custom properties ──────────────────
       Using CSS vars + CSS transition gives us the lag effect
       without JS animation loops.
    ─────────────────────────────────────────────────────────── */
    const onMove = (e: MouseEvent) => {
      const { clientX: x, clientY: y } = e;
      dot.style.setProperty("--dot-x", `${x}px`);
      dot.style.setProperty("--dot-y", `${y}px`);
    };

    /* ─── Hover detection — direct DOM class toggle (no React re-render) */
    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive = target.closest(
        "a, button, [role='button'], input, textarea, label, select, .hover-lift",
      );
      dot.classList.toggle("cursor-hovering", !!isInteractive);
    };

    /* ─── Click feedback — direct DOM class toggle (no React re-render) */
    const onDown = () => dot.classList.add("cursor-clicking");
    const onUp = () => dot.classList.remove("cursor-clicking");

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
        className="cursor-dot"
        aria-hidden="true"
      />
    </>
  );
};

export default CursorOrb;
