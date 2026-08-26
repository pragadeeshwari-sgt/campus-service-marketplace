function ServiceSearch() {
  return (
    <section className="search-section">
      <div className="search-heading">
        <p className="section-eyebrow">EXPLORE THE CAMPUS</p>

        <h2>What can we help you find?</h2>

        <p>
          Browse services offered by students and find the right
          person for what you need.
        </p>
      </div>

      <div className="search-box">
        <span className="search-icon">⌕</span>

        <input
          type="text"
          placeholder="Search for a service..."
        />

        <button>Search</button>
      </div>

      <div className="category-section">
        <div className="category-heading">
          <h3>Popular categories</h3>

          <button className="view-all">
            View all →
          </button>
        </div>

        <div className="category-grid">
          <button className="category-card">
            <span className="category-icon">✦</span>

            <span>
              <strong>Tutoring</strong>
              <small>Academic help</small>
            </span>
          </button>

          <button className="category-card">
            <span className="category-icon">◈</span>

            <span>
              <strong>Design</strong>
              <small>Creative services</small>
            </span>
          </button>

          <button className="category-card">
            <span className="category-icon">⌘</span>

            <span>
              <strong>Technology</strong>
              <small>Tech & coding</small>
            </span>
          </button>

          <button className="category-card">
            <span className="category-icon">◌</span>

            <span>
              <strong>Photography</strong>
              <small>Photos & events</small>
            </span>
          </button>

          <button className="category-card">
            <span className="category-icon">Aa</span>

            <span>
              <strong>Writing</strong>
              <small>Content & editing</small>
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}

export default ServiceSearch;