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

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message);
        return;
      }

      setMessage(data.message);

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error) {
      console.error(error);

      setError(
        "Unable to connect to the server. Please try again."
      );
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-card register-card">
        <div className="auth-header">
          <p className="section-eyebrow">JOIN CAMPUSMARKET</p>

          <h1>Create your account.</h1>

          <p>
            Join your campus community and connect through
            skills and services.
          </p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full name</label>

            <input
              id="name"
              name="full_name"
              type="text"
              placeholder="Your full name"
              value={formData.full_name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="register-email">
              Email address
            </label>

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
            <label htmlFor="campus">
              Campus / College
            </label>

            <input
              id="campus"
              name="campus"
              type="text"
              placeholder="Your college or campus"
              value={formData.campus}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="register-password">
              Password
            </label>

            <input
              id="register-password"
              name="password"
              type="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {error && (
            <p className="form-error">
              {error}
            </p>
          )}

          {message && (
            <p className="form-success">
              {message}
            </p>
          )}

          <button type="submit" className="auth-submit">
            Create account
          </button>
        </form>

        <div className="auth-divider">
          <span>Already have an account?</span>
        </div>

        <Link to="/login" className="auth-secondary">
          Log in
        </Link>
      </div>
    </main>
  );
}

export default Register;