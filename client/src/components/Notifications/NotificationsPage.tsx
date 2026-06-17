import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { notificationsApi } from "../../api/ApiClient";
import "./Notifications.css";

/* ─── TYPES ──────────────────────────────────────────────────── */
interface Notification {
  _id: string;
  type: "join_request" | "join_accepted" | "join_rejected" | "system" | "reminder";
  status: "pending" | "accepted" | "rejected";
  sender: { _id: string; name: string; username: string; avatar: { url: string } };
  receiver: { _id: string; name: string; username: string; avatar: { url: string } };
  hangout: {
    _id: string;
    title: string;
    vibe?: string;
    location?: { name: string };
    startTime?: string;
    status?: string;
  };
  message: string;
  read: boolean;
  createdAt: string;
}

type Tab = "all" | "requests" | "updates";

/* ─── HELPERS ────────────────────────────────────────────────── */
const getInitials = (name: string) =>
  name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);

const timeAgo = (dateStr: string): string => {
  const now = Date.now();
  const diff = now - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(new Date(dateStr));
};

const getNotificationText = (n: Notification, currentUserId: string): { action: string; highlight: string } => {
  const isSender = n.sender._id === currentUserId;
  const isReceiver = n.receiver._id === currentUserId;

  switch (n.type) {
    case "join_request":
      if (isReceiver) return { action: "sent a request to join", highlight: n.hangout.title };
      return { action: "You requested to join", highlight: n.hangout.title };

    case "join_accepted":
      if (isSender) return { action: "accepted your request for", highlight: n.hangout.title };
      return { action: "was accepted to", highlight: n.hangout.title };

    case "join_rejected":
      if (isSender) return { action: "declined your request for", highlight: n.hangout.title };
      return { action: "was declined for", highlight: n.hangout.title };

    case "reminder":
      return { action: "Reminder for", highlight: n.hangout.title };

    case "system":
      return { action: n.message || "System notification for", highlight: n.hangout.title };

    default:
      return { action: "Notification for", highlight: n.hangout.title };
  }
};

