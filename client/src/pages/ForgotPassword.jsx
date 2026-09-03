import { useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../lib/api";
import { ArrowLeftIcon } from "../components/Icons";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);
    try {
      const data = await apiFetch("/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      setMessage(data.message || "A reset link has been sent to your email.");
    } catch (requestError) {
      setError(requestError.message || "Failed to process request. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <p className="section-eyebrow" style={{ justifyContent: 'center' }}>ACCOUNT RECOVERY</p>
          <h1>Reset Password</h1>
          <p>Enter your account email and we'll send a secure password reset link.</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="recovery-email">Email address</label>
            <input
              id="recovery-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>

          {error && <div className="form-error">{error}</div>}
          {message && <div className="form-success">{message}</div>}

          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? "Sending link..." : "Send Reset Link"}
          </button>
        </form>

        <div className="auth-divider">
          <span>Remembered your password?</span>
        </div>

        <Link to="/login" className="auth-secondary-btn" style={{ gap: 6 }}>
          <ArrowLeftIcon /> Back to Log In
        </Link>
      </div>
    </main>
  );
}

export default ForgotPassword;
