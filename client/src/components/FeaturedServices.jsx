const services = [
  {
    category: "DESIGN",
    title: "Graphic Design",
    description: "Posters, presentations and social media designs.",
    rating: "4.9",
    reviews: "24",
    price: "₹300",
    provider: "Ananya R.",
  },
  {
    category: "TUTORING",
    title: "Calculus Tutoring",
    description: "One-on-one help with calculus and engineering maths.",
    rating: "4.8",
    reviews: "18",
    price: "₹200",
    provider: "Rahul K.",
  },
  {
    category: "TECHNOLOGY",
    title: "React Development",
    description: "Frontend development help for projects and websites.",
    rating: "5.0",
    reviews: "12",
    price: "₹500",
    provider: "Arjun S.",
  },
];

function FeaturedServices() {
  return (
    <section className="featured-section">
      <div className="featured-header">
        <div>
          <p className="section-eyebrow">DISCOVER SERVICES</p>

          <h2>Popular right now.</h2>
        </div>

        <button className="view-all">
          View all →
        </button>
      </div>

      <div className="services-grid">
        {services.map((service) => (
          <article className="service-card" key={service.title}>
            <div className="service-card-top">
              <span className="service-category">
                {service.category}
              </span>

              <span className="service-rating">
                ★ {service.rating}
              </span>
            </div>

            <div className="service-card-content">
              <h3>{service.title}</h3>

              <p>{service.description}</p>
            </div>

            <div className="service-card-bottom">
              <div>
                <span className="service-price">
                  {service.price}
                </span>

                <span className="service-provider">
                  by {service.provider}
                </span>
              </div>

              <button className="service-arrow">
                →
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default FeaturedServices;