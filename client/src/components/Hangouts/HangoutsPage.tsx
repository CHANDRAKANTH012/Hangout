import "./Hangouts.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import HangoutList from "./HangoutList";
import { Plus, SlidersHorizontal, ChevronDown } from "lucide-react";

/* ─── FILTER CONFIG ──────────────────────────────────────────── */
const CATEGORY_FILTERS = ["All", "Indoor", "Outdoor", "Online", "Nightlife"];

const VIBE_OPTIONS    = ["All Vibes", "Chill", "Hype", "Cozy", "Networking", "Gaming", "Focus", "Creative"];
const DISTANCE_OPTIONS = ["Any Distance", "0.5 km", "1 km", "2 km", "5 km", "10 km"];
const SORT_OPTIONS    = ["Newest", "Starting Soon", "Most Popular", "Closest"];

/* ═══════════════════════════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════════════════════════ */
interface Props {
  isAuthenticated?: boolean;
}

const HangoutsPage = ({ isAuthenticated }: Props) => {
  const navigate = useNavigate();

  const [activeCategory, setActiveCategory] = useState("All");
  const [vibe,     setVibe]     = useState("All Vibes");
  const [distance, setDistance] = useState("Any Distance");
  const [sort,     setSort]     = useState("Newest");

  /* Build filter params to pass to API */
  const filters: Record<string, string> = {};
  if (activeCategory !== "All")        filters.category = activeCategory.toLowerCase();
  if (vibe !== "All Vibes")            filters.vibe     = vibe.toLowerCase();
  if (sort !== "Newest")               filters.sort     = sort.toLowerCase().replace(/ /g, "_");

  return (
    <section className="hangouts-page">
      <div className="container">

        {/* ── HEADER ── */}
        <div className="hangouts-header">
          <div className="hangouts-header-top">
            <div>
              <h1>Active Hangouts</h1>
              <p>Find your tribe in the urban jungle. Join spontaneous meetups happening right now around you.</p>
            </div>

            <button
              className="btn btn-primary hangouts-create-btn"
              id="hangouts-create-btn"
              onClick={() => navigate("/create")}
            >
              <Plus size={16} />
              Create Hangout
            </button>
          </div>

          {/* ── FILTERS ── */}
          <div className="hangouts-filters">

            {/* Category pills */}
            <div className="hangouts-filter-pills">
              {CATEGORY_FILTERS.map((cat) => (
                <button
                  key={cat}
                  className={`hf-pill${activeCategory === cat ? " hf-pill-active" : ""}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Divider */}
            <div className="hf-divider" />

            {/* Dropdowns */}
            <div className="hangouts-filter-dropdowns">
              <label className="hf-select-wrap">
                <SlidersHorizontal size={13} />
                <select value={vibe} onChange={(e) => setVibe(e.target.value)}>
                  {VIBE_OPTIONS.map((v) => <option key={v}>{v}</option>)}
                </select>
                <ChevronDown size={13} />
              </label>

              <label className="hf-select-wrap">
                <select value={distance} onChange={(e) => setDistance(e.target.value)}>
                  {DISTANCE_OPTIONS.map((d) => <option key={d}>{d}</option>)}
                </select>
                <ChevronDown size={13} />
              </label>

              <label className="hf-select-wrap">
                <select value={sort} onChange={(e) => setSort(e.target.value)}>
                  {SORT_OPTIONS.map((s) => <option key={s}>{s}</option>)}
                </select>
                <ChevronDown size={13} />
              </label>
            </div>

          </div>

          {/* Private hangout notice — show only when NOT authenticated */}
          {!isAuthenticated && (
            <div className="hc-auth-notice">
              <Lock16 />
              <span>
                <strong>Some hangouts are hidden.</strong>{" "}
                <button className="hc-auth-link" onClick={() => navigate("/login")}>
                  Log in
                </button>{" "}
                to see private hangouts near you.
              </span>
            </div>
          )}
        </div>

        {/* ── LIST ── */}
        <HangoutList isAuthenticated={isAuthenticated} filters={filters} />

      </div>
    </section>
  );
};

/* tiny inline icon to avoid import just for notice */
const Lock16 = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

export default HangoutsPage;