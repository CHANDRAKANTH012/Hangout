import "./Navbar.css";
import { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import logo from "../../assets/home/hangoutLogo.webp";

type NavLinks = {
  label: string;
  to: string;
  badge?: string;
};

const NAV_LINKS: NavLinks[] = [
  { label: "Home", to: "/" },
  { label: "Map", to: "/map", badge: "New" },
  { label: "Hangouts", to: "/hangouts" },
  { label: "Notifications", to: "/notifications" },
];

const SCROLL_THRESHOLD_RATIO = 0.2;

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

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
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  /* ─── Close dropdown on outside click ──────────────────────── */
  useEffect(() => {
    if (!dropdownOpen) return;
    const close = () => setDropdownOpen(false);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [dropdownOpen]);

  const closeMenu = () => setMenuOpen(false);

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    closeMenu();
    navigate("/");
  };

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
                    <span className="nav-badge" key={link.badge}>
                      {link.badge}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>

          {/* ── AUTH ACTIONS ── */}
          <div className="navbar-actions">
            {isAuthenticated && user ? (
              <div
                className="navbar-user-menu"
                onClick={(e) => {
                  e.stopPropagation();
                  setDropdownOpen(!dropdownOpen);
                }}
              >
                {user.avatar?.url ? (
                  <img
                    src={user.avatar.url}
                    alt={user.name}
                    className="user-avatar"
                  />
                ) : (
                  <div className="user-avatar-placeholder">
                    {getInitials(user.name)}
                  </div>
                )}

                {/* Dropdown */}
                {dropdownOpen && (
                  <div className="navbar-dropdown" onClick={(e) => e.stopPropagation()}>
                    <div className="navbar-dropdown-header">
                      <p className="dropdown-name">{user.name}</p>
                      <p className="dropdown-email">{user.email}</p>
                    </div>
                    <div className="navbar-dropdown-divider" />
                    <Link
                      to="/profile"
                      className="navbar-dropdown-item"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <span className="material-symbols-outlined">person</span>
                      Profile
                    </Link>
                    <Link
                      to="/create"
                      className="navbar-dropdown-item"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <span className="material-symbols-outlined">add_circle</span>
                      Create Hangout
                    </Link>
                    <Link
                      to="/notifications"
                      className="navbar-dropdown-item"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <span className="material-symbols-outlined">notifications</span>
                      Notifications
                    </Link>
                    <div className="navbar-dropdown-divider" />
                    <button
                      className="navbar-dropdown-item navbar-dropdown-logout"
                      onClick={handleLogout}
                    >
                      <span className="material-symbols-outlined">logout</span>
                      Log out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login">
                  <button className="navbar-btn-login">Log in</button>
                </Link>
                <Link to="/register">
                  <button className="navbar-btn-signup">Sign up</button>
                </Link>
              </>
            )}
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
        {/* Show user info in drawer if logged in */}
        {isAuthenticated && user && (
          <div className="navbar-drawer-user">
            {user.avatar?.url ? (
              <img src={user.avatar.url} alt={user.name} className="drawer-user-avatar" />
            ) : (
              <div className="drawer-user-avatar-placeholder">
                {getInitials(user.name)}
              </div>
            )}
            <p className="drawer-user-name">{user.name}</p>
            <p className="drawer-user-email">@{user.username}</p>
          </div>
        )}

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
          {isAuthenticated ? (
            <button className="navbar-drawer-login" onClick={handleLogout}>
              Log out
            </button>
          ) : (
            <>
              <Link to="/login" onClick={closeMenu}>
                <button className="navbar-drawer-login">Log in</button>
              </Link>
              <Link to="/register" onClick={closeMenu}>
                <button className="navbar-drawer-signup">Sign up</button>
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;