import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <div className="logo" style={{ color: '#ffffff' }}>
            <span className="logo-badge">CM</span>
            <span>Campus<strong style={{ color: '#a5b4fc' }}>Market</strong></span>
          </div>
          <p>
            The trusted peer-to-peer campus service marketplace by Shnoor International. Discover skilled peers, request services, and offer your own expertise.
          </p>
        </div>

        <div className="footer-column">
          <h4>Explore Marketplace</h4>
          <ul className="footer-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/services">Explore Services</Link></li>
            <li><Link to="/categories">All Categories</Link></li>
            <li><Link to="/#how-it-works">How It Works</Link></li>
          </ul>
        </div>

        <div className="footer-column">
          <h4>For Students</h4>
          <ul className="footer-links">
            <li><Link to="/create-service">Offer a Service</Link></li>
            <li><Link to="/dashboard">Student Dashboard</Link></li>
            <li><Link to="/dashboard/requests">My Requests</Link></li>
            <li><Link to="/dashboard/services">My Listed Services</Link></li>
          </ul>
        </div>

        <div className="footer-column">
          <h4>Account & Support</h4>
          <ul className="footer-links">
            <li><Link to="/login">Log In</Link></li>
            <li><Link to="/register">Create Account</Link></li>
            <li><Link to="/forgot-password">Forgot Password</Link></li>
            <li><Link to="/profile">Profile Settings</Link></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© 2026 CampusMarket by Shnoor International. All rights reserved.</span>
        <span>Built for seamless peer-to-peer campus collaboration.</span>
      </div>
    </footer>
  );
}

export default Footer;