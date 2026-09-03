import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { apiFetch, getStoredUser } from "../lib/api";
import { ArrowLeftIcon, CheckCircleIcon, ShieldCheckIcon, UserIcon, ClockIcon } from "../components/Icons";

function ServiceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetchService() {
      try {
        const data = await apiFetch(`/services/${id}`);
        setService(data.service);
      } catch (err) {
        setError(err.message || "Unable to load service details.");
      } finally {
        setLoading(false);
      }
    }
    fetchService();
  }, [id]);

  async function requestService() {
    const user = getStoredUser();
    if (!user?.id) {
      navigate("/login");
      return;
    }
    if (String(user.id) === String(service.provider_id)) {
      setError("You cannot request your own service.");
      return;
    }
    setError("");
    setMessage("");
    setRequesting(true);
    try {
      const data = await apiFetch("/requests", {
        method: "POST",
        body: JSON.stringify({ service_id: service.id }),
      });
      setMessage(data.message || "Your request has been sent successfully!");
    } catch (err) {
      setError(err.message);
    } finally {
      setRequesting(false);
    }
  }

  if (loading) {
    return (
      <main className="service-details-page">
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
          <p>Loading service details...</p>
        </div>
      </main>
    );
  }

  if (error && !service) {
    return (
      <main className="service-details-page">
        <Link to="/services" className="back-link">
          <ArrowLeftIcon /> Back to services
        </Link>
        <div className="form-error" style={{ marginTop: 20 }}>
          {error}
        </div>
      </main>
    );
  }

  const currentUser = getStoredUser();
  const isOwner = String(currentUser?.id) === String(service.provider_id);

  return (
    <main className="service-details-page">
      <Link to="/services" className="back-link">
        <ArrowLeftIcon /> Back to all services
      </Link>

      <div className="details-grid">
        <section className="details-main-content">
          <div className="details-meta-row">
            <span className="category-tag">{service.category}</span>
            <span style={{ fontSize: 13, color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <ClockIcon style={{ width: 14, height: 14 }} /> Available on Campus
            </span>
          </div>

          <h1>{service.title}</h1>

          <div className="details-description-box">
            <h3>Service Overview</h3>
            <p>{service.description}</p>

            <hr style={{ margin: '24px 0', borderColor: 'var(--border-color)', borderStyle: 'solid', borderWidth: '1px 0 0' }} />

            <h4 style={{ fontSize: 16, fontWeight: 700, marginBottom: 14 }}>What's Included</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: 'var(--text-main)' }}>
                <CheckCircleIcon style={{ color: '#16a34a', width: 18, height: 18 }} /> Direct 1-on-1 peer assistance
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: 'var(--text-main)' }}>
                <CheckCircleIcon style={{ color: '#16a34a', width: 18, height: 18 }} /> Flexible campus meeting or online coordination
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: 'var(--text-main)' }}>
                <CheckCircleIcon style={{ color: '#16a34a', width: 18, height: 18 }} /> Student-friendly pricing with clear expectations
              </div>
            </div>
          </div>

          {/* PROVIDER DETAILS CARD */}
          <div className="details-description-box" style={{ marginTop: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Service Provider
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div className="provider-avatar-circle" style={{ width: 52, height: 52, fontSize: 20 }}>
                {service.provider_name?.charAt(0).toUpperCase() || "P"}
              </div>
              <div>
                <h4 style={{ fontSize: 18, fontWeight: 800, margin: 0, color: 'var(--primary)' }}>
                  {service.provider_name}
                </h4>
                <p style={{ margin: '3px 0 0', fontSize: 13, color: 'var(--text-muted)' }}>
                  {service.campus || "Campus Community"}
                </p>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 6, fontSize: 12, color: '#16a34a', fontWeight: 600 }}>
                  <ShieldCheckIcon style={{ width: 14, height: 14 }} /> Verified Campus Member
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SIDEBAR PRICING & ACTION CARD */}
        <aside className="details-pricing-card">
          <div className="price-header">
            <span className="price-amount">₹{service.price}</span>
            <span className="price-unit">/ total</span>
          </div>
          <p className="price-subtitle">Starting price offered by provider</p>

          <div className="provider-card-compact">
            <div className="provider-avatar-circle" style={{ width: 34, height: 34 }}>
              {service.provider_name?.charAt(0).toUpperCase() || "P"}
            </div>
            <div>
              <strong>{service.provider_name}</strong>
              <span>{service.campus || "Campus Provider"}</span>
            </div>
          </div>

          {message && (
            <div className="form-success" style={{ marginBottom: 16 }}>
              {message}
            </div>
          )}

          {error && (
            <div className="form-error" style={{ marginBottom: 16 }}>
              {error}
            </div>
          )}

          <button
            type="button"
            className="request-service-button"
            style={{ width: '100%', minHeight: 48, fontSize: 15 }}
            onClick={requestService}
            disabled={requesting || isOwner}
          >
            {isOwner ? "You listed this service" : requesting ? "Sending request..." : "Request Service Now →"}
          </button>

          <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--text-muted)' }}>
            <ShieldCheckIcon style={{ width: 16, height: 16, color: 'var(--accent)' }} />
            <span>Safe & reliable campus peer connection.</span>
          </div>
        </aside>
      </div>
    </main>
  );
}

export default ServiceDetails;
