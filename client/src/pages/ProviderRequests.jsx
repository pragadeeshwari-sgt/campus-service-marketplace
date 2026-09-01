import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiFetch, getStoredUser } from "../lib/api";

const nextActions = { REQUESTED: [["ACCEPTED", "Accept"], ["REJECTED", "Reject"]], ACCEPTED: [["IN_PROGRESS", "Start work"]], IN_PROGRESS: [["COMPLETED", "Mark completed"]] };
function ProviderRequests() {
  const navigate = useNavigate(); const [requests, setRequests] = useState([]); const [error, setError] = useState(""); const [loading, setLoading] = useState(true);
  const load = async () => { try { const data = await apiFetch("/requests/provider"); setRequests(data.requests || []); } catch (err) { setError(err.message); } finally { setLoading(false); } };
  useEffect(() => { if (!getStoredUser()) { navigate("/login"); return; } load(); }, [navigate]);
  async function update(id, status) { try { await apiFetch(`/requests/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) }); await load(); } catch (err) { setError(err.message); } }
  return <main className="page-dashboard dashboard-page"><section className="dashboard-hero"><p className="section-eyebrow">PROVIDER REQUESTS</p><h1>Requests received.</h1><p className="dashboard-intro">Accept requests and keep customers updated as you work.</p><Link to="/dashboard" className="back-link">← Back to dashboard</Link></section><section className="marketplace-list">{error && <p className="form-error">{error}</p>}{loading ? <p className="services-status">Loading provider requests...</p> : !requests.length ? <p className="services-status">You have not received requests yet.</p> : requests.map((request) => <article className="marketplace-item" key={request.id}><div><p className="section-eyebrow">{request.status}</p><h2>{request.service_title}</h2><p>Requester: {request.requester_name} · ₹{request.price}</p>{request.notes && <p className="item-meta">Note: {request.notes}</p>}</div><div className="item-actions">{(nextActions[request.status] || []).map(([status, label]) => <button className="primary-button" key={status} onClick={() => update(request.id, status)}>{label}</button>)}</div></article>)}</section></main>;
}
export default ProviderRequests;
