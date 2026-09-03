import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../lib/api";
import { CategoryIcon, ArrowUpRightIcon, SparklesIcon } from "../components/Icons";

const categories = [
  {
    name: "Tutoring",
    description: "Academic guidance, exam prep, lab support, and subject mentoring from high-performing peers.",
  },
  {
    name: "Graphic Design",
    description: "Event posters, club logos, presentation pitch decks, social media banners, and brand identity.",
  },
  {
    name: "Photography",
    description: "High-resolution photo coverage for campus festivals, club events, headshots, and graduations.",
  },
  {
    name: "Video Editing",
    description: "Professional cuts, color grading, sound design for short reels, documentaries, and projects.",
  },
  {
    name: "Writing",
    description: "Copywriting, proofreading, essay structuring, resume formatting, and editorial feedback.",
  },
  {
    name: "Technology",
    description: "Web development, coding bug fixes, software setup, database assistance, and app testing.",
  },
  {
    name: "Event Assistance",
    description: "Hands-on student support for venue logistics, event coordination, ticketing, and tech setups.",
  },
];

function Categories() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    apiFetch("/services")
      .then((data) => setServices(data.services || []))
      .catch(() => setServices([]));
  }, []);

  const counts = useMemo(
    () =>
      services.reduce(
        (acc, service) => ({ ...acc, [service.category]: (acc[service.category] || 0) + 1 }),
        {}
      ),
    [services]
  );

  return (
    <main className="categories-page">
      <section className="categories-page-hero">
        <p className="section-eyebrow">
          <SparklesIcon style={{ width: 14, height: 14 }} /> BROWSE MARKETPLACE
        </p>
        <h1>Find the Right Kind of Help</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 16, maxWidth: 600 }}>
          Select a category to explore specialized student skills and peer services available across your campus.
        </p>
      </section>

      <section className="category-tiles-grid" aria-label="Service categories">
        {categories.map(({ name, description }) => (
          <Link
            key={name}
            className="category-tile-card"
            to={`/services?category=${encodeURIComponent(name)}`}
          >
            <div>
              <div className="category-card-top">
                <div className="category-icon-box">
                  <CategoryIcon name={name} />
                </div>
                <ArrowUpRightIcon className="category-arrow-icon" />
              </div>
              <h3>{name}</h3>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5, margin: '6px 0 0' }}>
                {description}
              </p>
            </div>

            <div className="category-count-badge">
              {counts[name] || 0} Available {counts[name] === 1 ? 'Listing' : 'Listings'}
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
}

export default Categories;
