import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { PlusIcon, LogOutIcon, MenuIcon, CloseIcon, SparklesIcon } from "./Icons";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

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

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  }

  const isHomeActive = location.pathname === "/" && !location.hash;
  const isServicesActive = location.pathname === "/services";
  const isCategoriesActive = location.pathname === "/categories";
  const isHowActive = location.pathname === "/" && location.hash === "#how-it-works";

  return (
    <header className="navbar-wrapper">
      <nav className="navbar">
        {/* BRAND LOGO */}
        <div className="brand-group">
          <Link to="/" className="logo">
            <span className="logo-badge">CM</span>
            <span>Campus<strong style={{ color: 'var(--accent)' }}>Market</strong></span>
          </Link>
          <span className="logo-tagline">Shnoor International</span>
        </div>

        {/* DESKTOP NAV LINKS */}
        <div className="nav-links">
          <Link to="/" className={isHomeActive ? "nav-link active" : "nav-link"}>
            Home
          </Link>
          <Link to="/services" className={isServicesActive ? "nav-link active" : "nav-link"}>
            Explore
          </Link>
          <Link to="/categories" className={isCategoriesActive ? "nav-link active" : "nav-link"}>
            Categories
          </Link>
          <Link to="/#how-it-works" className={isHowActive ? "nav-link active" : "nav-link"}>
            How It Works
          </Link>
        </div>

        {/* RIGHT SIDE ACTIONS */}
        <div className="nav-actions">
          {/* OFFER A SERVICE CTA BUTTON */}
          <Link to="/create-service" className="offer-service-btn">
            <PlusIcon />
            <span>Offer a Service</span>
          </Link>

          {user ? (
            <>
              <Link to="/dashboard" className="secondary-button" style={{ padding: '8px 14px', minHeight: '38px', fontSize: '13px' }}>
                Dashboard
              </Link>

              <Link to="/profile" className="nav-user-badge">
                <div className="nav-avatar">
                  {user.full_name?.charAt(0).toUpperCase() || "U"}
                </div>
                <span>{user.full_name?.split(' ')[0] || "Profile"}</span>
              </Link>

              <button
                type="button"
                className="logout-btn-nav"
                onClick={handleLogout}
                title="Log out"
              >
                <LogOutIcon />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="secondary-button" style={{ padding: '8px 16px', minHeight: '38px', fontSize: '13px' }}>
                Log in
              </Link>

              <Link to="/register" className="primary-button" style={{ padding: '8px 16px', minHeight: '38px', fontSize: '13px' }}>
                Get Started
              </Link>
            </>
          )}

          {/* MOBILE TOGGLE */}
          <button
            type="button"
            className="mobile-toggle"
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </nav>

      {/* MOBILE NAV OVERLAY */}
      {menuOpen && (
        <div className="nav-links-mobile">
          <Link to="/" className={isHomeActive ? "nav-link active" : "nav-link"}>
            Home
          </Link>
          <Link to="/services" className={isServicesActive ? "nav-link active" : "nav-link"}>
            Explore Services
          </Link>
          <Link to="/categories" className={isCategoriesActive ? "nav-link active" : "nav-link"}>
            Categories
          </Link>
          <Link to="/#how-it-works" className={isHowActive ? "nav-link active" : "nav-link"}>
            How It Works
          </Link>
          <hr style={{ margin: '8px 0', borderColor: 'var(--border-color)' }} />
          <Link to="/create-service" className="offer-service-btn" style={{ justifyContent: 'center' }}>
            <PlusIcon /> Offer a Service
          </Link>
        </div>
      )}
    </header>
  );
}

export default Navbar;
