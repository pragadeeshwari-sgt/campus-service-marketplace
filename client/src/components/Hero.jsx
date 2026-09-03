import { Link } from "react-router-dom";
import { ArrowRightIcon, PlusIcon, SparklesIcon, StarIcon, CheckCircleIcon } from "./Icons";

function Hero() {
  return (
    <section className="home-hero">
      <div className="hero-content">
        <div className="hero-pill">
          <span className="hero-pill-dot" />
          <SparklesIcon />
          <span>OFFICIAL SHNOOR INTERNATIONAL CAMPUS MARKETPLACE</span>
        </div>

        <h1 className="hero-title">
          Discover Trusted Peer Services. <span>Right On Campus.</span>
        </h1>

        <p className="hero-description">
          Connect with talented students for tutoring, graphic design, photography, coding support, and event help. Share your skills, earn on campus, and build community.
        </p>

        <div className="hero-actions">
          <Link to="/services" className="primary-button" style={{ padding: '13px 24px', fontSize: '15px' }}>
            Explore All Services <ArrowRightIcon />
          </Link>

          <Link to="/create-service" className="offer-service-btn" style={{ padding: '13px 24px', fontSize: '15px' }}>
            <PlusIcon /> Offer a Service
          </Link>
        </div>

        <div className="hero-stats">
          <div className="stat-item">
            <h4>500+</h4>
            <p>Campus Listings</p>
          </div>
          <div className="stat-item">
            <h4>100%</h4>
            <p>Peer Verified</p>
          </div>
          <div className="stat-item">
            <h4>4.9 ★</h4>
            <p>Community Rating</p>
          </div>
        </div>
      </div>

      <div className="hero-visual">
        <div className="hero-card-preview">
          <div className="preview-header">
            <span className="preview-badge">
              <SparklesIcon style={{ width: 14, height: 14 }} /> Live Campus Listings
            </span>
            <span className="preview-live-tag">Active Today</span>
          </div>

          <div className="preview-services-list">
            <div className="preview-service-item">
              <div className="preview-service-info">
                <div className="preview-service-icon">✦</div>
                <div className="preview-service-text">
                  <h5>Calculus & Physics Tutoring</h5>
                  <p>1-on-1 Prep · Engineering Dept</p>
                </div>
              </div>
              <span className="preview-service-price">₹300</span>
            </div>

            <div className="preview-service-item">
              <div className="preview-service-info">
                <div className="preview-service-icon" style={{ background: '#fef3c7', color: '#d97706' }}>🎨</div>
                <div className="preview-service-text">
                  <h5>Event Poster & Design</h5>
                  <p>Posters & Social Media Kit</p>
                </div>
              </div>
              <span className="preview-service-price">₹250</span>
            </div>

            <div className="preview-service-item">
              <div className="preview-service-info">
                <div className="preview-service-icon" style={{ background: '#e0e7ff', color: '#4f46e5' }}>💻</div>
                <div className="preview-service-text">
                  <h5>Web App Bug Fixing</h5>
                  <p>React & Node.js Support</p>
                </div>
              </div>
              <span className="preview-service-price">₹500</span>
            </div>
          </div>

          <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 13, color: 'var(--text-muted)' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <CheckCircleIcon style={{ color: '#16a34a', width: 16, height: 16 }} /> Safe peer transactions
            </span>
            <Link to="/services" style={{ color: 'var(--accent)', fontWeight: 700, textDecoration: 'none' }}>
              Explore ↗
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;