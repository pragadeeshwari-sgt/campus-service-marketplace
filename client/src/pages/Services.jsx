import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchParams, setSearchParams] = useSearchParams();

  const selectedCategory =
    searchParams.get("category") || "All";

  const [search, setSearch] = useState("");

  const categories = [
    "All",
    "Tutoring",
    "Graphic Design",
    "Photography",
    "Video Editing",
    "Writing",
    "Event Assistance",
  ];

  useEffect(() => {
    async function fetchServices() {
      try {
        const response = await fetch(
          "http://localhost:5000/api/services"
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message);
        }

        setServices(data.services);
      } catch (error) {
        console.error(error);
        setError("Unable to load services.");
      } finally {
        setLoading(false);
      }
    }

    fetchServices();
  }, []);

  function selectCategory(category) {
    if (category === "All") {
      setSearchParams({});
    } else {
      setSearchParams({ category });
    }
  }

  const filteredServices = services.filter((service) => {
    const matchesCategory =
      selectedCategory === "All" ||
      service.category === selectedCategory;

    const searchText = search.toLowerCase();

    const matchesSearch =
      service.title.toLowerCase().includes(searchText) ||
      service.description.toLowerCase().includes(searchText) ||
      service.category.toLowerCase().includes(searchText) ||
      service.provider_name.toLowerCase().includes(searchText);

    return matchesCategory && matchesSearch;
  });

  return (
    <main className="page-services services-page">

      {/* HEADER */}

      <section className="services-hero">

        <p className="section-eyebrow">
          EXPLORE
        </p>

        <h1>
          Find what
          <br />
          you need.
        </h1>

        <p className="services-intro">
          Discover useful services offered by people
          within your campus community.
        </p>

      </section>


      {/* SEARCH + FILTER */}

      <section className="services-section">

        <div className="services-tools">

          <div className="search-wrapper">

            <span className="search-icon">
              /
            </span>

            <input
              type="text"
              placeholder="Search services, skills or people..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
            />

          </div>


          <div className="category-filters">

            {categories.map((category) => (
              <button
                key={category}
                type="button"
                className={
                  selectedCategory === category
                    ? "category-filter active"
                    : "category-filter"
                }
                onClick={() =>
                  selectCategory(category)
                }
              >
                {category}
              </button>
            ))}

          </div>

        </div>


        {/* SERVICE HEADING */}

        <div className="services-heading">

          <div>
            <p className="section-eyebrow">
              {selectedCategory === "All"
                ? "AVAILABLE SERVICES"
                : selectedCategory.toUpperCase()}
            </p>

            <h2>
              {filteredServices.length}{" "}
              {filteredServices.length === 1
                ? "service"
                : "services"}
            </h2>
          </div>

          <Link
            to="/create-service"
            className="create-service-button"
          >
            Offer a service
          </Link>

        </div>


        {/* STATES */}

        {loading && (
          <p className="services-status">
            Loading services...
          </p>
        )}

        {error && (
          <p className="form-error">
            {error}
          </p>
        )}


        {!loading &&
          !error &&
          filteredServices.length === 0 && (
            <div className="empty-services">

              <h3>
                No services found.
              </h3>

              <p>
                Try a different search or category.
              </p>

            </div>
          )}


        {/* SERVICE CARDS */}

        <div className="service-grid">

          {filteredServices.map((service) => (

            <article
              className="service-card"
              key={service.id}
            >

              <div className="service-card-top">

                <span className="service-category">
                  {service.category}
                </span>

                <span className="service-price">
                  ₹{service.price}
                </span>

              </div>


              <h3>
                {service.title}
              </h3>


              <p className="service-description">
                {service.description}
              </p>


              <div className="service-provider">

                <div className="provider-avatar">
                  {service.provider_name?.charAt(0)}
                </div>

                <div>
                  <strong>
                    {service.provider_name}
                  </strong>

                  <span>
                    {service.campus}
                  </span>
                </div>

              </div>


              <Link
                to={`/services/${service.id}`}
                className="service-link"
              >
                View service →
              </Link>

            </article>

          ))}

        </div>

      </section>

    </main>
  );
}

export default Services;