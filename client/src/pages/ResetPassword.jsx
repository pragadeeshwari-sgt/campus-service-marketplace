import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { apiFetch } from "../lib/api";

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setError("");
    if (!token) return setError("This password reset link is invalid or has expired.");
    if (password.length < 8) return setError("Your new password must be at least 8 characters.");
    if (password !== confirmPassword) return setError("Your passwords do not match.");
    setLoading(true);
    try {
      const data = await apiFetch("/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ token, password }),
      });
      setMessage(data.message || "Password reset successfully!");
      setPassword("");
      setConfirmPassword("");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <p className="section-eyebrow" style={{ justifyContent: 'center' }}>ACCOUNT RECOVERY</p>
          <h1>Set New Password</h1>
          <p>Create a new secure password for your CampusMarket account.</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="new-password">New password</label>
            <input
              id="new-password"
              type="password"
              placeholder="Min. 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirm-password">Confirm new password</label>
            <input
              id="confirm-password"
              type="password"
              placeholder="Re-enter password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          {error && <div className="form-error">{error}</div>}
          {message && <div className="form-success">{message}</div>}

          <button type="submit" className="auth-submit" disabled={loading || Boolean(message)}>
            {loading ? "Updating password..." : "Update Password"}
          </button>
        </form>

        <div className="auth-divider">
          <span>Ready to log in?</span>
        </div>

        <Link to="/login" className="auth-secondary-btn">
          Log in to Account
        </Link>
      </div>
    </main>
  );
}

export default ResetPassword;
