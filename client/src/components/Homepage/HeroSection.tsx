import "./HeroSection.css";
import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { Link } from "react-router-dom";

import {
  Compass,
  Users,
  MessageCircle,
  Sparkles,
  ArrowRight,
  Heart,
  UsersRound,
  Eye,
  Share2,
} from "lucide-react";

import hero1 from "../../assets/home/hero1.webp";
import hero2 from "../../assets/home/hero2.webp";
import hero3 from "../../assets/home/hero3.webp";
import hero4 from "../../assets/home/hero4.webp";
import hero5 from "../../assets/home/hero5.webp";

/* ─── SLIDE DATA ─────────────────────────────────────────────── */
const SLIDES = [
  {
    id: 1,
    image: hero1,
    tagline: "Drop a pin. Find your people.",
    username: "alex_explores",
    avatarBg: "linear-gradient(135deg, #B4252D, #FF5C5C)",
  },
  {
    id: 2,
    image: hero2,
    tagline: "Spontaneous moments, real connections.",
    username: "mia.travels",
    avatarBg: "linear-gradient(135deg, #2170E4, #06B6D4)",
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
    avatarBg: "linear-gradient(135deg, #D97E00, #B4252D)",
  },
];

const DISPLAY_DURATION = 3200;
const TRANSITION_DURATION = 750;

type SlideState = "entering" | "active" | "leaving" | "hidden";

