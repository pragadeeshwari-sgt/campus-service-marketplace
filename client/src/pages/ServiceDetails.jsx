import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

function ServiceDetails() {
  const { id } = useParams();

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchService() {
      try {
        const response = await fetch(
          "http://localhost:5000/api/services"
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message);
        }

        const foundService = data.services.find(
          (item) => String(item.id) === String(id)
        );

        if (!foundService) {
          setError("Service not found.");
          return;
        }

        setService(foundService);
      } catch (error) {
        console.error("Service details error:", error);
        setError("Unable to load service details.");
      } finally {
        setLoading(false);
      }
    }

    fetchService();
  }, [id]);

  if (loading) {
    return (
      <main className="service-details-page page-details">
        <p className="services-status">
          Loading service...
        </p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="service-details-page page-details">
        <p className="section-eyebrow">SERVICE DETAILS</p>

        <h1>Something went wrong.</h1>

        <p className="details-error">
          {error}
        </p>

        <Link to="/services" className="back-link">
          ← Back to services
        </Link>
      </main>
    );
  }

  return (
    <main className="service-details-page page-details">

      <div className="details-container">

        <Link
          to="/services"
          className="back-link"
        >
          ← Back to services
        </Link>

        <div className="details-layout">

          {/* LEFT SIDE */}

          <section className="details-main">

            <p className="section-eyebrow">
              {service.category}
            </p>

            <h1>
              {service.title}
            </h1>

            <p className="details-description">
              {service.description}
            </p>

          </section>


          {/* RIGHT SIDE */}

          <aside className="details-card">

            <div className="details-price">
              ₹{service.price}
            </div>

            <p className="price-label">
              Starting price
            </p>


            <div className="details-divider" />


            <p className="details-label">
              OFFERED BY
            </p>

            <div className="details-provider">

              <div className="details-avatar">
                {service.provider_name?.charAt(0)}
              </div>

              <div>
                <strong>
                  {service.provider_name}
                </strong>

                <span>
                  Campus Community
                </span>
              </div>

            </div>


            <button
              type="button"
              className="request-service-button"
            >
              Request this service →
            </button>

          </aside>

        </div>

      </div>

    </main>
  );
}

export default ServiceDetails;