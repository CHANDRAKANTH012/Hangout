import "./Preloader.css";
import { useEffect, useState } from "react";

interface PreloaderProps {
  onComplete?: () => void;
  /** Duration in ms before dismissing. Max 3000. Default 2800. */
  duration?: number;
}

/* ─── Logo path — replace with your actual logo asset path ──── */
const LOGO_SRC = "/hangout-logo.png"; // Your Hangout logo image

const Preloader = ({ onComplete, duration = 2800 }: PreloaderProps) => {
  const [exiting, setExiting] = useState(false);
  const [mounted, setMounted] = useState(true);

  useEffect(() => {
    // Clamp duration to max 3s
    const safeDuration = Math.min(duration, 3000);

    const exitTimer = setTimeout(() => {
      setExiting(true);
    }, safeDuration);

    const unmountTimer = setTimeout(() => {
      setMounted(false);
      onComplete?.();
    }, safeDuration + 650); // exit animation is 600ms

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(unmountTimer);
    };
  }, [duration, onComplete]);

  if (!mounted) return null;

  return (
    <div className={`preloader${exiting ? " preloader-exit" : ""}`}>
      {/* ─── Background ambient particles ─── */}
      <div className="preloader-particle preloader-particle-1" />
      <div className="preloader-particle preloader-particle-2" />

      {/* ─── Logo ─── */}
      <div className="preloader-logo-wrap">
        <img
          className="preloader-logo-img"
          src={LOGO_SRC}
          alt="Hangout logo"
          /* Fallback if image not found: show emoji */
          onError={(e) => {
            const target = e.currentTarget;
            target.style.display = "none";
            const sibling = target.nextElementSibling as HTMLElement | null;
            if (sibling) sibling.style.display = "flex";
          }}
        />
        {/* Emoji fallback (hidden by default) */}
        <div
          style={{
            display: "none",
            fontSize: "64px",
            lineHeight: 1,
            animation: "logoPulse 1.6s ease-in-out infinite",
          }}
        >
          📍
        </div>

        <div className="preloader-wordmark">
          <div className="preloader-name">
            <span>Hangout</span>
          </div>
          <div className="preloader-tagline">Real-time · Local · Meetups</div>
        </div>
      </div>

      {/* ─── Progress bar ─── */}
      <div className="preloader-bar-wrap">
        <div className="preloader-bar-fill" />
      </div>

      {/* ─── Status text ─── */}
      <div className="preloader-status">Getting your world ready…</div>
    </div>
  );
};

export default Preloader;
