import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../lib/api";
import { ArrowRightIcon, StarIcon } from "./Icons";

function FeaturedServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch("/services")
      .then((data) => setServices((data.services || []).slice(0, 6)))
      .catch(() => setServices([]))
      .finally(() => setLoading(false));
  }, []);

  if (!loading && !services.length) return null;

  return (
    <section className="featured-section">
      <div className="featured-container">
        <div className="section-heading" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <p className="section-eyebrow">FEATURED LISTINGS</p>
            <h2>Popular Services On Campus</h2>
          </div>
          <Link to="/services" className="secondary-button">
            View All Services <ArrowRightIcon />
          </Link>
        </div>

        <div className="service-grid">
          {loading
            ? Array.from({ length: 3 }).map((_, idx) => (
                <div className="service-card" key={idx} style={{ opacity: 0.6, minHeight: 240 }}>
                  <div style={{ height: 20, width: 80, background: 'var(--border-color)', borderRadius: 4, marginBottom: 16 }} />
                  <div style={{ height: 24, width: '80%', background: 'var(--border-color)', borderRadius: 4, marginBottom: 12 }} />
                  <div style={{ height: 48, width: '100%', background: 'var(--border-color)', borderRadius: 4 }} />
                </div>
              ))
            : services.map((service) => (
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
                    <Link to={`/services/${service.id}`} className="primary-button" style={{ padding: '8px 14px', fontSize: 13, minHeight: 36 }}>
                      View Service →
                    </Link>
                  </div>
                </article>
              ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturedServices;