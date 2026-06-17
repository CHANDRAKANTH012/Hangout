import { useNavigate } from "react-router-dom";
import { MapPin, Clock, Users, Lock, ChevronRight } from "lucide-react";
import { hangoutsApi, type Hangout } from "../../api/ApiClient";

/* ─── HELPERS ────────────────────────────────────────────────── */
const formatTime = (iso: string) => {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffMins = Math.round(diffMs / 60000);

  if (diffMins < 0) return "Started";
  if (diffMins < 60) return `In ${diffMins}m`;
  const h = Math.floor(diffMins / 60);
  const m = diffMins % 60;
  return `In ${h}h${m > 0 ? ` ${m}m` : ""}`;
};


/* placeholder gradient when no image */
const PLACEHOLDER_GRADIENTS = [
  "linear-gradient(135deg,#B4252D 0%,#FF5C5C 50%,#8C5000 100%)",
  "linear-gradient(135deg,#2170E4 0%,#06B6D4 100%)",
  "linear-gradient(135deg,#8B5CF6 0%,#EC4899 100%)",
  "linear-gradient(135deg,#10B981 0%,#06B6D4 100%)",
  "linear-gradient(135deg,#D97E00 0%,#B4252D 100%)",
];

const seedGradient = (id: string) =>
  PLACEHOLDER_GRADIENTS[id.charCodeAt(id.length - 1) % PLACEHOLDER_GRADIENTS.length];

/* ═══════════════════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════════════════ */
interface Props {
  data: Hangout;
  isAuthenticated?: boolean;
}

/* ═══════════════════════════════════════════════════════════════
   CARD
   ═══════════════════════════════════════════════════════════════ */
const HangoutCard = ({ data, isAuthenticated }: Props) => {
  const navigate = useNavigate();
  const joined   = data.participants.length;
  const isFull   = joined >= data.maxParticipants;
  const fillPct  = Math.min((joined / data.maxParticipants) * 100, 100);
  const hasImage = !!data.image?.url;

  const handleJoin = async () => {
    if (!isAuthenticated) { navigate("/login"); return; }
    try {
      data.approvalRequired
        ? await hangoutsApi.requestJoin(data._id)
        : await hangoutsApi.join(data._id);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="hc-card">

      {/* ── IMAGE ── */}
      <div className="hc-image-wrap">
        {hasImage ? (
          <img src={data.image.url} alt={data.title} className="hc-image" />
        ) : (
          <div
            className="hc-image-placeholder"
            style={{ background: seedGradient(data._id) }}
          />
        )}

        {/* ACTIVE badge */}
        <span className="hc-badge-active">
          <span className="hc-badge-dot" />
          ACTIVE
        </span>

        {/* Vibe pill */}
        <span className="hc-vibe-pill">
          {data.vibe.charAt(0).toUpperCase() + data.vibe.slice(1)} Vibe
        </span>

        {/* Private lock */}
        {data.isPrivate && (
          <span className="hc-private-badge">
            <Lock size={10} />
            Private
          </span>
        )}

      </div>

      {/* ── BODY ── */}
      <div className="hc-body">

        {/* Title */}
        <h3 className="hc-title">{data.title}</h3>

        {/* Description */}
        <p className="hc-desc">{data.description}</p>

        {/* Meta */}
        <div className="hc-meta">
          <span className="hc-meta-item">
            <MapPin size={13} />
            {data.location.name}
            {data.location.address ? ` • ${data.location.address}` : ""}
          </span>
          <span className="hc-meta-item">
            <Clock size={13} />
            {/* Starts  */}{formatTime(data.startTime)}
          </span>
        </div>

        {/* Host + Participants count */}
        <div className="hc-host-row">
          <div className="hc-host">
            {data.host.avatar?.url ? (
              <img src={data.host.avatar.url} alt={data.host.name} className="hc-avatar" />
            ) : (
              <div className="hc-avatar hc-avatar-fallback">
                {data.host.name.charAt(0).toUpperCase()}
              </div>
            )}
            <span className="hc-host-name">Hosted by {data.host.name}</span>
          </div>
          <span className="hc-joined">
            <Users size={12} />
            {joined}/{data.maxParticipants}
          </span>
        </div>

        {/* Progress bar */}
        <div className="hc-progress-track">
          <div className="hc-progress-fill" style={{ width: `${fillPct}%` }} />
        </div>

        {/* Tags */}
        {data.tags.length > 0 && (
          <div className="hc-tags">
            {data.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="hc-tag">#{tag}</span>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="hc-actions">
          <button
            className="hc-btn hc-btn-view"
            onClick={() => navigate(`/hangouts/${data._id}`)}
          >
            View
            <ChevronRight size={15} />
          </button>

          <button
            className="hc-btn hc-btn-join"
            onClick={handleJoin}
            disabled={isFull}
          >
            {isFull
              ? "Full"
              : data.approvalRequired
              ? "Request"
              : "Join"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default HangoutCard;