/* ═══════════════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════════════ */
const HeroSection = () => {
  const heroRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const [currentIdx, setCurrentIdx] = useState(0);
  const [prevIdx, setPrevIdx] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentIdxRef = useRef(currentIdx);
  const isTransitioningRef = useRef(isTransitioning);
  currentIdxRef.current = currentIdx;
  isTransitioningRef.current = isTransitioning;

  /* ─── DOT GRID + CURSOR MOUSE TRACKING ──────────────────────── */
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const onMove = (e: MouseEvent) => {
      // dot-grid spotlight
      grid.style.setProperty("--mouse-x", e.clientX + "px");
      grid.style.setProperty("--mouse-y", e.clientY + "px");
    };

    document.addEventListener("mousemove", onMove, { passive: true });

    return () => {
      document.removeEventListener("mousemove", onMove);
    };
  }, []);

  /* ─── ADVANCE SLIDE ─────────────────────────────────────────── */
  const advanceSlide = useCallback(() => {
    if (isTransitioningRef.current) return;
    setIsTransitioning(true);
    isTransitioningRef.current = true;
    const nextIdx = (currentIdxRef.current + 1) % SLIDES.length;
    setPrevIdx(currentIdxRef.current);
    setCurrentIdx(nextIdx);
    currentIdxRef.current = nextIdx;
    setTimeout(() => {
      setPrevIdx(null);
      setIsTransitioning(false);
      isTransitioningRef.current = false;
    }, TRANSITION_DURATION + 50);
  }, []);

  /* ─── AUTO-CYCLE ────────────────────────────────────────────── */
  useEffect(() => {
    timerRef.current = setTimeout(advanceSlide, DISPLAY_DURATION);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [advanceSlide, currentIdx]);

  /* ─── SLIDE STATE ───────────────────────────────────────────── */
  const getSlideState = (idx: number): SlideState => {
    if (idx === currentIdx) return "active";
    if (idx === prevIdx) return "leaving";
    return "hidden";
  };

  /* ─── GSAP ENTRY ANIMATIONS ─────────────────────────────────── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .from(".hero-badge", { opacity: 0, y: 20, duration: 0.5 })
        .from(".hero-headline", { opacity: 0, y: 30, duration: 0.6 }, "-=0.2")
        .from(".hero-subtext", { opacity: 0, y: 20, duration: 0.5 }, "-=0.3")
        .from(".hero-platforms", { opacity: 0, y: 16, duration: 0.4 }, "-=0.3")
        .from(".hero-buttons", { opacity: 0, y: 20, duration: 0.5 }, "-=0.3")
        .from(
          ".hero-stat",
          { opacity: 0, y: 16, stagger: 0.1, duration: 0.4 },
          "-=0.3",
        )
        .from(
          ".hero-social-proof",
          { opacity: 0, y: 12, duration: 0.4 },
          "-=0.2",
        )
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

  /* ═══════════════════════════════════════════════════════════════
     RENDER
     ═══════════════════════════════════════════════════════════════ */
  return (
    <>
      {/* ── DOT GRID BACKGROUND (self-contained, fixed) ── */}
      <div className="hero-dot-grid" ref={gridRef} aria-hidden="true" />

      {/* ── COLOUR BLOBS (atmosphere) ── */}
      {/* <div className="hero-blob-layer" aria-hidden="true" /> */}

      <section className="hero" ref={heroRef}>
        {/* subtle section-level blobs for extra depth */}
        <div className="hero-bg-blob hero-bg-blob-1" />
        <div className="hero-bg-blob hero-bg-blob-2" />
        <div className="hero-bg-blob hero-bg-blob-3" />

        <div className="hero-wrapper">
          {/* ════════════════════════════
              LEFT COLUMN
              ════════════════════════════ */}
          <div className="hero-left">
            {/* Badge */}
            <span className="hero-badge">
              <span className="hero-badge-dot" />
              See who's around
            </span>

            {/* Headline */}
            <h1 className="hero-headline">
              Discover People Worth{" "}
              <span className="line-italic">Hanging Out.</span>
            </h1>

            {/* Subtext */}
            <p className="hero-subtext">
              Break the digital barrier and meet people in your city instantly.
              Whether it's a quick coffee, a sunset stroll, or a spontaneous jam
              session - find your tribe in real-time.
            </p>

            {/* Platform icons */}
            <div className="hero-platforms">
              <div className="platform-icon" title="Snapchat">
                <Compass />
              </div>
              <div className="platform-icon" title="Instagram">
                <Users />
              </div>
              <div className="platform-icon" title="TikTok">
                <MessageCircle />
              </div>
              <div className="platform-icon" title="YouTube">
                <Sparkles />
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="hero-buttons">
              <Link to="/map" className="hero-btn-primary">
                X-plore Nearby
                {/* <span className="hero-btn-icon material-symbols-outlined">explore</span> */}
              </Link>
              <Link to="/create" className="hero-btn-secondary">
                Create Hangouts
                <ArrowRight />
              </Link>
            </div>

            {/* Stats */}
            <div className="hero-stats">
              <div className="hero-stat">
                <div className="hero-stat-value">
                  <span>2,000+</span>
                </div>
                <div className="hero-stat-label">Active users</div>
              </div>

              <div className="hero-stat">
                <div className="hero-stat-value">
                  <span>500+</span>
                </div>
                <div className="hero-stat-label">Hangouts created</div>
              </div>

              <div className="hero-stat">
                <div className="hero-stat-value">
                  <span>24/7</span>
                </div>
                <div className="hero-stat-label">Live connections</div>
              </div>
            </div>

            {/* Social proof */}
            <div className="hero-social-proof">
              <div className="hero-avatars">
                {["🧑", "👩", "🧔", "👱"].map((emoji, i) => (
                  <div
                    key={i}
                    className="hero-avatar"
                    style={{ zIndex: 4 - i }}
                  >
                    {emoji}
                  </div>
                ))}
                <div
                  className="hero-avatar hero-avatar-count"
                  style={{ zIndex: 0 }}
                >
                  +1k
                </div>
              </div>
              <p className="hero-social-text">
                <strong>1,000+ users</strong> are already connecting
              </p>
            </div>
          </div>
          {/* /hero-left */}

          {/* ════════════════════════════
              RIGHT COLUMN
              ════════════════════════════ */}
          <div className="hero-right">
            {/* Echo card behind */}
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
                    role="button"
                    tabIndex={0}
                    aria-label={`Slide ${i + 1}`}
                    onKeyDown={(e) => e.key === "Enter" && handleDotClick(i)}
                  />
                ))}
              </div>

              {/* Image reel */}
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

              {/* Overlay */}
              <div className="hero-card-overlay" />

              {/* Bottom bar */}
              <div className="hero-card-bottom">
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
                <div className="hero-card-user">
                  <div
                    className="hero-card-avatar"
                    style={{ background: SLIDES[currentIdx].avatarBg }}
                  />
                  <span className="hero-card-username">
                    @{SLIDES[currentIdx].username}
                    <span className="hero-card-verified" aria-label="Verified">
                      ✓
                    </span>
                  </span>
                  <div className="hero-card-share">
                    <span className="material-symbols-outlined">
                      <Share2 />
                    </span>
                  </div>
                </div>
              </div>
            </div>
            {/* /hero-card */}

            {/* Floating tags */}
            <div
              className="hero-floating-tag hero-floating-tag-1"
              aria-hidden="true"
            >
              <span className="tag-icon">
                <Eye />
              </span>
              Join Others
            </div>
            <div
              className="hero-floating-tag hero-floating-tag-2"
              aria-hidden="true"
            >
              <span className="tag-icon">
                <Heart />
              </span>
              Create Memories
            </div>
            <div
              className="hero-floating-tag hero-floating-tag-3"
              aria-hidden="true"
            >
              <span className="tag-icon">
                <UsersRound />
              </span>
              Make Friends
            </div>
          </div>
          {/* /hero-right */}
        </div>
        {/* /hero-wrapper */}
      </section>
    </>
  );
};

export default HeroSection;
