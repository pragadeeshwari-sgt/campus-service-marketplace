import { Link } from "react-router-dom";

function MyServices() {
  return (
    <main className="page-dashboard dashboard-page">
      <section className="dashboard-hero">

        <p className="section-eyebrow">
          MY SERVICES
        </p>

        <h1>
          Your services.
        </h1>

        <p className="dashboard-intro">
          Manage the services you're offering to
          your campus community.
        </p>

        <Link
          to="/dashboard"
          className="back-link"
        >
          ← Back to dashboard
        </Link>

      </section>
    </main>
  );
}

export default MyServices;