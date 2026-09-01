import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiFetch, getStoredUser } from "../lib/api";

const activeStatuses = ["REQUESTED", "ACCEPTED", "IN_PROGRESS"];
const formatDate = (date) => (date ? new Date(date).toLocaleDateString() : "—");

function MyRequests() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [reviewing, setReviewing] = useState(null);
  const [review, setReview] = useState({ rating: 5, comment: "" });
  const loadRequests = async () => { try { const data = await apiFetch("/requests/my"); setRequests(data.requests || []); } catch (err) { setError(err.message); } finally { setLoading(false); } };
  useEffect(() => { if (!getStoredUser()) { navigate("/login"); return; } loadRequests(); }, [navigate]);
  async function updateStatus(id) { try { await apiFetch(`/requests/${id}/status`, { method: "PATCH", body: JSON.stringify({ status: "CANCELLED" }) }); await loadRequests(); } catch (err) { setError(err.message); } }
  async function submitReview(event, id) { event.preventDefault(); try { await apiFetch(`/requests/${id}/review`, { method: "POST", body: JSON.stringify(review) }); setReviewing(null); setReview({ rating: 5, comment: "" }); await loadRequests(); } catch (err) { setError(err.message); } }
  return <main className="page-dashboard dashboard-page"><section className="dashboard-hero"><p className="section-eyebrow">MY REQUESTS</p><h1>Your requests.</h1><p className="dashboard-intro">Track services you've requested from the campus community.</p><Link to="/dashboard" className="back-link">← Back to dashboard</Link></section><section className="marketplace-list">{error && <p className="form-error">{error}</p>}{loading ? <p className="services-status">Loading requests...</p> : !requests.length ? <p className="services-status">You have not requested a service yet.</p> : requests.map((request) => <article className="marketplace-item" key={request.id}><div><p className="section-eyebrow">{request.status}</p><h2>{request.service_title}</h2><p>Provider: {request.provider_name} · ₹{request.price}</p><p className="item-meta">Requested {formatDate(request.requested_at)} · Updated {formatDate(request.updated_at)}</p></div><div className="item-actions">{activeStatuses.includes(request.status) && <button className="secondary-button" onClick={() => updateStatus(request.id)}>Cancel request</button>}{request.status === "COMPLETED" && <button className="primary-button" onClick={() => setReviewing(request.id)}>Leave review</button>}</div>{reviewing === request.id && <form className="review-form" onSubmit={(event) => submitReview(event, request.id)}><label>Rating <select value={review.rating} onChange={(event) => setReview({ ...review, rating: Number(event.target.value) })}>{[1, 2, 3, 4, 5].map((value) => <option key={value} value={value}>{value} / 5</option>)}</select></label><textarea value={review.comment} onChange={(event) => setReview({ ...review, comment: event.target.value })} placeholder="Optional comment" rows="3" /><button className="primary-button">Submit review</button></form>}</article>)}</section></main>;
}
export default MyRequests;
