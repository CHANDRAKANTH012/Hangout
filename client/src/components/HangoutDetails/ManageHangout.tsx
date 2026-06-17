import { useState } from "react";
import { hangoutsApi, type Hangout } from "../../api/ApiClient";
import "./ManageHangout.css";

interface ManageHangoutProps {
  hangout: Hangout;
  onClose: () => void;
  onUpdate: (updated: Hangout) => void;
}

const VIBES = [
  "chill", "hype", "study", "party", "sports", "networking",
  "gaming", "travel", "explore", "binge", "productive", "mysterious",
  "urban", "creative", "deep-talk", "nature", "food-run", "adventure",
];

const CATEGORIES = ["indoor", "outdoor", "online", "nightlife"];

const ManageHangout = ({ hangout, onClose, onUpdate }: ManageHangoutProps) => {
  const [form, setForm] = useState({
    title: hangout.title,
    description: hangout.description,
    vibe: hangout.vibe,
    category: hangout.category,
    locationName: hangout.location.name,
    locationAddress: hangout.location.address || "",
    startTime: new Date(hangout.startTime).toISOString().slice(0, 16),
    endTime: hangout.endTime
      ? new Date(hangout.endTime).toISOString().slice(0, 16)
      : "",
    maxParticipants: hangout.maxParticipants,
    approvalRequired: hangout.approvalRequired,
    tags: hangout.tags.join(", "),
    message: hangout.message || "",
    restrictions: hangout.restrictions || "",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked :
        type === "number" ? parseInt(value) || 0 :
        value,
    }));
  };

  const handleSave = async () => {
    if (!form.title.trim()) {
      setError("Title is required");
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const updateData: Record<string, any> = {
        title: form.title,
        description: form.description,
        vibe: form.vibe,
        category: form.category,
        locationName: form.locationName,
        locationAddress: form.locationAddress,
        startTime: new Date(form.startTime).toISOString(),
        maxParticipants: form.maxParticipants,
        approvalRequired: form.approvalRequired,
        tags: form.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        message: form.message,
        restrictions: form.restrictions,
      };

      if (form.endTime) {
        updateData.endTime = new Date(form.endTime).toISOString();
      }

      const res: any = await hangoutsApi.update(hangout._id, updateData);
      onUpdate(res.hangout);
    } catch (e: any) {
      setError(e.message || "Failed to update hangout");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="manage-overlay" onClick={onClose}>
      <div className="manage-modal glass-panel" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="manage-header">
          <h2>Manage Hangout</h2>
          <button className="manage-close" onClick={onClose}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {error && (
          <div className="manage-error">
            <span className="material-symbols-outlined">error</span>
            {error}
          </div>
        )}

        {/* Form */}
        <div className="manage-form">
          {/* Title */}
          <div className="manage-field">
            <label>Title</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              maxLength={100}
            />
          </div>

          {/* Description */}
          <div className="manage-field">
            <label>Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              maxLength={1000}
            />
          </div>

          {/* Vibe + Category */}
          <div className="manage-row">
            <div className="manage-field">
              <label>Vibe</label>
              <select name="vibe" value={form.vibe} onChange={handleChange}>
                {VIBES.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </div>
            <div className="manage-field">
              <label>Category</label>
              <select name="category" value={form.category} onChange={handleChange}>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Location */}
          <div className="manage-row">
            <div className="manage-field">
              <label>Location Name</label>
              <input
                type="text"
                name="locationName"
                value={form.locationName}
                onChange={handleChange}
              />
            </div>
            <div className="manage-field">
              <label>Address</label>
              <input
                type="text"
                name="locationAddress"
                value={form.locationAddress}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Time */}
          <div className="manage-row">
            <div className="manage-field">
              <label>Start Time</label>
              <input
                type="datetime-local"
                name="startTime"
                value={form.startTime}
                onChange={handleChange}
              />
            </div>
            <div className="manage-field">
              <label>End Time</label>
              <input
                type="datetime-local"
                name="endTime"
                value={form.endTime}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Max Participants + Approval */}
          <div className="manage-row">
            <div className="manage-field">
              <label>Max Participants</label>
              <input
                type="number"
                name="maxParticipants"
                value={form.maxParticipants}
                onChange={handleChange}
                min={2}
                max={100}
              />
            </div>
            <div className="manage-field manage-toggle-field">
              <label>Approval Required</label>
              <label className="toggle">
                <input
                  type="checkbox"
                  name="approvalRequired"
                  checked={form.approvalRequired}
                  onChange={handleChange}
                />
                <span className="toggle-slider" />
              </label>
            </div>
          </div>

          {/* Tags */}
          <div className="manage-field">
            <label>Tags (comma separated)</label>
            <input
              type="text"
              name="tags"
              value={form.tags}
              onChange={handleChange}
              placeholder="chill, coffee, casual"
            />
          </div>

          {/* Message */}
          <div className="manage-field">
            <label>Message for participants</label>
            <input
              type="text"
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Bring good vibes only!"
              maxLength={500}
            />
          </div>

          {/* Restrictions */}
          <div className="manage-field">
            <label>Restrictions</label>
            <input
              type="text"
              name="restrictions"
              value={form.restrictions}
              onChange={handleChange}
              placeholder="No pets, bring ID"
              maxLength={200}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="manage-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageHangout;
