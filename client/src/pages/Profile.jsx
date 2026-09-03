import { Link } from "react-router-dom";
import { getStoredUser } from "../lib/api";
import { UserIcon, ShieldCheckIcon, ArrowLeftIcon, SparklesIcon } from "../components/Icons";

function Profile() {
  const user = getStoredUser();

  if (!user) {
    return (
      <main className="profile-page">
        <div className="auth-card" style={{ margin: '40px auto', textAlign: 'center' }}>
          <p className="section-eyebrow" style={{ justifyContent: 'center' }}>PROFILE ACCESS</p>
          <h2>Please log in first</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>You must be logged in to view your profile.</p>
          <Link to="/login" className="primary-button">
            Log In to Account →
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="profile-page">
      <section style={{ marginBottom: 36 }}>
        <p className="section-eyebrow">
          <SparklesIcon style={{ width: 14, height: 14 }} /> YOUR PROFILE
        </p>
        <h1>Campus Identity & Account</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 16, margin: '4px 0 0' }}>
          Manage your student credentials and view your active campus details.
        </p>
      </section>

      <div className="details-grid" style={{ gridTemplateColumns: '1fr 340px' }}>
        {/* MAIN PROFILE CARD */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: 36, boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24, paddingBottom: 28, borderBottom: '1px solid var(--border-color)', marginBottom: 28 }}>
            <div className="provider-avatar-circle" style={{ width: 72, height: 72, fontSize: 28 }}>
              {user.full_name?.charAt(0).toUpperCase() || "U"}
            </div>
            <div>
              <h2 style={{ fontSize: 26, fontWeight: 800, margin: 0, color: 'var(--primary)' }}>
                {user.full_name}
              </h2>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 6, fontSize: 13, color: '#16a34a', fontWeight: 600 }}>
                <ShieldCheckIcon style={{ width: 16, height: 16 }} /> Verified Student Member
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24 }}>
            <div>
              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: 1 }}>
                FULL NAME
              </span>
              <p style={{ fontSize: 16, fontWeight: 600, color: 'var(--primary)', margin: '4px 0 0' }}>
                {user.full_name}
              </p>
            </div>

            <div>
              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: 1 }}>
                EMAIL ADDRESS
              </span>
              <p style={{ fontSize: 16, fontWeight: 600, color: 'var(--primary)', margin: '4px 0 0' }}>
                {user.email}
              </p>
            </div>

            <div>
              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: 1 }}>
                CAMPUS / COLLEGE
              </span>
              <p style={{ fontSize: 16, fontWeight: 600, color: 'var(--primary)', margin: '4px 0 0' }}>
                {user.campus || "Shnoor International Campus"}
              </p>
            </div>
          </div>
        </div>

        {/* SIDEBAR NAVIGATION CARD */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ background: 'var(--surface-dark)', color: '#ffffff', borderRadius: 'var(--radius-lg)', padding: 28 }}>
            <h3 style={{ color: '#ffffff', fontSize: 20, fontWeight: 800, marginBottom: 12 }}>
              Student Marketplace
            </h3>
            <p style={{ color: '#94a3b8', fontSize: 14, lineHeight: 1.6, margin: 0 }}>
              Use your verified account to discover peer services, post custom requests, and build your service portfolio.
            </p>
          </div>

          <Link to="/dashboard" className="secondary-button" style={{ justifyContent: 'center', minHeight: 46 }}>
            <ArrowLeftIcon /> Back to Dashboard
          </Link>
        </aside>
      </div>
    </main>
  );
}

export default Profile;
