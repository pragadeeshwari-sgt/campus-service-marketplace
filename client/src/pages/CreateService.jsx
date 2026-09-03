import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiFetch, getStoredUser } from "../lib/api";
import { ArrowLeftIcon, SparklesIcon, PlusIcon, TagIcon } from "../components/Icons";

function CreateService() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const user = getStoredUser();

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    const currentUser = getStoredUser();

    if (!currentUser?.id) {
      setError("Please log in before creating a service.");
      return;
    }

    setLoading(true);

    try {
      await apiFetch("/services", {
        method: "POST",
        body: JSON.stringify({
          title: formData.title.trim(),
          description: formData.description.trim(),
          category: formData.category,
          price: Number(formData.price),
        }),
      });

      navigate("/services");
    } catch (error) {
      console.error("Create service error:", error);
      setError(error.message || "Unable to connect to the server. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (!user) {
    return (
      <main className="dashboard-page">
        <div className="auth-card" style={{ margin: '40px auto', textAlign: 'center' }}>
          <p className="section-eyebrow" style={{ justifyContent: 'center' }}>AUTHENTICATION REQUIRED</p>
          <h2>Log in to Offer a Service</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>You need a student account before you can publish a service listing.</p>
          <Link to="/login" className="primary-button">
            Log In to Account →
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="dashboard-page">
      <Link to="/services" className="back-link">
        <ArrowLeftIcon /> Back to services
      </Link>

      <section style={{ marginBottom: 36 }}>
        <p className="section-eyebrow">
          <SparklesIcon style={{ width: 14, height: 14 }} /> OFFER YOUR SKILLS
        </p>
        <h1>Publish a Campus Service</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 16, margin: '4px 0 0' }}>
          Share your expertise with fellow students across campus and get paid fairly.
        </p>
      </section>

      <div className="details-grid" style={{ gridTemplateColumns: '1fr 380px' }}>
        {/* FORM SECTION */}
        <section style={{ background: 'var(--surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: 32, boxShadow: 'var(--shadow-sm)' }}>
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="title">Service Title</label>
              <input
                id="title"
                name="title"
                type="text"
                placeholder="e.g. Calculus Tutoring & Assignment Help"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">Select a category</option>
                <option value="Tutoring">Tutoring</option>
                <option value="Graphic Design">Graphic Design</option>
                <option value="Photography">Photography</option>
                <option value="Video Editing">Video Editing</option>
                <option value="Writing">Writing</option>
                <option value="Technology">Technology</option>
                <option value="Event Assistance">Event Assistance</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="description">Service Description</label>
              <textarea
                id="description"
                name="description"
                rows="6"
                placeholder="Describe what you offer, what's included, turnaround time, and meeting preferences..."
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="price">Price (₹)</label>
              <input
                id="price"
                name="price"
                type="number"
                min="0"
                step="1"
                placeholder="e.g. 300"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </div>

            {error && <div className="form-error">{error}</div>}

            <button type="submit" className="offer-service-btn" style={{ minHeight: 48, fontSize: 15 }} disabled={loading}>
              <PlusIcon /> {loading ? "Publishing Listing..." : "Publish Service Listing →"}
            </button>
          </form>
        </section>

        {/* LIVE PREVIEW SIDEBAR */}
        <aside style={{ position: 'sticky', top: 90 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Live Listing Preview
          </h3>

          <article className="service-card" style={{ opacity: formData.title ? 1 : 0.7 }}>
            <div>
              <div className="service-card-header">
                <span className="category-tag">{formData.category || "Category"}</span>
                <span className="service-price-tag">₹{formData.price || "0"}</span>
              </div>
              <h3>{formData.title || "Your Service Title"}</h3>
              <p className="service-description">
                {formData.description || "Your service description will appear here as you type..."}
              </p>
            </div>

            <div className="service-card-footer">
              <div className="provider-info">
                <div className="provider-avatar-circle">
                  {user.full_name?.charAt(0).toUpperCase() || "P"}
                </div>
                <div className="provider-details">
                  <h5>{user.full_name || "Provider Name"}</h5>
                  <p>{user.campus || "Campus Community"}</p>
                </div>
              </div>
            </div>
          </article>
        </aside>
      </div>
    </main>
  );
}

export default CreateService;
