import "./Footer.css";

type FooterLinks = {
  label: string;
  href: string;
  badge?: string;
}


const FOOTER_LINKS: Record<string, FooterLinks[]> = {
  Product: [
    { label: "Features", href: "#" },
    { label: "How it works", href: "#" },
    { label: "Pricing", href: "#" },
    { label: "Changelog", href: "#", badge: "New" },
    { label: "Roadmap", href: "#" },
  ],
  Company: [
    { label: "About us", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Careers", href: "#", badge: "Hiring" },
    { label: "Press kit", href: "#" },
    { label: "Contact", href: "#" },
  ],
  Support: [
    { label: "Help center", href: "#" },
    { label: "Community", href: "#" },
    { label: "Safety", href: "#" },
    { label: "Guidelines", href: "#" },
    { label: "Status", href: "#" },
  ],
};

const SOCIALS = [
  { icon: "𝕏", label: "X / Twitter", href: "#" },
  { icon: "📸", label: "Instagram", href: "#" },
  { icon: "🎵", label: "TikTok", href: "#" },
  { icon: "💬", label: "Discord", href: "#" },
];

const Footer = () => {
  return (
    <footer className="footer">
      {/* Top gradient line */}
      <div className="footer-wave" />
      {/* Ambient glow blob */}
      <div className="footer-glow" />

      {/* ── MAIN GRID ── */}
      <div className="footer-main">
        <div className="footer-top">

          {/* ── BRAND COLUMN ── */}
          <div className="footer-brand">
            <a className="footer-logo" href="/">
              <img
                className="footer-logo-img"
                src="/hangout-logo.png"
                alt="Hangout"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                }}
              />
              <span className="footer-logo-text">Hangout</span>
            </a>

            <p className="footer-tagline">
              Real-time. Local. Spontaneous. Connect with people
              around you and turn any moment into a meetup.
            </p>

            {/* Social icons */}
            <div className="footer-socials">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  className="footer-social-btn"
                  href={s.href}
                  aria-label={s.label}
                  title={s.label}
                >
                  {s.icon}
                </a>
              ))}
            </div>

            {/* Newsletter */}
            <div className="footer-newsletter">
              <input
                type="email"
                placeholder="Your email address"
                aria-label="Subscribe to newsletter"
              />
              <button className="footer-newsletter-btn">Subscribe</button>
            </div>
          </div>

          {/* ── LINK COLUMNS ── */}
          {Object.entries(FOOTER_LINKS).map(([category, links]) => (
            <div key={category} className="footer-col">
              <div className="footer-col-title">{category}</div>
              <ul className="footer-col-links">
                {links.map((link) => (
                  <li key={link.label}>
                    <a className="footer-col-link" href={link.href}>
                      {link.label}
                      {link.badge && (
                        <span className="footer-col-link-badge">{link.badge}</span>
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

        </div>
      </div>

      {/* ── BOTTOM BAR ── */}
      <div className="footer-bottom">
        <p className="footer-copyright">
          © {new Date().getFullYear()} <span>Hangout</span>. All rights reserved.
        </p>

        <ul className="footer-legal">
          {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((item) => (
            <li key={item}>
              <a className="footer-legal-link" href="#">{item}</a>
            </li>
          ))}
        </ul>

        <p className="footer-made">
          Made with <span className="footer-made-heart">❤️</span> for real people
        </p>
      </div>
    </footer>
  );
};

export default Footer;