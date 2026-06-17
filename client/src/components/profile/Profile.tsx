import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { usersApi, type Hangout } from "../../api/ApiClient";
import "./Profile.css";

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

/* ─── COMPONENT ──────────────────────────────────────────────── */
const Profile = () => {
  const { user, isAuthenticated, updateUser, logout } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState({ hangoutsCreated: 0, hangoutsJoined: 0, peopleMet: 0 });
  const [hangouts, setHangouts] = useState<Hangout[]>([]);
  const [activeTab, setActiveTab] = useState<"created" | "joined" | "past">("created");
  const [loading, setLoading] = useState(true);
  const [hangoutsLoading, setHangoutsLoading] = useState(false);

  // Edit profile state
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", bio: "", username: "" });
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  // Settings state
  const [settings, setSettings] = useState({
    pushNotifications: true,
    privateProfile: false,
    theme: "light" as "light" | "dark",
  });
  const [settingsSaving, setSettingsSaving] = useState(false);

  // Toast
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  /* ── Redirect if not logged in ─────────────────────────────── */
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  /* ── Fetch profile stats ───────────────────────────────────── */
  useEffect(() => {
    if (!user) return;
    const fetchStats = async () => {
      try {
        setLoading(true);
        const uid = user._id || user.id;
        const res: any = await usersApi.getProfile(uid!);
        setStats(res.stats);
        // Sync settings from server
        if (res.user?.settings) {
          setSettings(res.user.settings);
        }
      } catch {
        // Stats fail silently — profile still renders
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [user]);

  /* ── Fetch hangouts by tab ─────────────────────────────────── */
  useEffect(() => {
    if (!user) return;
    const fetchHangouts = async () => {
      try {
        setHangoutsLoading(true);
        const res: any = await usersApi.getMyHangouts(activeTab);
        setHangouts(res.hangouts || []);
      } catch {
        setHangouts([]);
      } finally {
        setHangoutsLoading(false);
      }
    };
    fetchHangouts();
  }, [user, activeTab]);

  /* ── Edit profile handlers ─────────────────────────────────── */
  const startEditing = () => {
    if (!user) return;
    setEditForm({ name: user.name, bio: user.bio || "", username: user.username });
    setEditError(null);
    setEditing(true);
  };

  const cancelEditing = () => {
    setEditing(false);
    setEditError(null);
  };

  const saveProfile = async () => {
    if (!editForm.name.trim()) {
      setEditError("Name is required");
      return;
    }
    try {
      setEditLoading(true);
      setEditError(null);
      const res: any = await usersApi.updateProfile({
        name: editForm.name.trim(),
        bio: editForm.bio.trim(),
        username: editForm.username.trim(),
      });
      updateUser(res.user);
      setEditing(false);
      showToast("Profile updated! ✅");
    } catch (e: any) {
      setEditError(e.message || "Failed to update profile");
    } finally {
      setEditLoading(false);
    }
  };

  /* ── Settings toggle handler ───────────────────────────────── */
  const toggleSetting = async (key: "pushNotifications" | "privateProfile") => {
    const updated = { ...settings, [key]: !settings[key] };
    setSettings(updated);
    try {
      setSettingsSaving(true);
      await usersApi.updateProfile({ settings: updated });
      // Also update localStorage user
      if (user) updateUser({ ...user, settings: updated } as any);
    } catch {
      // Revert on failure
      setSettings(settings);
      showToast("Failed to save setting", "error");
    } finally {
      setSettingsSaving(false);
    }
  };

  const toggleTheme = async () => {
    const newTheme = settings.theme === "light" ? "dark" : "light";
    const updated = { ...settings, theme: newTheme as "light" | "dark" };
    setSettings(updated);
    try {
      await usersApi.updateProfile({ settings: updated });
      if (user) updateUser({ ...user, settings: updated } as any);
    } catch {
      setSettings(settings);
    }
  };

  /* ── Handle avatar upload ──────────────────────────────────── */
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      showToast("Image must be under 2MB", "error");
      return;
    }

    const formData = new FormData();
    formData.append("avatar", file);
    try {
      const res: any = await usersApi.updateProfile(formData);
      updateUser(res.user);
      showToast("Avatar updated! 📸");
    } catch {
      showToast("Failed to upload avatar", "error");
    }
  };

  /* ── Loading / Auth guard ──────────────────────────────────── */
  if (!user) return null;

  return (
    <section className="profile-page">
      <div className="container">
        {/* ═══ PROFILE HEADER CARD ═══ */}
        <div className="profile-header-card glass">
          <div className="profile-header-top">
            {/* Avatar */}
            <div className="profile-avatar-wrapper">
              {user.avatar?.url ? (
                <img src={user.avatar.url} alt={user.name} className="profile-avatar" />
              ) : (
                <div className="profile-avatar-placeholder">{getInitials(user.name)}</div>
              )}
              <label className="profile-avatar-upload" htmlFor="avatar-input">
                <span className="material-symbols-outlined">photo_camera</span>
              </label>
              <input
                type="file"
                id="avatar-input"
                accept="image/*"
                hidden
                onChange={handleAvatarUpload}
              />
            </div>

            {/* Info */}
            <div className="profile-info">
              {editing ? (
                <div className="profile-edit-form">
                  {editError && (
                    <div className="profile-edit-error">
                      <span className="material-symbols-outlined">error</span>
                      {editError}
                    </div>
                  )}
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm((p) => ({ ...p, name: e.target.value }))}
                    placeholder="Full name"
                    maxLength={50}
                    className="profile-edit-input"
                  />
                  <input
                    type="text"
                    value={editForm.username}
                    onChange={(e) => setEditForm((p) => ({ ...p, username: e.target.value }))}
                    placeholder="Username"
                    maxLength={30}
                    className="profile-edit-input"
                  />
                  <textarea
                    value={editForm.bio}
                    onChange={(e) => setEditForm((p) => ({ ...p, bio: e.target.value }))}
                    placeholder="Tell people about yourself..."
                    maxLength={200}
                    rows={3}
                    className="profile-edit-textarea"
                  />
                  <div className="profile-edit-actions">
                    <button className="btn btn-secondary btn-sm" onClick={cancelEditing}>Cancel</button>
                    <button className="btn btn-primary btn-sm" onClick={saveProfile} disabled={editLoading}>
                      {editLoading ? "Saving..." : "Save"}
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <h1 className="profile-name">{user.name}</h1>
                  <p className="profile-username">@{user.username}</p>
                  <p className="profile-bio">{user.bio || "No bio yet — tell people about yourself!"}</p>
                </>
              )}
            </div>

            {/* Edit button */}
            {!editing && (
              <button className="btn btn-secondary btn-sm profile-edit-btn" onClick={startEditing}>
                Edit Profile
              </button>
            )}
          </div>

          {/* Stats */}
          <div className="profile-stats">
            <div className="profile-stat">
              <span className="stat-value">{loading ? "—" : stats.hangoutsCreated}</span>
              <span className="stat-label">Hangouts created</span>
            </div>
            <div className="profile-stat">
              <span className="stat-value">{loading ? "—" : stats.hangoutsJoined}</span>
              <span className="stat-label">Hangouts Joined</span>
            </div>
            <div className="profile-stat">
              <span className="stat-value">{loading ? "—" : stats.peopleMet}</span>
              <span className="stat-label">People met</span>
            </div>
          </div>
        </div>

        {/* ═══ MY HANGOUTS SECTION ═══ */}
        <div className="profile-hangouts-section glass">
          <div className="profile-hangouts-header">
            <h2>My Hangouts</h2>
            <div className="profile-tabs">
              {(["created", "joined", "past"] as const).map((tab) => (
                <button
                  key={tab}
                  className={`profile-tab ${activeTab === tab ? "active" : ""}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {hangoutsLoading ? (
            <div className="profile-hangouts-loading">
              <div className="loading-spinner" />
            </div>
          ) : hangouts.length === 0 ? (
            <div className="profile-hangouts-empty">
              <span className="material-symbols-outlined">event_busy</span>
              <p>
                {activeTab === "created"
                  ? "You haven't created any hangouts yet"
                  : activeTab === "joined"
                  ? "You haven't joined any hangouts"
                  : "No past hangouts"}
              </p>
              {activeTab === "created" && (
                <Link to="/create" className="btn btn-primary btn-sm">Create One</Link>
              )}
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

        {/* ═══ ACCOUNT SETTINGS ═══ */}
        <div className="profile-settings-section glass">
          <h2>Account Settings</h2>

          <div className="settings-list">
            {/* Push Notifications */}
            <div className="settings-item">
              <div className="settings-icon-wrap">
                <span className="material-symbols-outlined">notifications_active</span>
              </div>
              <div className="settings-info">
                <h4>Push Notifications</h4>
                <p>Get alerts for new invites and updates</p>
              </div>
              <label className="toggle">
                <input
                  type="checkbox"
                  checked={settings.pushNotifications}
                  onChange={() => toggleSetting("pushNotifications")}
                  disabled={settingsSaving}
                />
                <span className="toggle-slider" />
              </label>
            </div>

            {/* Private Profile */}
            <div className="settings-item">
              <div className="settings-icon-wrap">
                <span className="material-symbols-outlined">lock</span>
              </div>
              <div className="settings-info">
                <h4>Private Profile</h4>
                <p>Only approved friends can see your activity</p>
              </div>
              <label className="toggle">
                <input
                  type="checkbox"
                  checked={settings.privateProfile}
                  onChange={() => toggleSetting("privateProfile")}
                  disabled={settingsSaving}
                />
                <span className="toggle-slider" />
              </label>
            </div>

            {/* Display Theme */}
            <div className="settings-item">
              <div className="settings-icon-wrap">
                <span className="material-symbols-outlined">palette</span>
              </div>
              <div className="settings-info">
                <h4>Display Theme</h4>
                <p>Switch between Light and Dark mode</p>
              </div>
              <div className="theme-toggle">
                <button
                  className={`theme-btn ${settings.theme === "light" ? "active" : ""}`}
                  onClick={() => settings.theme !== "light" && toggleTheme()}
                >
                  <span className="material-symbols-outlined">light_mode</span>
                </button>
                <button
                  className={`theme-btn ${settings.theme === "dark" ? "active" : ""}`}
                  onClick={() => settings.theme !== "dark" && toggleTheme()}
                >
                  <span className="material-symbols-outlined">dark_mode</span>
                </button>
              </div>
            </div>
          </div>

          {/* Danger zone */}
          <div className="settings-danger">
            <button className="danger-link">Change Password</button>
            <button className="danger-link danger-destructive" onClick={() => { logout(); navigate("/"); }}>
              Deactivate Account
            </button>
          </div>
        </div>
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

export default Profile;
