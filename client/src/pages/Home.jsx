import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
function Home() {
      const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const element = document.getElementById(
        location.hash.substring(1)
      );

      if (element) {
        setTimeout(() => {
          element.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 100);
      }
    }
  }, [location.hash]);
  const categories = [
    {
      number: "01",
      name: "Tutoring",
      description: "Learn from students who know the subject.",
    },
    {
      number: "02",
      name: "Graphic Design",
      description: "Posters, presentations and creative visuals.",
    },
    {
      number: "03",
      name: "Photography",
      description: "Capture your campus moments and events.",
    },
    {
      number: "04",
      name: "Video Editing",
      description: "Turn your footage into polished content.",
    },
    {
      number: "05",
      name: "Writing",
      description: "Get help with writing, editing and content.",
    },
    {
      number: "06",
      name: "Event Assistance",
      description: "Find people to help make your events happen.",
    },
  ];

  return (
    <main className="page-home home-page">

      {/* HERO */}

      <section className="home-hero">
        <div className="hero-content">
          <p className="section-eyebrow">
            CAMPUS SERVICE MARKETPLACE
          </p>

          <h1>
            Skills worth
            <br />
            <span>sharing.</span>
          </h1>

          <p className="hero-description">
            A trusted marketplace where students can
            discover useful services, share their skills,
            and connect with people on campus.
          </p>

          <div className="hero-actions">
            <Link
              to="/services"
              className="primary-button"
            >
              Explore services →
            </Link>

            <Link
              to="/create-service"
              className="secondary-button"
            >
              Offer a service
            </Link>
          </div>
        </div>

        <div className="hero-note">
          <span>BUILT FOR STUDENTS</span>
          <span>CAMPUS COMMUNITY</span>
        </div>
      </section>


      {/* HOW IT WORKS */}

      <section
  className="how-section"
  id="how-it-works"
>
        <div className="section-heading">
          <p className="section-eyebrow">
            HOW IT WORKS
          </p>

          <h2>
            Simple by design.
          </h2>
        </div>

        <div className="steps-grid">

          <article className="step-card">
            <span>01</span>

            <h3>Discover</h3>

            <p>
              Browse services offered by talented
              students around your campus.
            </p>
          </article>

          <article className="step-card">
            <span>02</span>

            <h3>Connect</h3>

            <p>
              Find the right person and request
              the service you need.
            </p>
          </article>

          <article className="step-card">
            <span>03</span>

            <h3>Complete</h3>

            <p>
              Get your work done and build trust
              through reviews and ratings.
            </p>
          </article>

        </div>
      </section>


      {/* CATEGORIES */}

      <section className="categories-section">

        <div className="section-heading categories-heading"
        id="categories"
        >
          <div>
            <p className="section-eyebrow">
              EXPLORE BY CATEGORY
            </p>

            <h2>
              Something for everyone.
            </h2>
          </div>

          <Link
            to="/services"
            className="text-link"
          >
            View all services →
          </Link>
        </div>

        <div className="category-grid">

          {categories.map((category) => (
            <Link
              to={`/services?category=${encodeURIComponent(category.name)}`}
              className="category-card"
              key={category.name}
            >
              <span className="category-number">
                {category.number}
              </span>

              <div>
                <h3>{category.name}</h3>

                <p>
                  {category.description}
                </p>
              </div>

              <span className="category-arrow">
                ↗
              </span>
            </Link>
          ))}

        </div>
      </section>


      {/* CTA */}

      <section className="home-cta">

        <p className="section-eyebrow">
          YOUR SKILLS HAVE VALUE
        </p>

        <h2>
          Have something
          <br />
          to offer?
        </h2>

        <p>
          Turn your skills into something useful
          for your campus community.
        </p>

        <Link
          to="/create-service"
          className="cta-button"
        >
          Offer a service →
        </Link>

      </section>

    </main>
  );
}

export default Home;