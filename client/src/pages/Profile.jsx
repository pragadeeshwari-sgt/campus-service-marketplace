import { Link } from "react-router-dom";
import { getStoredUser } from "../lib/api";

function Profile() {
  const user = getStoredUser();

  if (!user) {
    return (
      <main className="profile-page">
        <p className="section-eyebrow">PROFILE</p>

        <h1>Please log in.</h1>

        <Link to="/login" className="primary-button">
          Log in →
        </Link>
      </main>
    );
  }

  return (
    <main className="profile-page">

      <section className="profile-hero">
        <p className="section-eyebrow">
          YOUR PROFILE
        </p>

        <h1>
          {user.full_name}
        </h1>

        <p className="profile-intro">
          Manage your account information and
          campus identity.
        </p>
      </section>


      <section className="profile-content">

        <div className="profile-card">

          <div className="profile-avatar">
            {user.full_name?.charAt(0).toUpperCase() || "U"}
          </div>

          <div className="profile-info">

            <p className="profile-label">
              FULL NAME
            </p>

            <h2>
              {user.full_name}
            </h2>

            <p className="profile-label">
              EMAIL
            </p>

            <p>
              {user.email}
            </p>

            <p className="profile-label">
              CAMPUS / COMMUNITY
            </p>

            <p>
              {user.campus || "Campus Community"}
            </p>

          </div>

        </div>


        <div className="profile-side">

          <div className="profile-side-card">
            <span>01</span>

            <h3>
              Your account
            </h3>

            <p>
              Use your account to discover services,
              request help, and offer your own skills.
            </p>
          </div>

          <Link
            to="/dashboard"
            className="profile-dashboard-link"
          >
            ← Back to dashboard
          </Link>

        </div>

      </section>

    </main>
  );
}

export default Profile;
