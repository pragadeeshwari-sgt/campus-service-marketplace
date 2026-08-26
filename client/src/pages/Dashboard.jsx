import { Link } from "react-router-dom";

function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <main className="dashboard-page page-dashboard">

      <section className="dashboard-hero">

        <p className="section-eyebrow">
          YOUR CAMPUS COMMUNITY
        </p>

        <h1>
          Welcome back, {user?.full_name || "there"}.
        </h1>

        <p className="dashboard-intro">
          Discover services, manage your requests, and
          share your skills with your campus community.
        </p>

      </section>


      <section className="dashboard-actions">

        {/* FIND A SERVICE */}

        <Link
          to="/services"
          className="dashboard-card"
        >
          <span>01</span>

          <h2>
            Find a Service
          </h2>

          <p>
            Browse services offered by people
            in your campus community.
          </p>

          <strong>
            Explore services →
          </strong>
        </Link>


        {/* OFFER A SERVICE */}

        <Link
          to="/create-service"
          className="dashboard-card"
        >
          <span>02</span>

          <h2>
            Offer a Service
          </h2>

          <p>
            Share your skills and create a
            service listing.
          </p>

          <strong>
            Create service →
          </strong>
        </Link>


        {/* MY REQUESTS */}

        <Link
          to="/dashboard/requests"
          className="dashboard-card"
        >
          <span>03</span>

          <h2>
            My Requests
          </h2>

          <p>
            Track the services you've requested
            and their progress.
          </p>

          <strong>
            View requests →
          </strong>
        </Link>


        {/* MY SERVICES */}

        <Link
          to="/dashboard/services"
          className="dashboard-card"
        >
          <span>04</span>

          <h2>
            My Services
          </h2>

          <p>
            Manage the services you're offering
            to the community.
          </p>

          <strong>
            Manage services →
          </strong>
        </Link>

      </section>

    </main>
  );
}

export default Dashboard;