import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch, getStoredUser } from "../lib/api";
import { PlusIcon, ArrowRightIcon, SparklesIcon, TagIcon, ClockIcon, CheckCircleIcon, SearchIcon } from "../components/Icons";

function Dashboard() {
  const user = getStoredUser();
  const [summary, setSummary] = useState({ services: null, active: null, completed: null, requests: null });

  useEffect(() => {
    if (!user) return;
    Promise.all([
      apiFetch("/services/my"),
      apiFetch("/requests/my"),
      apiFetch("/requests/provider"),
    ])
      .then(([servicesData, requestsData, providerData]) => {
        const providerRequests = providerData.requests || [];
        setSummary({
          services: (servicesData.services || []).length,
          active: providerRequests.filter((request) =>
            ["REQUESTED", "ACCEPTED", "IN_PROGRESS"].includes(request.status)
          ).length,
          completed: providerRequests.filter((request) =>
            ["COMPLETED", "REVIEWED"].includes(request.status)
          ).length,
          requests: (requestsData.requests || []).length,
        });
      })
      .catch(() => setSummary({ services: "—", active: "—", completed: "—", requests: "—" }));
  }, [user]);

  const statCards = [
    {
      title: "My Services Listed",
      description: "Active services you are offering to campus",
      value: summary.services,
      to: "/dashboard/services",
      actionText: "Manage Listed Services →",
      icon: <TagIcon />,
    },
    {
      title: "Incoming Active Requests",
      description: "Service requests from peers needing your action",
      value: summary.active,
      to: "/dashboard/provider-requests",
      actionText: "View Incoming Requests →",
      icon: <ClockIcon />,
    },
    {
      title: "Completed Jobs",
      description: "Services you successfully completed",
      value: summary.completed,
      to: "/dashboard/provider-requests",
      actionText: "Review Past Jobs →",
      icon: <CheckCircleIcon />,
    },
    {
      title: "My Sent Requests",
      description: "Services you requested from peer providers",
      value: summary.requests,
      to: "/dashboard/requests",
      actionText: "Track My Requests →",
      icon: <SearchIcon />,
    },
  ];

  return (
    <main className="dashboard-page">
      <section className="dashboard-hero">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <p className="section-eyebrow">
              <SparklesIcon style={{ width: 14, height: 14 }} /> DASHBOARD OVERVIEW
            </p>
            <h1>Welcome back, {user?.full_name || "Student"}</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: 16, margin: '4px 0 0' }}>
              Manage your services, track student requests, and expand your campus presence.
            </p>
          </div>

          <Link to="/create-service" className="offer-service-btn" style={{ padding: '12px 20px' }}>
            <PlusIcon /> Offer a Service
          </Link>
        </div>
      </section>

      {/* METRIC STAT CARDS */}
      <section className="stats-grid" aria-label="Key statistics">
        {statCards.map((card) => (
          <Link to={card.to} className="stat-card" key={card.title}>
            <div>
              <div className="stat-card-top">
                <div className="stat-icon">{card.icon}</div>
                <div className="stat-number">
                  {card.value === null ? "..." : card.value}
                </div>
              </div>
              <div className="stat-label">{card.title}</div>
              <p className="stat-desc">{card.description}</p>
            </div>
            <div style={{ marginTop: 16, paddingTop: 12, borderTop: '1px solid var(--border-color)', fontSize: 13, fontWeight: 700, color: 'var(--accent)' }}>
              {card.actionText}
            </div>
          </Link>
        ))}
      </section>

      {/* QUICK ACTIONS SECTION */}
      <section style={{ background: 'var(--surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: 32 }}>
        <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 20 }}>Quick Actions</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
          <Link
            to="/create-service"
            className="secondary-button"
            style={{ justifyContent: 'flex-start', padding: 16, gap: 12, borderRadius: 'var(--radius-md)' }}
          >
            <div style={{ padding: 8, background: 'var(--accent-light)', color: 'var(--accent)', borderRadius: 8 }}>
              <PlusIcon />
            </div>
            <div>
              <div style={{ fontWeight: 700, color: 'var(--primary)' }}>Offer a New Service</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Publish your skills on marketplace</div>
            </div>
          </Link>

          <Link
            to="/services"
            className="secondary-button"
            style={{ justifyContent: 'flex-start', padding: 16, gap: 12, borderRadius: 'var(--radius-md)' }}
          >
            <div style={{ padding: 8, background: '#fef3c7', color: '#d97706', borderRadius: 8 }}>
              <SearchIcon />
            </div>
            <div>
              <div style={{ fontWeight: 700, color: 'var(--primary)' }}>Explore Marketplace</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Find services offered by peers</div>
            </div>
          </Link>

          <Link
            to="/profile"
            className="secondary-button"
            style={{ justifyContent: 'flex-start', padding: 16, gap: 12, borderRadius: 'var(--radius-md)' }}
          >
            <div style={{ padding: 8, background: '#e0e7ff', color: '#4f46e5', borderRadius: 8 }}>
              <SparklesIcon />
            </div>
            <div>
              <div style={{ fontWeight: 700, color: 'var(--primary)' }}>Manage Profile</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>View campus identity & email</div>
            </div>
          </Link>
        </div>
      </section>
    </main>
  );
}

export default Dashboard;
