import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    campus: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Registration failed. Please check details.");
        return;
      }

      setMessage(data.message || "Account created successfully! Redirecting to login...");

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (error) {
      console.error(error);
      setError("Unable to connect to the server. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-card" style={{ maxWidth: 480 }}>
        <div className="auth-header">
          <p className="section-eyebrow" style={{ justifyContent: 'center' }}>JOIN CAMPUSMARKET</p>
          <h1>Create Your Account</h1>
          <p>Join your campus peer network to offer skills and request student services.</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full name</label>
            <input
              id="name"
              name="full_name"
              type="text"
              placeholder="e.g. Alex Rivera"
              value={formData.full_name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="register-email">Email address</label>
            <input
              id="register-email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="campus">Campus / College</label>
            <input
              id="campus"
              name="campus"
              type="text"
              placeholder="e.g. Shnoor International Campus"
              value={formData.campus}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="register-password">Password</label>
            <input
              id="register-password"
              name="password"
              type="password"
              placeholder="Create a secure password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {error && <div className="form-error">{error}</div>}
          {message && <div className="form-success">{message}</div>}

          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? "Creating Account..." : "Create Account →"}
          </button>
        </form>

        <div className="auth-divider">
          <span>Already have an account?</span>
        </div>

        <Link to="/login" className="auth-secondary-btn">
          Log in to Account
        </Link>
      </div>
    </main>
  );
}

export default Register;