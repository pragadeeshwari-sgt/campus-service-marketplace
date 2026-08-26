import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Unable to read logged-in user:", error);
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, [location.pathname]);

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);

    navigate("/");
  }

  return (
    <nav className="navbar">

      {/* LOGO */}

      <Link to="/" className="logo">
        Campus<span>Market</span>
      </Link>


      {/* NAVIGATION */}

      <div className="nav-links">

        <Link to="/services">
          Explore
        </Link>

        <Link to="/#categories">
          Categories
        </Link>

        <Link to="/#how-it-works">
          How It Works
        </Link>

      </div>


      {/* RIGHT SIDE */}

      <div className="nav-actions">

        {user ? (
          <>
            <Link
              to="/dashboard"
              className="login-btn"
            >
              Dashboard
            </Link>

            <Link
              to="/profile"
              className="signup-btn"
            >
              {user.full_name}
            </Link>

            <button
              type="button"
              className="logout-btn"
              onClick={handleLogout}
            >
              Log out
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="login-btn"
            >
              Log in
            </Link>

            <Link
              to="/register"
              className="signup-btn"
            >
              Get Started
            </Link>
          </>
        )}

      </div>

    </nav>
  );
}

export default Navbar;