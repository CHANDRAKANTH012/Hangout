import "./HangoutDetails.css";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { hangoutsApi, type Hangout } from "../../api/ApiClient";
import { useAuth } from "../../context/AuthContext";
import ManageHangout from "./ManageHangout";

/* ─── HELPERS ────────────────────────────────────────────────── */
const formatDate = (str: string) => {
  if (!str) return "";
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(new Date(str));
};

const formatTime = (str: string) => {
  if (!str) return "";
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(str));
};

const formatTimeRange = (start: string, end?: string) => {
  const s = formatTime(start);
  if (!end) return s;
  return `${s} - ${formatTime(end)}`;
};

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

/* ─── COMPONENT ──────────────────────────────────────────────── */
const HangoutDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [hangout, setHangout] = useState<Hangout | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // User state (derived from auth context)
  const currentUserId = user ? (user._id || user.id) : null;
  const [isHost, setIsHost] = useState(false);
  const [isJoined, setIsJoined] = useState(false);
  const [isPending, setIsPending] = useState(false);

  // UI state
  const [joinLoading, setJoinLoading] = useState(false);
  const [showAllParticipants, setShowAllParticipants] = useState(false);
  const [showManageModal, setShowManageModal] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  /* ── Toast helper ──────────────────────────────────────────── */
  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  /* ── Fetch hangout data ────────────────────────────────────── */
  const fetchHangout = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const res: any = await hangoutsApi.getById(id);
      const h = res.hangout;
      setHangout(h);

      // Derive host/joined state from auth context
      if (currentUserId) {
        setIsHost(h.host._id === currentUserId || h.host.id === currentUserId);
        setIsJoined(
          h.participants.some(
            (p: any) => p._id === currentUserId || p.id === currentUserId
          )
        );
      }
    } catch (e: any) {
      setError(e.message || "Failed to load hangout");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHangout();
  }, [id, currentUserId]);

  /* ── Join / Request to join ────────────────────────────────── */
  const handleJoin = async () => {
    if (!id || !hangout) return;

    // Not logged in
    if (!isAuthenticated || !currentUserId) {
      showToast("Please log in to join a hangout", "error");
      navigate("/login");
      return;
    }

    // Already joined
    if (isJoined) return;

    // Hangout ended
    if (hangout.status === "ended") {
      showToast("This hangout has ended", "error");
      return;
    }

    // Hangout full
    if (hangout.status === "full" || hangout.participants.length >= hangout.maxParticipants) {
      showToast("This hangout is full", "error");
      return;
    }

    try {
      setJoinLoading(true);
      const res: any = await hangoutsApi.join(id);

      if (hangout.approvalRequired && res.notification) {
        // Request sent, not directly joined
        setIsPending(true);
        showToast("Join request sent! Waiting for host approval.");
      } else {
        // Directly joined
        setIsJoined(true);
        showToast("You've joined the hangout! 🎉");
        // Refetch to get updated participants
        await fetchHangout();
      }
    } catch (e: any) {
      const msg = e.message || "Failed to join";
      if (msg.includes("pending")) {
        setIsPending(true);
      }
      showToast(msg, "error");
    } finally {
      setJoinLoading(false);
    }
  };

  /* ── Leave hangout ─────────────────────────────────────────── */
  const handleLeave = async () => {
    if (!id) return;
    try {
      await hangoutsApi.leave(id);
      setIsJoined(false);
      showToast("You left the hangout");
      await fetchHangout();
    } catch (e: any) {
      showToast(e.message || "Failed to leave", "error");
    }
  };

  /* ── Delete hangout ────────────────────────────────────────── */
  const handleDelete = async () => {
    if (!id) return;
    if (!window.confirm("Are you sure you want to delete this hangout? This cannot be undone.")) return;

    try {
      await hangoutsApi.delete(id);
      showToast("Hangout deleted");
      setTimeout(() => navigate("/hangouts"), 1200);
    } catch (e: any) {
      showToast(e.message || "Failed to delete", "error");
    }
  };

  /* ── Loading / Error / Not found states ────────────────────── */
  if (loading) {
    return (
      <section className="hangout-details-page">
        <div className="container">
          <div className="details-loading">
            <div className="loading-spinner" />
            <p>Loading hangout...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error || !hangout) {
    return (
      <section className="hangout-details-page">
        <div className="container">
          <div className="details-error">
            <span className="material-symbols-outlined">error</span>
            <h2>{error || "Hangout not found"}</h2>
            <button className="btn btn-secondary" onClick={() => navigate("/hangouts")}>
              Browse Hangouts
            </button>
          </div>
        </div>
      </section>
    );
  }

  /* ── Derived values ────────────────────────────────────────── */
  const spotsLeft = hangout.maxParticipants - hangout.participants.length;
  const fillPercent = (hangout.participants.length / hangout.maxParticipants) * 100;
  const isFull = spotsLeft <= 0;
  const isEnded = hangout.status === "ended";
  const visibleParticipants = showAllParticipants
    ? hangout.participants
    : hangout.participants.slice(0, 4);
  const hiddenCount = hangout.participants.length - 4;

  return (
    <section className="hangout-details-page">
      <div className="container">
        <div className="hangout-details-layout">
          {/* ── LEFT COLUMN ────────────────────────────────────── */}
          <div className="hangout-details-left">
            {/* Hero card */}
            <div className="hangout-hero glass">
              <div className="hangout-hero-top">
                <div className="hangout-hero-left">
                  {/* Tags + Vibe */}
                  <div className="hangout-tags-row">
                    {hangout.customVibe && (
                      <span className="hangout-vibe">{hangout.customVibe}</span>
                    )}
                    {hangout.tags.map((tag) => (
                      <span key={tag} className="chip chip-fixed">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Status badge */}
                  <span className={`hangout-status ${hangout.status}`}>
                    {hangout.status === "active" && "● "}
                    {hangout.status}
                  </span>
                </div>
              </div>

              <h1>{hangout.title}</h1>
              <p className="hangout-description">{hangout.description}</p>

              {/* Meta grid: Location, Date, Time */}
              <div className="hangout-meta-grid">
                <div className="meta-card glass">
                  <div className="meta-icon">
                    <span className="material-symbols-outlined">location_on</span>
                  </div>
                  <span>Location</span>
                  <h4>{hangout.location.name}</h4>
                  {hangout.location.address && (
                    <p className="meta-sub">{hangout.location.address}</p>
                  )}
                </div>

                <div className="meta-card glass">
                  <div className="meta-icon">
                    <span className="material-symbols-outlined">calendar_today</span>
                  </div>
                  <span>Date</span>
                  <h4>{formatDate(hangout.startTime)}</h4>
                </div>

                <div className="meta-card glass">
                  <div className="meta-icon">
                    <span className="material-symbols-outlined">schedule</span>
                  </div>
                  <span>Time</span>
                  <h4>{formatTimeRange(hangout.startTime, hangout.endTime)}</h4>
                </div>
              </div>

              {/* Host card */}
              <div className="hangout-host-card">
                <div className="host-avatar-wrapper">
                  {hangout.host.avatar?.url ? (
                    <img src={hangout.host.avatar.url} alt={hangout.host.name} />
                  ) : (
                    <div className="avatar-placeholder">
                      {getInitials(hangout.host.name)}
                    </div>
                  )}
                </div>
                <div className="host-info">
                  <h4>{hangout.host.name}</h4>
                  <span>Host • {hangout.host.bio || `@${hangout.host.username}`}</span>
                </div>
                <button
                  className="btn btn-secondary btn-sm host-profile-btn"
                  onClick={() => navigate(`/profile/${hangout.host._id}`)}
                >
                  View Profile
                </button>
              </div>

              {/* Message from host */}
              {hangout.message && (
                <div className="hangout-host-message">
                  <span className="material-symbols-outlined">chat_bubble</span>
                  <p>"{hangout.message}"</p>
                </div>
              )}
            </div>
          </div>

          {/* ── RIGHT COLUMN ───────────────────────────────────── */}
          <div className="hangout-details-right">
            {/* Participation card */}
            <div className="participation-card glass">
              <div className="participation-header">
                <div>
                  <h3>Joining</h3>
                  <p className="participation-sub">Don't miss out!</p>
                </div>
                <span className="participation-count">
                  {hangout.participants.length} / {hangout.maxParticipants}{" "}
                  Joined
                </span>
              </div>

              {/* Progress bar */}
              <div className="participation-progress">
                <div className="participation-bar">
                  <div
                    className="participation-fill"
                    style={{ width: `${Math.min(fillPercent, 100)}%` }}
                  />
                </div>
                <div className="participation-stats">
                  <p>
                    <span className="material-symbols-outlined">check_circle</span>
                    {spotsLeft > 0
                      ? `${spotsLeft} spot${spotsLeft > 1 ? "s" : ""} remaining`
                      : "No spots left"}
                  </p>
                  <p>
                    <span className="material-symbols-outlined">check_circle</span>
                    {hangout.approvalRequired
                      ? "Approval required"
                      : "Anyone can join"}
                  </p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="participation-actions">
                {isEnded ? (
                  <div className="hangout-ended-badge">
                    <span className="material-symbols-outlined">event_busy</span>
                    This hangout has ended
                  </div>
                ) : isHost ? (
                  <div className="host-actions">
                    <button
                      className="btn btn-primary btn-lg participation-btn"
                      onClick={() => setShowManageModal(true)}
                    >
                      <span className="material-symbols-outlined">settings</span>
                      Manage Hangout
                    </button>
                    <button className="leave-btn" onClick={handleDelete}>
                      <span className="material-symbols-outlined">delete</span>
                      Delete Hangout
                    </button>
                  </div>
                ) : isJoined ? (
                  <div className="joined-state">
                    <div className="joined-badge">
                      <span className="material-symbols-outlined">check_circle</span>
                      You're in! See you there 🎉
                    </div>
                    <button className="leave-btn" onClick={handleLeave}>
                      Leave Hangout
                    </button>
                  </div>
                ) : isPending ? (
                  <button className="participation-pending" disabled>
                    <span className="material-symbols-outlined">hourglass_top</span>
                    Request Pending...
                  </button>
                ) : isFull ? (
                  <div className="hangout-full">
                    <span className="material-symbols-outlined">group_off</span>
                    This hangout is full
                  </div>
                ) : (
                  <>
                    <button
                      className="btn btn-primary btn-lg participation-btn"
                      onClick={handleJoin}
                      disabled={joinLoading}
                    >
                      {joinLoading ? "Joining..." : "Join Now"}
                    </button>
                    <p className="participation-note">
                      You can cancel up to 2h before
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Participants section */}
            <div className="participants-section glass">
              <div className="participants-top">
                <h3>Participants</h3>
                {hangout.participants.length > 4 && (
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => setShowAllParticipants(!showAllParticipants)}
                  >
                    {showAllParticipants ? "Show Less" : "See All"}
                  </button>
                )}
              </div>

              <div className="participants-grid">
                {visibleParticipants.map((p) => (
                  <div className="participant-card" key={p._id}>
                    {p.avatar?.url ? (
                      <img src={p.avatar.url} alt={p.name} />
                    ) : (
                      <div className="avatar-placeholder avatar-sm">
                        {getInitials(p.name)}
                      </div>
                    )}
                    <p className="participant-name">{p.name}</p>
                    <span className="participant-role">@{p.username}</span>
                  </div>
                ))}

                {/* "+N Others" card when collapsed */}
                {!showAllParticipants && hiddenCount > 0 && (
                  <div
                    className="participant-card others-card"
                    onClick={() => setShowAllParticipants(true)}
                  >
                    <div className="others-bubble">+{hiddenCount}</div>
                    <p className="participant-name">Others</p>
                    <span className="participant-role">More</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── MANAGE MODAL ───────────────────────────────────────── */}
      {showManageModal && (
        <ManageHangout
          hangout={hangout}
          onClose={() => setShowManageModal(false)}
          onUpdate={(updated) => {
            setHangout(updated);
            setShowManageModal(false);
            showToast("Hangout updated successfully! ✅");
          }}
        />
      )}

      {/* ── TOAST ──────────────────────────────────────────────── */}
      {toast && (
        <div className={`toast toast-${toast.type}`}>
          <span className="material-symbols-outlined">
            {toast.type === "success" ? "check_circle" : "error"}
          </span>
          {toast.message}
        </div>
      )}
    </section>
  );
};

export default HangoutDetailsPage;
