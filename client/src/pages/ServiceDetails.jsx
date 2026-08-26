import { Link, useParams } from "react-router-dom";

function ServiceDetails() {
  const { id } = useParams();

  return (
    <main className="service-details-page">
      <p className="section-eyebrow">SERVICE DETAILS</p>

      <h1>Service #{id}</h1>

      <p>
        Service details will appear here.
      </p>

      <Link to="/services">
        ← Back to services
      </Link>
    </main>
  );
}

export default ServiceDetails;