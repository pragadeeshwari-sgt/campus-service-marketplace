import { Link } from "react-router-dom";
function Hero() {
  return (
    <section className="hero-section">
      <div className="hero-content">
        <p className="hero-eyebrow">CAMPUS SERVICE MARKETPLACE</p>

        <h1>
          Find the right service.
          <br />
          <span>Right on your campus.</span>
        </h1>

        <p className="hero-description">
          Discover trusted services offered by students around you.
          Get help, share your skills, and build your campus community.
        </p>

        <div className="hero-actions">
          <button className="hero-primary">
            Explore Services
          </button>

          <button className="hero-secondary">
            Offer a Service
          </button>
        </div>
      </div>

      <div className="hero-visual">
        <div className="service-preview">
          <div className="preview-header">
            <span>Featured services</span>
            <span className="preview-dot">●</span>
          </div>

          <div className="service-item">
            <div className="service-icon">✦</div>

            <div className="service-info">
              <h3>Graphic Design</h3>
              <p>Posters · Presentations</p>
            </div>

            <strong>₹300</strong>
          </div>

          <div className="service-item">
            <div className="service-icon">✦</div>

            <div className="service-info">
              <h3>Math Tutoring</h3>
              <p>1-on-1 · Online</p>
            </div>

            <strong>₹200</strong>
          </div>

          <div className="service-item">
            <div className="service-icon">✦</div>

            <div className="service-info">
              <h3>Video Editing</h3>
              <p>Reels · Projects</p>
            </div>

            <strong>₹500</strong>
          </div>

          <div className="preview-footer">
            <span>Available on campus</span>
            <span>→</span>
          </div>
        </div>

        <div className="floating-label">
          <span>●</span> Students helping students
        </div>
      </div>
    </section>
  );
}

export default Hero;