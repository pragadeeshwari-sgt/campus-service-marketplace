import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Hero from "../components/Hero";
import HowItWorks from "../components/HowItWorks";
import FeaturedServices from "../components/FeaturedServices";
import { CategoryIcon, ArrowRightIcon, ArrowUpRightIcon, PlusIcon } from "../components/Icons";

const categories = [
  {
    name: "Tutoring",
    description: "Learn 1-on-1 from top performing students in STEM, Humanities, and Business.",
  },
  {
    name: "Graphic Design",
    description: "Custom event posters, club branding, slide pitch decks, and digital visuals.",
  },
  {
    name: "Photography",
    description: "High quality portraits, event coverage, graduation shoots, and video snippets.",
  },
  {
    name: "Video Editing",
    description: "Polished short-form reels, project demos, interviews, and vlog edits.",
  },
  {
    name: "Writing",
    description: "Proofreading, resume review, essay feedback, and creative copywriting.",
  },
  {
    name: "Event Assistance",
    description: "Reliable student helpers for venue setup, ticketing, tech, and operations.",
  },
];

function Home() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const element = document.getElementById(location.hash.substring(1));
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

  return (
    <main className="page-home">
      {/* HERO */}
      <Hero />

      {/* HOW IT WORKS */}
      <HowItWorks />

      {/* CATEGORIES SECTION */}
      <section className="categories-section" id="categories">
        <div className="categories-header-row">
          <div>
            <p className="section-eyebrow">EXPLORE BY CATEGORY</p>
            <h2>Find What You Need On Campus</h2>
          </div>
          <Link to="/categories" className="secondary-button">
            View All Categories <ArrowRightIcon />
          </Link>
        </div>

        <div className="category-grid">
          {categories.map((category) => (
            <Link
              to={`/services?category=${encodeURIComponent(category.name)}`}
              className="category-card"
              key={category.name}
            >
              <div>
                <div className="category-card-top">
                  <div className="category-icon-box">
                    <CategoryIcon name={category.name} />
                  </div>
                  <ArrowUpRightIcon className="category-arrow-icon" />
                </div>
                <h3>{category.name}</h3>
                <p>{category.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED SERVICES */}
      <FeaturedServices />

      {/* CALL TO ACTION */}
      <section className="home-cta">
        <div className="home-cta-inner">
          <p className="section-eyebrow">MONETIZE YOUR SKILLS</p>
          <h2>Have a Skill to Share?</h2>
          <p>
            Join hundreds of students earning income and helping peers across campus. List your services in less than two minutes.
          </p>
          <Link to="/create-service" className="offer-service-btn" style={{ padding: '14px 28px', fontSize: 16 }}>
            <PlusIcon /> Offer a Service Now
          </Link>
        </div>
      </section>
    </main>
  );
}

export default Home;
