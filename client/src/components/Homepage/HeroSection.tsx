import "./HeroSection.css";
import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";


import { Link } from "react-router-dom";


import hero1 from "../../assets/home/hero1.webp";
import hero2 from "../../assets/home/hero2.webp";
import hero3 from "../../assets/home/hero3.webp";
import hero4 from "../../assets/home/hero4.webp";
import hero5 from "../../assets/home/hero5.webp";
import arrow from "../../assets/home/arrow.svg";

/* ─── SLIDE DATA ────────────────────────────────────────────────
   Replace image paths with your actual hero1.jfif – hero5.jfif
   ──────────────────────────────────────────────────────────────── */
const SLIDES = [
  {
    id: 1,
    image: hero1,
    tagline: "Drop a pin. Find your people.",
    username: "alex_explores",
    avatarBg: "linear-gradient(135deg, #FF5C5C, #FF9500)",
  },
  {
    id: 2,
    image: hero2,
    tagline: "Spontaneous moments, real connections.",
    username: "mia.travels",
    avatarBg: "linear-gradient(135deg, #3B82F6, #06B6D4)",
  },
  {
    id: 3,
    image: hero3,
    tagline: "No plans needed. Just show up.",
    username: "dan_cooks",
    avatarBg: "linear-gradient(135deg, #10B981, #06B6D4)",
  },
  {
    id: 4,
    image: hero4,
    tagline: "Your city is full of stories. Start yours.",
    username: "zara.talks",
    avatarBg: "linear-gradient(135deg, #8B5CF6, #EC4899)",
  },
  {
    id: 5,
    image: hero5,
    tagline: "Life happens outside. Hangout.",
    username: "jay.out",
    avatarBg: "linear-gradient(135deg, #F59E0B, #EF4444)",
  },
];

/* ─── SLIDE TIMING ───────────────────────────────────────────── */
const DISPLAY_DURATION = 3200; // ms visible
const TRANSITION_DURATION = 750; // ms (must match CSS)

