import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiFetch, getStoredUser } from "../lib/api";

function MyServices() {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const loadServices = async () => { try { const data = await apiFetch("/services/my"); setServices(data.services || []); } catch (err) { setError(err.message); } finally { setLoading(false); } };
  useEffect(() => { if (!getStoredUser()) { navigate("/login"); return; } loadServices(); }, [navigate]);
  async function saveService(event) { event.preventDefault(); try { await apiFetch(`/services/${editing.id}`, { method: "PUT", body: JSON.stringify(editing) }); setEditing(null); await loadServices(); } catch (err) { setError(err.message); } }
  async function deleteService(id) { if (!window.confirm("Delete this service listing?")) return; try { await apiFetch(`/services/${id}`, { method: "DELETE" }); await loadServices(); } catch (err) { setError(err.message); } }
  return <main className="page-dashboard dashboard-page"><section className="dashboard-hero"><p className="section-eyebrow">MY SERVICES</p><h1>Your services.</h1><p className="dashboard-intro">Manage the services you're offering to your campus community.</p><Link to="/create-service" className="primary-button">Offer a new service</Link></section><section className="marketplace-list">{error && <p className="form-error">{error}</p>}{loading ? <p className="services-status">Loading your services...</p> : !services.length ? <p className="services-status">You have not published a service yet.</p> : services.map((service) => <article className="marketplace-item" key={service.id}><div><p className="section-eyebrow">{service.status}</p><h2>{service.title}</h2><p>{service.category} · ₹{service.price}</p><p className="item-meta">{service.description}</p></div><div className="item-actions"><button className="secondary-button" onClick={() => setEditing({ ...service })}>Edit</button><button className="secondary-button" onClick={() => deleteService(service.id)}>Delete</button></div>{editing?.id === service.id && <form className="service-edit-form" onSubmit={saveService}><input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} required /><input value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value })} required /><input type="number" min="0" value={editing.price} onChange={(e) => setEditing({ ...editing, price: e.target.value })} required /><select value={editing.status} onChange={(e) => setEditing({ ...editing, status: e.target.value })}>{["active", "inactive", "archived"].map((status) => <option key={status}>{status}</option>)}</select><textarea value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} required /><button className="primary-button">Save changes</button><button type="button" className="secondary-button" onClick={() => setEditing(null)}>Cancel</button></form>}</article>)}</section></main>;
}
export default MyServices;
