import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { apiFetch, getStoredUser } from "../lib/api";

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
      try { const data = await apiFetch(`/services/${id}`); setService(data.service); }
      catch (err) { setError(err.message || "Unable to load service details."); }
      finally { setLoading(false); }
    }
    fetchService();
  }, [id]);

  async function requestService() {
    const user = getStoredUser();
    if (!user?.id) { navigate("/login"); return; }
    if (String(user.id) === String(service.provider_id)) { setError("You cannot request your own service."); return; }
    setError(""); setMessage(""); setRequesting(true);
    try {
      const data = await apiFetch("/requests", { method: "POST", body: JSON.stringify({ service_id: service.id }) });
      setMessage(data.message || "Your request has been sent.");
    } catch (err) { setError(err.message); }
    finally { setRequesting(false); }
  }

  if (loading) return <main className="service-details-page page-details"><p className="services-status">Loading service...</p></main>;
  if (error && !service) return <main className="service-details-page page-details"><p className="section-eyebrow">SERVICE DETAILS</p><h1>Something went wrong.</h1><p className="details-error">{error}</p><Link to="/services" className="back-link">← Back to services</Link></main>;
  const isOwner = String(getStoredUser()?.id) === String(service.provider_id);

  return <main className="service-details-page page-details"><div className="details-container"><Link to="/services" className="back-link">← Back to services</Link><div className="details-layout"><section className="details-main"><p className="section-eyebrow">{service.category}</p><h1>{service.title}</h1><p className="details-description">{service.description}</p></section><aside className="details-card"><div className="details-price">₹{service.price}</div><p className="price-label">Starting price</p><div className="details-divider" /><p className="details-label">OFFERED BY</p><div className="details-provider"><div className="details-avatar">{service.provider_name?.charAt(0)}</div><div><strong>{service.provider_name}</strong><span>{service.campus || "Campus Community"}</span></div></div>{message && <p className="form-success">{message}</p>}{error && <p className="form-error">{error}</p>}<button type="button" className="request-service-button" onClick={requestService} disabled={requesting || isOwner}>{isOwner ? "This is your service" : requesting ? "Sending request..." : "Request this service →"}</button></aside></div></div></main>;
}
export default ServiceDetails;
