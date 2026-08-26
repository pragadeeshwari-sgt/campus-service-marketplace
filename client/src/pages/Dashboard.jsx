function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <main className="dashboard-page">
      <p className="section-eyebrow">YOUR CAMPUS</p>

      <h1>
        Welcome back, {user?.full_name || "there"}.
      </h1>

      <p className="dashboard-intro">
        Discover services, manage your requests, and share
        your skills with your campus community.
      </p>

      <div className="dashboard-actions">
        <div className="dashboard-card">
          <span>01</span>
          <h2>Find a Service</h2>
          <p>
            Browse services offered by students on your campus.
          </p>
        </div>

        <div className="dashboard-card">
          <span>02</span>
          <h2>Offer a Service</h2>
          <p>
            Share your skills and create a service listing.
          </p>
        </div>

        <div className="dashboard-card">
          <span>03</span>
          <h2>My Requests</h2>
          <p>
            Track the services you've requested.
          </p>
        </div>

        <div className="dashboard-card">
          <span>04</span>
          <h2>My Services</h2>
          <p>
            Manage the services you're offering.
          </p>
        </div>
      </div>
    </main>
  );
}

export default Dashboard;