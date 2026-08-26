function Profile() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <main className="profile-page">
      <p className="section-eyebrow">YOUR PROFILE</p>

      <h1>
        {user?.full_name || "Your Profile"}
      </h1>

      <div className="profile-card">
        <div className="profile-avatar">
          {user?.full_name?.charAt(0) || "U"}
        </div>

        <div className="profile-info">
          <h2>{user?.full_name || "User"}</h2>

          <p>{user?.email || "No email available"}</p>

          <p>{user?.campus || "No campus available"}</p>
        </div>
      </div>
    </main>
  );
}

export default Profile;