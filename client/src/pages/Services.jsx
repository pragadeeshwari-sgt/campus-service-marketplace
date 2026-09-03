import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { apiFetch } from "../lib/api";
import { SearchIcon, PlusIcon, SparklesIcon, ArrowRightIcon } from "../components/Icons";

const categories = [
  "All",
  "Tutoring",
  "Graphic Design",
  "Photography",
  "Video Editing",
  "Writing",
  "Technology",
  "Event Assistance",
];

function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const selectedCategory = searchParams.get("category") || "All";

  useEffect(() => {
    apiFetch("/services")
      .then((data) => setServices(data.services || []))
      .catch(() => setError("Unable to load services. Please try refreshing."))
      .finally(() => setLoading(false));
  }, []);

  const filteredServices = services.filter((service) => {
    const query = search.toLowerCase().trim();
    return (
      (selectedCategory === "All" || service.category === selectedCategory) &&
      (!query ||
        [service.title, service.description, service.category, service.provider_name].some((val) =>
          val?.toLowerCase().includes(query)
        ))
    );
  });

  return (
    <main className="services-page">
      <section className="services-hero">
        <p className="section-eyebrow">
          <SparklesIcon style={{ width: 14, height: 14 }} /> EXPLORE MARKETPLACE
        </p>
        <h1>Helpful Skills, Close By.</h1>
        <p className="services-intro">
          Browse practical services offered by verified students in your campus community.
        </p>
      </section>

      <section className="services-filter-box">
        <div className="search-input-wrapper">
          <SearchIcon className="search-icon-inside" />
          <input
            id="service-search"
            type="search"
            placeholder="Search services, skills, keywords, or student providers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="category-chips" aria-label="Filter services by category">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              className={selectedCategory === category ? "chip-filter active" : "chip-filter"}
              onClick={() => setSearchParams(category === "All" ? {} : { category })}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 800, margin: 0 }}>
            {selectedCategory === "All" ? "All Campus Services" : `${selectedCategory} Services`}
          </h2>
          <p style={{ margin: '4px 0 0', fontSize: 14, color: 'var(--text-muted)' }}>
            Showing {filteredServices.length} {filteredServices.length === 1 ? 'listing' : 'listings'}
          </p>
        </div>

        <Link to="/create-service" className="offer-service-btn">
          <PlusIcon /> Offer a Service
        </Link>
      </div>

      {loading && (
        <div className="service-grid">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div className="service-card" key={idx} style={{ opacity: 0.6, minHeight: 260 }}>
              <div style={{ height: 20, width: 80, background: 'var(--border-color)', borderRadius: 4, marginBottom: 16 }} />
              <div style={{ height: 24, width: '80%', background: 'var(--border-color)', borderRadius: 4, marginBottom: 12 }} />
              <div style={{ height: 48, width: '100%', background: 'var(--border-color)', borderRadius: 4 }} />
            </div>
          ))}
        </div>
      )}

      {error && <div className="form-error" style={{ marginBottom: 32 }}>{error}</div>}

      {!loading && !error && !filteredServices.length && (
        <div className="empty-services">
          <h3>No services found</h3>
          <p>We couldn't find any services matching your current search or category filter.</p>
          <button
            type="button"
            className="secondary-button"
            style={{ marginTop: 16 }}
            onClick={() => {
              setSearch("");
              setSearchParams({});
            }}
          >
            Clear Filters
          </button>
        </div>
      )}

      {!loading && !error && filteredServices.length > 0 && (
        <div className="service-grid">
          {filteredServices.map((service) => (
            <article className="service-card" key={service.id}>
              <div>
                <div className="service-card-header">
                  <span className="category-tag">{service.category}</span>
                  <span className="service-price-tag">₹{service.price}</span>
                </div>
                <h3>{service.title}</h3>
                <p className="service-description">{service.description}</p>
              </div>

              <div className="service-card-footer">
                <div className="provider-info">
                  <div className="provider-avatar-circle">
                    {service.provider_name?.charAt(0).toUpperCase() || "P"}
                  </div>
                  <div className="provider-details">
                    <h5>{service.provider_name}</h5>
                    <p>{service.campus || "Campus Community"}</p>
                  </div>
                </div>

                <Link
                  to={`/services/${service.id}`}
                  className="primary-button"
                  style={{ padding: '8px 14px', fontSize: 13, minHeight: 36 }}
                >
                  View Details →
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}

export default Services;
