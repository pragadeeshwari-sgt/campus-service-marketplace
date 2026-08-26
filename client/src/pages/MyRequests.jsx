import { Link } from "react-router-dom";

function MyRequests() {
  return (
    <main className="page-dashboard dashboard-page">
      <section className="dashboard-hero">

        <p className="section-eyebrow">
          MY REQUESTS
        </p>

        <h1>
          Your requests.
        </h1>

        <p className="dashboard-intro">
          Track the services you've requested from
          the campus community.
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

export default MyRequests;