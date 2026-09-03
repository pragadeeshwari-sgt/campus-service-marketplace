import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiFetch, getStoredUser } from "../lib/api";
import { ArrowLeftIcon, SparklesIcon, StarIcon } from "../components/Icons";

const activeStatuses = ["REQUESTED", "ACCEPTED", "IN_PROGRESS"];
const formatDate = (date) => (date ? new Date(date).toLocaleDateString() : "—");

function MyRequests() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [reviewing, setReviewing] = useState(null);
  const [review, setReview] = useState({ rating: 5, comment: "" });

  const loadRequests = async () => {
    try {
      const data = await apiFetch("/requests/my");
      setRequests(data.requests || []);
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
    loadRequests();
  }, [navigate]);

  async function updateStatus(id) {
    try {
      await apiFetch(`/requests/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: "CANCELLED" }),
      });
      await loadRequests();
    } catch (err) {
      setError(err.message);
    }
  }

  async function submitReview(event, id) {
    event.preventDefault();
    try {
      await apiFetch(`/requests/${id}/review`, {
        method: "POST",
        body: JSON.stringify(review),
      });
      setReviewing(null);
      setReview({ rating: 5, comment: "" });
      await loadRequests();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className="dashboard-page">
      <Link to="/dashboard" className="back-link">
        <ArrowLeftIcon /> Back to dashboard
      </Link>

      <section style={{ marginBottom: 36 }}>
        <p className="section-eyebrow">
          <SparklesIcon style={{ width: 14, height: 14 }} /> SERVICE REQUESTS
        </p>
        <h1>My Sent Requests</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 16, margin: '4px 0 0' }}>
          Track status and manage services you have requested from student providers.
        </p>
      </section>

      {error && <div className="form-error" style={{ marginBottom: 24 }}>{error}</div>}

      {loading ? (
        <div className="services-status">Loading your requests...</div>
      ) : !requests.length ? (
        <div className="empty-services">
          <h3>No requests yet</h3>
          <p>You haven't requested any services from campus providers yet.</p>
          <Link to="/services" className="primary-button" style={{ marginTop: 16 }}>
            Explore Services Marketplace →
          </Link>
        </div>
      ) : (
        <div className="marketplace-list">
          {requests.map((request) => (
            <article className="marketplace-item" key={request.id}>
              <div className="marketplace-item-content">
                <span className={`status-badge ${request.status}`}>
                  {request.status}
                </span>
                <h3 style={{ marginTop: 8 }}>{request.service_title}</h3>
                <p>
                  <strong>Provider:</strong> {request.provider_name} · <strong style={{ color: 'var(--accent-gold)' }}>₹{request.price}</strong>
                </p>
                <p className="item-meta">
                  Requested on {formatDate(request.requested_at)} · Last updated {formatDate(request.updated_at)}
                </p>
              </div>

              <div className="item-actions">
                {activeStatuses.includes(request.status) && (
                  <button className="secondary-button" onClick={() => updateStatus(request.id)} style={{ color: '#dc2626' }}>
                    Cancel Request
                  </button>
                )}
                {request.status === "COMPLETED" && (
                  <button className="primary-button" onClick={() => setReviewing(request.id)}>
                    Leave Review
                  </button>
                )}
              </div>

              {reviewing === request.id && (
                <form className="auth-form" onSubmit={(event) => submitReview(event, request.id)} style={{ width: '100%', marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--border-color)' }}>
                  <div className="form-group">
                    <label>Rating (1 to 5 Stars)</label>
                    <select
                      value={review.rating}
                      onChange={(e) => setReview({ ...review, rating: Number(e.target.value) })}
                    >
                      {[5, 4, 3, 2, 1].map((val) => (
                        <option key={val} value={val}>
                          {val} Stars ★
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Review Comment</label>
                    <textarea
                      value={review.comment}
                      onChange={(e) => setReview({ ...review, comment: e.target.value })}
                      placeholder="Share your experience working with this student provider..."
                      rows="3"
                    />
                  </div>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button type="submit" className="primary-button">
                      Submit Review
                    </button>
                    <button type="button" className="secondary-button" onClick={() => setReviewing(null)}>
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

export default MyRequests;