/* ─── COMPONENT ──────────────────────────────────────────────── */
const NotificationsPage = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<Tab>("all");
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [unread, setUnread] = useState({ requests: 0, updates: 0 });

  // Action loading per notification
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({});

  // Toast
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const currentUserId = user?._id || user?.id || "";

  /* ── Redirect if not logged in ─────────────────────────────── */
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  /* ── Fetch notifications ───────────────────────────────────── */
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res: any = await notificationsApi.getAll(activeTab);
      setNotifications(res.notifications || []);
      setUnread(res.unread || { requests: 0, updates: 0 });
    } catch {
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) return;
    fetchNotifications();
  }, [activeTab, isAuthenticated]);

  /* ── Accept / Reject handler ───────────────────────────────── */
  const handleRespond = async (notifId: string, action: "accepted" | "rejected") => {
    try {
      setActionLoading((prev) => ({ ...prev, [notifId]: true }));
      await notificationsApi.respond(notifId, action);

      // Update the notification in local state
      setNotifications((prev) =>
        prev.map((n) =>
          n._id === notifId ? { ...n, status: action, type: action === "accepted" ? "join_accepted" : "join_rejected" } : n
        )
      );

      showToast(action === "accepted" ? "Request accepted! 🎉" : "Request declined");

      // Decrement unread
      if (unread.requests > 0) {
        setUnread((prev) => ({ ...prev, requests: prev.requests - 1 }));
      }
    } catch (e: any) {
      showToast(e.message || "Action failed", "error");
    } finally {
      setActionLoading((prev) => ({ ...prev, [notifId]: false }));
    }
  };

  /* ── Mark as read ──────────────────────────────────────────── */
  const handleMarkRead = async (notifId: string) => {
    try {
      await notificationsApi.markRead(notifId);
      setNotifications((prev) => prev.map((n) => (n._id === notifId ? { ...n, read: true } : n)));
    } catch {
      // Silent fail
    }
  };

  if (!isAuthenticated) return null;

  return (
    <section className="notifications-page">
      <div className="container">
        {/* ═══ HEADER ═══ */}
        <div className="notif-header">
          <div>
            <h1>Notifications</h1>
            <p>Manage requests, updates and hangout activity</p>
          </div>
          {notifications.length > 0 && (
            <div className="notif-header-meta">
              <span className="material-symbols-outlined">notifications</span>
              {notifications.filter((n) => !n.read).length} unread
            </div>
          )}
        </div>

        {/* ═══ TABS ═══ */}
        <div className="notif-tabs">
          <button
            className={`notif-tab ${activeTab === "all" ? "active" : ""}`}
            onClick={() => setActiveTab("all")}
          >
            All
          </button>
          <button
            className={`notif-tab ${activeTab === "requests" ? "active" : ""}`}
            onClick={() => setActiveTab("requests")}
          >
            Requests
            {unread.requests > 0 && <span className="notif-tab-badge">{unread.requests}</span>}
          </button>
          <button
            className={`notif-tab ${activeTab === "updates" ? "active" : ""}`}
            onClick={() => setActiveTab("updates")}
          >
            Updates
            {unread.updates > 0 && <span className="notif-tab-badge notif-tab-badge-green">{unread.updates}</span>}
          </button>
        </div>

        {/* ═══ LIST ═══ */}
        {loading ? (
          <div className="notif-loading">
            <div className="loading-spinner" />
            <p>Loading notifications...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="notif-empty">
            <span className="material-symbols-outlined">notifications_off</span>
            <h3>
              {activeTab === "all"
                ? "No notifications yet"
                : activeTab === "requests"
                ? "No pending requests"
                : "No updates yet"}
            </h3>
            <p>
              {activeTab === "all"
                ? "When someone joins your hangouts or responds to your requests, you'll see it here."
                : activeTab === "requests"
                ? "Join requests from other users will appear here."
                : "Responses to your join requests will show up here."}
            </p>
          </div>
        ) : (
          <div className="notif-list">
            {notifications.map((n) => {
              const text = getNotificationText(n, currentUserId);
              const isSender = n.sender._id === currentUserId;
              const displayUser = isSender ? n.receiver : n.sender;
              const isSystem = n.type === "system" || n.type === "reminder";
              const isPending = n.status === "pending" && n.type === "join_request";
              const isAccepted = n.status === "accepted";
              const isRejected = n.status === "rejected";
              const isLoading = actionLoading[n._id];

              return (
                <div
                  key={n._id}
                  className={`notif-card glass ${!n.read ? "unread" : ""}`}
                  onClick={() => !n.read && handleMarkRead(n._id)}
                >
                  {/* Unread dot */}
                  {!n.read && <div className="notif-unread-dot" />}

                  {/* Top row */}
                  <div className="notif-top">
                    <div className="notif-user">
                      {isSystem ? (
                        <div className="notif-system-icon">
                          <span className="material-symbols-outlined">campaign</span>
                        </div>
                      ) : displayUser.avatar?.url ? (
                        <Link to={`/profile/${displayUser._id}`}>
                          <img src={displayUser.avatar.url} alt={displayUser.name} />
                        </Link>
                      ) : (
                        <Link to={`/profile/${displayUser._id}`} className="notif-avatar-placeholder">
                          {getInitials(displayUser.name)}
                        </Link>
                      )}

                      <div className="notif-text">
                        <p>
                          {!isSystem && (
                            <Link to={`/profile/${displayUser._id}`} className="notif-sender-name">
                              {displayUser.name}
                            </Link>
                          )}
                          {isSystem && <span className="notif-sender-name">Hangout System</span>}
                          {" "}{text.action}{" "}
                          <Link to={`/hangouts/${n.hangout._id}`} className="notif-hangout-link">
                            {text.highlight}
                          </Link>
                        </p>
                        <span className="notif-time">{timeAgo(n.createdAt)}</span>
                      </div>
                    </div>

                    {/* Status badge */}
                    <span className={`notif-status ${n.status}`}>
                      {isPending && "⏳ "}
                      {isAccepted && "✓ "}
                      {isRejected && "✕ "}
                      {n.status.toUpperCase()}
                    </span>
                  </div>

                  {/* Message quote */}
                  {n.message && isPending && (
                    <div className="notif-message">
                      "{n.message}"
                    </div>
                  )}

                  {/* Hangout context */}
                  {n.hangout.location && (
                    <div className="notif-context">
                      {n.hangout.location?.name && (
                        <span>
                          <span className="material-symbols-outlined">location_on</span>
                          {n.hangout.location.name}
                        </span>
                      )}
                      {n.hangout.startTime && (
                        <span>
                          <span className="material-symbols-outlined">schedule</span>
                          {new Intl.DateTimeFormat("en-US", {
                            weekday: "short", hour: "numeric", minute: "2-digit", hour12: true,
                          }).format(new Date(n.hangout.startTime))}
                        </span>
                      )}
                      {n.hangout.vibe && (
                        <span className="notif-vibe-tag">{n.hangout.vibe}</span>
                      )}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="notif-actions">
                    {/* Pending request → accept/decline */}
                    {isPending && !isSender && (
                      <>
                        <button
                          className="btn btn-primary btn-sm notif-btn-accept"
                          onClick={(e) => { e.stopPropagation(); handleRespond(n._id, "accepted"); }}
                          disabled={isLoading}
                        >
                          {isLoading ? "..." : "Accept Request"}
                        </button>
                        <button
                          className="notif-btn-decline"
                          onClick={(e) => { e.stopPropagation(); handleRespond(n._id, "rejected"); }}
                          disabled={isLoading}
                        >
                          Decline
                        </button>
                      </>
                    )}

                    {/* Accepted → join hangout group link */}
                    {isAccepted && isSender && (
                      <Link
                        to={`/hangouts/${n.hangout._id}`}
                        className="btn btn-primary btn-sm notif-btn-accept"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Join Hangout Group
                      </Link>
                    )}

                    {/* Rejected → info */}
                    {isRejected && isSender && (
                      <div className="notif-rejected-info">
                        <span className="material-symbols-outlined">info</span>
                        The host declined this request. You can browse other hangouts.
                      </div>
                    )}

                    {/* System / reminder → view hangout */}
                    {isSystem && (
                      <Link
                        to={`/hangouts/${n.hangout._id}`}
                        className="btn btn-secondary btn-sm"
                        onClick={(e) => e.stopPropagation()}
                      >
                        View Hangout
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div className={`toast toast-${toast.type}`}>
          <span className="material-symbols-outlined">{toast.type === "success" ? "check_circle" : "error"}</span>
          {toast.message}
        </div>
      )}
    </section>
  );
};

export default NotificationsPage;