import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { usersApi, hangoutsApi, type Hangout } from "../../api/ApiClient";
import { useAuth } from "../../context/AuthContext";
import "./Profile.css";

/* ─── TYPES ──────────────────────────────────────────────────── */
interface PublicUser {
  _id: string;
  id?: string;
  name: string;
  username: string;
  email?: string;
  bio?: string;
  avatar: { url: string; publicId: string };
  createdAt?: string;
}

interface UserStats {
  hangoutsCreated: number;
  hangoutsJoined: number;
  peopleMet: number;
}

/* ─── HELPERS ────────────────────────────────────────────────── */
const getInitials = (name: string) =>
  name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);

const formatShortDate = (str: string) => {
  const d = new Date(str);
  const now = new Date();
  const diff = d.getTime() - now.getTime();
  const dayMs = 86400000;
  if (diff > 0 && diff < dayMs) return `Today, ${new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", hour12: true }).format(d)}`;
  if (diff > dayMs && diff < dayMs * 2) return `Tomorrow, ${new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", hour12: true }).format(d)}`;
  return new Intl.DateTimeFormat("en-US", { weekday: "short", hour: "numeric", minute: "2-digit", hour12: true }).format(d);
};

const formatJoinDate = (str: string) =>
  new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(new Date(str));

/* ─── COMPONENT ──────────────────────────────────────────────── */
const ViewProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();

  const [profile, setProfile] = useState<PublicUser | null>(null);
  const [stats, setStats] = useState<UserStats>({ hangoutsCreated: 0, hangoutsJoined: 0, peopleMet: 0 });
  const [hangouts, setHangouts] = useState<Hangout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // If viewing own profile, redirect to /profile
  useEffect(() => {
    if (currentUser && id) {
      const uid = currentUser._id || currentUser.id;
      if (uid === id) {
        navigate("/profile", { replace: true });
      }
    }
  }, [currentUser, id, navigate]);

  /* ── Fetch user profile + stats + public hangouts ──────────── */
  useEffect(() => {
    if (!id) return;
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch user profile with stats
        const res: any = await usersApi.getProfile(id);
        setProfile(res.user);
        setStats(res.stats);

        // Fetch public hangouts hosted by this user
        const hangoutsRes: any = await hangoutsApi.getAll({});
        const userHangouts = (hangoutsRes.hangouts || []).filter(
          (h: Hangout) => h.host?._id === id
        );
        setHangouts(userHangouts);
      } catch (e: any) {
        setError(e.message || "User not found");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  /* ── Loading state ─────────────────────────────────────────── */
  if (loading) {
    return (
      <section className="profile-page">
        <div className="container">
          <div className="profile-loading">
            <div className="loading-spinner" />
            <p>Loading profile...</p>
          </div>
        </div>
      </section>
    );
  }

  /* ── Error / not found ─────────────────────────────────────── */
  if (error || !profile) {
    return (
      <section className="profile-page">
        <div className="container">
          <div className="profile-error">
            <span className="material-symbols-outlined">person_off</span>
            <h2>{error || "User not found"}</h2>
            <button className="btn btn-secondary" onClick={() => navigate(-1)}>Go Back</button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="profile-page">
      <div className="container">
        {/* ═══ PROFILE HEADER ═══ */}
        <div className="profile-header-card glass">
          <div className="profile-header-top">
            {/* Avatar */}
            <div className="profile-avatar-wrapper">
              {profile.avatar?.url ? (
                <img src={profile.avatar.url} alt={profile.name} className="profile-avatar" />
              ) : (
                <div className="profile-avatar-placeholder">{getInitials(profile.name)}</div>
              )}
            </div>

            {/* Info */}
            <div className="profile-info">
              <h1 className="profile-name">{profile.name}</h1>
              <p className="profile-username">@{profile.username}</p>
              <p className="profile-bio">{profile.bio || "No bio yet."}</p>
              {profile.createdAt && (
                <p className="profile-joined">
                  <span className="material-symbols-outlined">calendar_today</span>
                  Joined {formatJoinDate(profile.createdAt)}
                </p>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="profile-stats">
            <div className="profile-stat">
              <span className="stat-value">{stats.hangoutsCreated}</span>
              <span className="stat-label">Hangouts created</span>
            </div>
            <div className="profile-stat">
              <span className="stat-value">{stats.hangoutsJoined}</span>
              <span className="stat-label">Hangouts Joined</span>
            </div>
            <div className="profile-stat">
              <span className="stat-value">{stats.peopleMet}</span>
              <span className="stat-label">People met</span>
            </div>
          </div>
        </div>

        {/* ═══ PUBLIC HANGOUTS ═══ */}
        <div className="profile-hangouts-section glass">
          <div className="profile-hangouts-header">
            <h2>{profile.name.split(" ")[0]}'s Hangouts</h2>
          </div>

          {hangouts.length === 0 ? (
            <div className="profile-hangouts-empty">
              <span className="material-symbols-outlined">event_busy</span>
              <p>No public hangouts yet</p>
            </div>
          ) : (
            <div className="profile-hangouts-grid">
              {hangouts.map((h) => (
                <Link to={`/hangouts/${h._id}`} key={h._id} className="profile-hangout-card">
                  <div className="phc-image-wrapper">
                    {h.image?.url ? (
                      <img src={h.image.url} alt={h.title} className="phc-image" />
                    ) : (
                      <div className="phc-image-placeholder">
                        <span className="material-symbols-outlined">celebration</span>
                      </div>
                    )}
                    <span className="phc-time-badge">{formatShortDate(h.startTime)}</span>
                  </div>
                  <h4 className="phc-title">{h.title}</h4>
                  <p className="phc-location">
                    <span className="material-symbols-outlined">location_on</span>
                    {h.location.name}{h.location.address ? `, ${h.location.address}` : ""}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ViewProfile;