type SlideState = "entering" | "active" | "leaving" | "hidden";
/* ═══════════════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════════════ */
const HeroSection = () => {
  const heroRef = useRef<HTMLElement>(null);

  const [currentIdx, setCurrentIdx] = useState(0);
  const [prevIdx, setPrevIdx] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* ─── Refs to avoid recreating advanceSlide on every render ── */
  const currentIdxRef = useRef(currentIdx);
  const isTransitioningRef = useRef(isTransitioning);
  currentIdxRef.current = currentIdx;
  isTransitioningRef.current = isTransitioning;

  /* ─── ADVANCE SLIDE (stable — no deps that change) ─────────── */
  const advanceSlide = useCallback(() => {
    if (isTransitioningRef.current) return;

    setIsTransitioning(true);
    isTransitioningRef.current = true;
    const nextIdx = (currentIdxRef.current + 1) % SLIDES.length;

    setPrevIdx(currentIdxRef.current);
    setCurrentIdx(nextIdx);
    currentIdxRef.current = nextIdx;

    // After transition finishes, clean up
    setTimeout(() => {
      setPrevIdx(null);
      setIsTransitioning(false);
      isTransitioningRef.current = false;
    }, TRANSITION_DURATION + 50);
  }, []);

  /* ─── AUTO-CYCLE TIMER (stable — advanceSlide never changes) ── */
  useEffect(() => {
    timerRef.current = setTimeout(advanceSlide, DISPLAY_DURATION);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [advanceSlide, currentIdx]);

  /* ─── RESOLVE SLIDE STATE ───────────────────────────────────── */
  const getSlideState = (idx: number): SlideState => {
    if (idx === currentIdx) return "active";
    if (idx === prevIdx) return "leaving";
    return "hidden";
  };

  /* ─── GSAP ENTRY ANIMATIONS ─────────────────────────────────── */
  useEffect(() => {
    
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from(".hero-badge", { opacity: 0, y: 20, duration: 0.5 })
        .from(".hero-headline", { opacity: 0, y: 30, duration: 0.6 }, "-=0.2")
        .from(".hero-subtext", { opacity: 0, y: 20, duration: 0.5 }, "-=0.3")
        .from(".hero-platforms", { opacity: 0, y: 16, duration: 0.4 }, "-=0.3")
        .from(".hero-buttons", { opacity: 0, y: 20, duration: 0.5 }, "-=0.3")
        .from(".hero-stat", { opacity: 0, y: 16, stagger: 0.1, duration: 0.4 }, "-=0.3")
        .from(".hero-social-proof", { opacity: 0, y: 12, duration: 0.4 }, "-=0.2")
        .from(".hero-right", { opacity: 0, x: 50, duration: 0.8 }, "-=0.7");
    }, heroRef);

    return () => ctx.revert();
  }, []);

  /* ─── DOT CLICK ─────────────────────────────────────────────── */
  const handleDotClick = (idx: number) => {
    if (isTransitioning || idx === currentIdx) return;
    if (timerRef.current) clearTimeout(timerRef.current);

    setIsTransitioning(true);
    setPrevIdx(currentIdx);
    setCurrentIdx(idx);

    setTimeout(() => {
      setPrevIdx(null);
      setIsTransitioning(false);
    }, TRANSITION_DURATION + 50);
  };

  return (
    <section className="hero" ref={heroRef}>
      {/* ─── BACKGROUND BLOBS ─── */}
      <div className="hero-bg-blob hero-bg-blob-1" />
      <div className="hero-bg-blob hero-bg-blob-2" />
      <div className="hero-bg-blob hero-bg-blob-3" />

      <div className="container hero-wrapper">

        {/* ══════════════════════════════════
            LEFT SIDE
            ══════════════════════════════════ */}
        <div className="hero-left">

          {/* Badge */}
          <span className="hero-badge">
            <span className="hero-badge-dot" />
            See who's around
          </span>

          {/* Headline */}
          <h1 className="hero-headline">
            Real-time hangouts<br />
            <span className="gradient-text line-italic">that create</span><br />
            real connections.
          </h1>

          {/* Sub */}
          <p className="hero-subtext">
            Hangout is a real-time platform that helps you connect with your people nearby in a fun and engaging way.
          </p>

          {/* Platform icons */}
          <div className="hero-platforms">
            <span className="hero-platforms-label">On</span>
            <div className="platform-icon" title="Snapchat">👻</div>
            <div className="platform-icon" title="TikTok">🎵</div>
            <div className="platform-icon" title="Instagram">📸</div>
            <div className="platform-icon" title="YouTube">▶️</div>
          </div>

          {/* CTA Buttons */}
          <div className="hero-buttons">
            <Link to="/map" className="hero-btn-primary">
              X-plore Nearby
            </Link>
            <Link to="/create" className="hero-btn-secondary">
              <span>Create Hangouts</span> <img src={arrow} alt="" className="hero-btn-secondary-icon"/>
            </Link>
          </div>

          {/* Stats */}
          <div className="hero-stats">
            <div className="hero-stat">
              <div className="hero-stat-value"><span>100+</span></div>
              <div className="hero-stat-label">Personal brands</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-value"><span>5/5</span></div>
              <div className="hero-stat-label">Rated excellent</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-value"><span>40k+</span></div>
              <div className="hero-stat-label">Avg. views</div>
            </div>
          </div>

          {/* Social Proof */}
          <div className="hero-social-proof">
            <div className="hero-avatars">
              {["🧑", "👩", "🧔", "👱"].map((emoji, i) => (
                <div key={i} className="hero-avatar" style={{ zIndex: 4 - i }}>
                  {emoji}
                </div>
              ))}
            </div>
            <p className="hero-social-text">
              <strong>2,000+ users</strong> already growing with us
            </p>
          </div>

        </div>

        {/* ══════════════════════════════════
            RIGHT SIDE — SCROLLING CARD
            ══════════════════════════════════ */}
        <div className="hero-right">

          {/* Decorative echo card behind */}
          <div className="hero-card-echo" />

          {/* Glow */}
          <div className="hero-card-glow" />

          {/* Main card */}
          <div className="hero-card">

            {/* Progress dots */}
            <div className="hero-card-dots">
              {SLIDES.map((_, i) => (
                <div
                  key={i}
                  className={`hero-card-dot${i === currentIdx ? " dot-active" : ""}`}
                  onClick={() => handleDotClick(i)}
                  style={{ cursor: "pointer" }}
                />
              ))}
            </div>

            {/* Image track */}
            <div className="hero-card-track">
              {SLIDES.map((slide, i) => {
                const state = getSlideState(i);
                if (state === "hidden") return null;

                return (
                  <div
                    key={slide.id}
                    className={`hero-card-slide slide-${state}`}
                  >
                    <img
                      src={slide.image}
                      alt={`Hangout moment ${i + 1}`}
                      loading={i === 0 ? "eager" : "lazy"}
                      decoding="async"
                    />
                  </div>
                );
              })}
            </div>

            {/* Overlay gradient */}
            <div className="hero-card-overlay" />

            {/* Bottom info */}
            <div className="hero-card-bottom">
              {/* Tagline — transitions with slide */}
              <div className="hero-card-tagline">
                {SLIDES.map((slide, i) => (
                  <span
                    key={slide.id}
                    className={`tagline-text${i === currentIdx ? " tagline-active" : ""}`}
                  >
                    {slide.tagline}
                  </span>
                ))}
              </div>

              {/* User row */}
              <div className="hero-card-user">
                <div
                  className="hero-card-avatar"
                  style={{ background: SLIDES[currentIdx].avatarBg }}
                />
                <span className="hero-card-username">
                  @{SLIDES[currentIdx].username}
                  <span className="hero-card-verified">✓</span>
                </span>
              </div>
            </div>

          </div>

          {/* ─── FLOATING TAGS ─── */}
          <div className="hero-floating-tag hero-floating-tag-1">
            <span className="tag-icon">👁️</span>
            Join Others
          </div>

          <div className="hero-floating-tag hero-floating-tag-2">
            <span className="tag-icon">❤️</span>
            Create Memories
          </div>

          <div className="hero-floating-tag hero-floating-tag-3">
            <span className="tag-icon">👥</span>
            Make Friends
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;