import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiFetch, getStoredUser } from "../lib/api";
import { ArrowLeftIcon, SparklesIcon, CheckCircleIcon } from "../components/Icons";

const nextActions = {
  REQUESTED: [
    ["ACCEPTED", "Accept Request"],
    ["REJECTED", "Decline Request"],
  ],
  ACCEPTED: [["IN_PROGRESS", "Start Work"]],
  IN_PROGRESS: [["COMPLETED", "Mark Completed"]],
};

function ProviderRequests() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const data = await apiFetch("/requests/provider");
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
    load();
  }, [navigate]);

  async function update(id, status) {
    try {
      await apiFetch(`/requests/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      await load();
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
          <SparklesIcon style={{ width: 14, height: 14 }} /> INCOMING CUSTOMER REQUESTS
        </p>
        <h1>Provider Requests Received</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 16, margin: '4px 0 0' }}>
          Review incoming requests from students, update status, and manage active service jobs.
        </p>
      </section>

      {error && <div className="form-error" style={{ marginBottom: 24 }}>{error}</div>}

      {loading ? (
        <div className="services-status">Loading provider requests...</div>
      ) : !requests.length ? (
        <div className="empty-services">
          <h3>No incoming requests yet</h3>
          <p>When fellow students request your listed services, they will appear here.</p>
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
                  <strong>Requested by:</strong> {request.requester_name} · <strong style={{ color: 'var(--accent-gold)' }}>₹{request.price}</strong>
                </p>
                {request.notes && <p className="item-meta">Note: {request.notes}</p>}
              </div>

              <div className="item-actions">
                {(nextActions[request.status] || []).map(([status, label]) => (
                  <button
                    className={status === "REJECTED" ? "secondary-button" : "primary-button"}
                    key={status}
                    onClick={() => update(request.id, status)}
                    style={status === "REJECTED" ? { color: '#dc2626' } : {}}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}

export default ProviderRequests;
