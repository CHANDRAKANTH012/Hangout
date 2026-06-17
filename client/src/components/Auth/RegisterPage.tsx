import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Auth.css";

/* ─── PASSWORD STRENGTH ──────────────────────────────────────── */
const getPasswordStrength = (pw: string): { level: number; label: string; color: string } => {
  if (!pw) return { level: 0, label: "", color: "" };
  let score = 0;
  if (pw.length >= 6) score++;
  if (pw.length >= 10) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;

  if (score <= 1) return { level: 1, label: "Too weak", color: "#ef4444" };
  if (score <= 2) return { level: 2, label: "Weak", color: "#f59e0b" };
  if (score <= 3) return { level: 3, label: "Fair", color: "#eab308" };
  if (score <= 4) return { level: 4, label: "Strong", color: "#22c55e" };
  return { level: 5, label: "Very strong", color: "#10b981" };
};

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const strength = useMemo(() => getPasswordStrength(form.password), [form.password]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError(null);
  };

  // Auto-generate username from name
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setForm((prev) => ({
      ...prev,
      name,
      // Only auto-fill username if user hasn't manually changed it
      ...(prev.username === "" || prev.username === prev.name.toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "")
        ? { username: name.toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "") }
        : {}),
    }));
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!form.name || !form.email || !form.password) {
      setError("Please fill in all required fields");
      return;
    }
    if (form.name.length < 2) {
      setError("Name must be at least 2 characters");
      return;
    }
    if (form.username && form.username.length < 3) {
      setError("Username must be at least 3 characters");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const username = form.username || form.name.toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "");
      await register(form.name, username, form.email, form.password);
      navigate("/");
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-page">
      <div className="auth-container">
        {/* Decorative blobs */}
        <div className="auth-blob auth-blob-1" />
        <div className="auth-blob auth-blob-2" />

        <div className="auth-card glass-panel">
          {/* Header */}
          <div className="auth-header">
            <h1>Join Hangout</h1>
            <p>Start your next urban adventure.</p>
          </div>

          {/* Form */}
          <form className="auth-form" onSubmit={handleSubmit}>
            {error && (
              <div className="auth-error">
                <span className="material-symbols-outlined">error</span>
                {error}
              </div>
            )}

            {/* Full Name */}
            <div className="auth-field">
              <label htmlFor="reg-name">Full Name</label>
              <div className="auth-input-wrapper">
                <span className="material-symbols-outlined auth-input-icon">
                  person
                </span>
                <input
                  id="reg-name"
                  type="text"
                  name="name"
                  placeholder="Alex Rivera"
                  value={form.name}
                  onChange={handleNameChange}
                  autoComplete="name"
                  maxLength={50}
                />
              </div>
            </div>

            {/* Username (optional - auto generated) */}
            <div className="auth-field">
              <label htmlFor="reg-username">
                Username
                <span className="auth-label-hint">auto-generated</span>
              </label>
              <div className="auth-input-wrapper">
                <span className="material-symbols-outlined auth-input-icon">
                  alternate_email
                </span>
                <input
                  id="reg-username"
                  type="text"
                  name="username"
                  placeholder="alex_rivera"
                  value={form.username}
                  onChange={handleChange}
                  autoComplete="username"
                  maxLength={30}
                />
              </div>
            </div>

            {/* Email */}
            <div className="auth-field">
              <label htmlFor="reg-email">Email</label>
              <div className="auth-input-wrapper">
                <span className="material-symbols-outlined auth-input-icon">
                  mail
                </span>
                <input
                  id="reg-email"
                  type="email"
                  name="email"
                  placeholder="alex@example.com"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div className="auth-field">
              <label htmlFor="reg-password">Password</label>
              <div className="auth-input-wrapper">
                <span className="material-symbols-outlined auth-input-icon">
                  lock
                </span>
                <input
                  id="reg-password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Create password"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                  minLength={6}
                />
                <button
                  type="button"
                  className="auth-toggle-pw"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  <span className="material-symbols-outlined">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>

              {/* Strength meter */}
              {form.password && (
                <div className="auth-strength">
                  <div className="auth-strength-bar">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className="auth-strength-segment"
                        style={{
                          background:
                            i <= strength.level ? strength.color : "rgba(0,0,0,0.08)",
                        }}
                      />
                    ))}
                  </div>
                  <span
                    className="auth-strength-label"
                    style={{ color: strength.color }}
                  >
                    {strength.label}
                  </span>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="auth-field">
              <label htmlFor="reg-confirm">Confirm Password</label>
              <div className="auth-input-wrapper">
                <span className="material-symbols-outlined auth-input-icon">
                  verified_user
                </span>
                <input
                  id="reg-confirm"
                  type={showConfirm ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Repeat password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="auth-toggle-pw"
                  onClick={() => setShowConfirm(!showConfirm)}
                  tabIndex={-1}
                >
                  <span className="material-symbols-outlined">
                    {showConfirm ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
              {form.confirmPassword && form.password !== form.confirmPassword && (
                <span className="auth-mismatch">Passwords don't match</span>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="btn btn-primary btn-lg auth-submit"
              disabled={loading}
            >
              {loading ? <span className="auth-spinner" /> : "Create Account"}
            </button>
          </form>

          {/* Footer link */}
          <p className="auth-footer">
            Already a member?{" "}
            <Link to="/login" className="auth-link">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default RegisterPage;
