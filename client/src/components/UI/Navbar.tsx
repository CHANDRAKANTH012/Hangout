import "./Navbar.css";
import { useEffect, useState, useCallback } from "react";
import user from "../../assets/user.png";
import { Link } from "react-router-dom";

import logo from "../../assets/home/hangoutLogo.png";


type NavLinks = {
  label: string;
  to: string;
  badge?: string;
}

const NAV_LINKS: NavLinks[] = [
  { label: "Home", to: "/" },
  { label: "Map", to: "/map", badge: "New" },
  { label: "Hangouts", to: "/hangouts"},
  { label: "Notifications", to: "/notifications" },
];

const SCROLL_THRESHOLD_RATIO = 0.2; 

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  /* ─── Scroll listener ────────────────────────────────────────── */
  const handleScroll = useCallback(() => {
    const threshold = window.innerHeight * SCROLL_THRESHOLD_RATIO;
    setScrolled(window.scrollY > threshold);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  /* ─── Lock body scroll when drawer open ─────────────────────── */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <nav className={`navbar${scrolled ? " scrolled" : ""}`}>
        <div className="navbar-inner">

          {/* ── LOGO ── */}
          <Link className="navbar-logo" to="/">
            <img
              className="navbar-logo-img"
              src={logo}
              alt="Hangout"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
            <span className="navbar-logo-text">Hangout</span>
          </Link>

          {/* ── NAV LINKS ── */}
          <ul className="navbar-nav" role="list">
            {NAV_LINKS.map((link) => (
              <li key={link.label} className="navbar-nav-item">
                <Link to={link.to} className="navbar-nav-link">
                  {link.label}
                  {link.badge && (
                    <span className="nav-badge" key={link.badge} >{link.badge}</span>
                  )}
                </Link>
              </li>
            ))}
          </ul>

          {/* ── AUTH ACTIONS ── */}
          <div className="navbar-actions">
            <button className="navbar-btn-login">Log in</button>
            <button className="navbar-btn-signup">Sign up</button>
            <img src={user} alt="user" className="user-avatar" />
          </div>

          {/* ── HAMBURGER (mobile) ── */}
          <button
            className={`navbar-hamburger${menuOpen ? " open" : ""}`}
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            <span />
            <span />
            <span />
          </button>

        </div>
      </nav>

      {/* ── MOBILE DRAWER ── */}
      <div
        className={`navbar-drawer${menuOpen ? " open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        {NAV_LINKS.map((link) => (
          <Link
            className="navbar-drawer-link"
            to={link.to}
            onClick={closeMenu}
            key={link.label}
          >
            {link.label}
          </Link>
        ))}

        <div className="navbar-drawer-divider" />

        <div className="navbar-drawer-actions">
          <button className="navbar-drawer-login" onClick={closeMenu}>Log in</button>
          <button className="navbar-drawer-signup" onClick={closeMenu}>Sign up</button>
        </div>
      </div>
    </>
  );
};

export default Navbar;