import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiFetch, getStoredUser } from "../lib/api";
import { ArrowLeftIcon, PlusIcon, SparklesIcon, EditIcon, TrashIcon } from "../components/Icons";

function MyServices() {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const loadServices = async () => {
    try {
      const data = await apiFetch("/services/my");
      setServices(data.services || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!getStoredUser()) {
      navigate("/login");
      return;
    }
    loadServices();
  }, [navigate]);

  async function saveService(event) {
    event.preventDefault();
    try {
      await apiFetch(`/services/${editing.id}`, {
        method: "PUT",
        body: JSON.stringify(editing),
      });
      setEditing(null);
      await loadServices();
    } catch (err) {
      setError(err.message);
    }
  }

  async function deleteService(id) {
    if (!window.confirm("Are you sure you want to delete this service listing?")) return;
    try {
      await apiFetch(`/services/${id}`, { method: "DELETE" });
      await loadServices();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className="dashboard-page">
      <Link to="/dashboard" className="back-link">
        <ArrowLeftIcon /> Back to dashboard
      </Link>

      <section style={{ marginBottom: 36, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <p className="section-eyebrow">
            <SparklesIcon style={{ width: 14, height: 14 }} /> SERVICE PORTFOLIO
          </p>
          <h1>My Listed Services</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 16, margin: '4px 0 0' }}>
            Manage and update the services you are currently offering on campus.
          </p>
        </div>

        <Link to="/create-service" className="offer-service-btn">
          <PlusIcon /> Offer New Service
        </Link>
      </section>

      {error && <div className="form-error" style={{ marginBottom: 24 }}>{error}</div>}

      {loading ? (
        <div className="services-status">Loading your listed services...</div>
      ) : !services.length ? (
        <div className="empty-services">
          <h3>No services listed yet</h3>
          <p>You haven't created any service listings for fellow students to explore.</p>
          <Link to="/create-service" className="offer-service-btn" style={{ marginTop: 16 }}>
            <PlusIcon /> Offer Your First Service
          </Link>
        </div>
      ) : (
        <div className="marketplace-list">
          {services.map((service) => (
            <article className="marketplace-item" key={service.id} style={{ flexDirection: 'column', alignItems: 'stretch' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                <div className="marketplace-item-content">
                  <span className={`status-badge ${service.status || 'active'}`}>
                    {service.status || 'active'}
                  </span>
                  <h3 style={{ marginTop: 8 }}>{service.title}</h3>
                  <p>
                    <strong>Category:</strong> {service.category} · <strong style={{ color: 'var(--accent-gold)' }}>₹{service.price}</strong>
                  </p>
                  <p className="item-meta">{service.description}</p>
                </div>

                <div className="item-actions">
                  <button className="secondary-button" onClick={() => setEditing({ ...service })}>
                    <EditIcon /> Edit Listing
                  </button>
                  <button className="secondary-button" onClick={() => deleteService(service.id)} style={{ color: '#dc2626' }}>
                    <TrashIcon /> Delete
                  </button>
                </div>
              </div>

              {editing?.id === service.id && (
                <form className="auth-form" onSubmit={saveService} style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid var(--border-color)' }}>
                  <h4 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>Edit Service Details</h4>

                  <div className="form-group">
                    <label>Title</label>
                    <input
                      value={editing.title}
                      onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Category</label>
                    <input
                      value={editing.category}
                      onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Price (₹)</label>
                    <input
                      type="number"
                      min="0"
                      value={editing.price}
                      onChange={(e) => setEditing({ ...editing, price: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Listing Status</label>
                    <select
                      value={editing.status || 'active'}
                      onChange={(e) => setEditing({ ...editing, status: e.target.value })}
                    >
                      {["active", "inactive", "archived"].map((st) => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      value={editing.description}
                      onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                      rows="4"
                      required
                    />
                  </div>

                  <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                    <button type="submit" className="primary-button">
                      Save Changes
                    </button>
                    <button type="button" className="secondary-button" onClick={() => setEditing(null)}>
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </article>
          ))}
        </div>
      )}
    </main>
  );
}

export default MyServices;
