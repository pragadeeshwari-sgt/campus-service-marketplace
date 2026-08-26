import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        Campus<span>Market</span>
      </Link>

      <div className="nav-links">
        <Link to="/services">Explore</Link>
        <Link to="/services">Categories</Link>
        <Link to="/#how-it-works">How It Works</Link>
      </div>

      <div className="nav-actions">
        <Link to="/login" className="login-btn">
          Log in
        </Link>

        <Link to="/register" className="signup-btn">
          Get Started
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;