import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    privateFiles: 0,
    communityFiles: 0,
    members: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        setUser(null);
      }
    }

    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const headers = {
        Authorization: `Bearer ${token}`
      };

      const [privateResponse, communityResponse, usersResponse] =
        await Promise.all([
          fetch(`${API_URL}/files/private`, { headers }),
          fetch(`${API_URL}/files/community`, { headers }),
          fetch(`${API_URL}/users`, { headers })
        ]);

      const privateData = privateResponse.ok
        ? await privateResponse.json()
        : { files: [] };

      const communityData = communityResponse.ok
        ? await communityResponse.json()
        : { files: [] };

      const usersData = usersResponse.ok
        ? await usersResponse.json()
        : { users: [] };

      setStats({
        privateFiles: privateData.files?.length || 0,
        communityFiles: communityData.files?.length || 0,
        members: usersData.users?.length || 0
      });
    } catch (error) {
      console.error("Dashboard loading error:", error);
    } finally {
      setLoading(false);
    }
  };

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((item) => item[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "S";

  const quickActions = [
    {
      title: "Private Messages",
      description: "Chat privately with students and administrators.",
      path: "/messages",
      icon: "💬",
      className: "blue"
    },
    {
      title: "My Files",
      description: "Store and access your private documents.",
      path: "/private-files",
      icon: "📁",
      className: "purple"
    },
    {
      title: "Community Files",
      description: "Explore files shared by the community.",
      path: "/community-files",
      icon: "🌐",
      className: "green"
    },
    {
      title: "My Profile",
      description: "Update your account and security settings.",
      path: "/profile",
      icon: "👤",
      className: "orange"
    }
  ];

  return (
    <div className="dashboard-page">
      <section className="welcome-banner">
        <div className="welcome-content">
          <div className="welcome-badge">
            <span className="welcome-pulse" />
            StudentHub is active
          </div>

          <h2>
            Welcome back,{" "}
            <span>{user?.name?.split(" ")[0] || "Student"}</span> 👋
          </h2>

          <p>
            Stay connected, manage your files, communicate with your
            community and keep everything organized in one place.
          </p>

          <div className="welcome-actions">
            <Link to="/messages" className="primary-button">
              Open Messages
            </Link>

            <Link to="/private-files" className="secondary-button">
              View My Files
            </Link>
          </div>
        </div>

        <div className="welcome-visual">
          <div className="welcome-circle circle-one" />
          <div className="welcome-circle circle-two" />

          <div className="welcome-avatar">
            {initials}
          </div>

          <div className="floating-card floating-card-top">
            <span>✓</span>
            <div>
              <strong>Account active</strong>
              <small>Everything is ready</small>
            </div>
          </div>

          <div className="floating-card floating-card-bottom">
            <span>↗</span>
            <div>
              <strong>Stay connected</strong>
              <small>Community access</small>
            </div>
          </div>
        </div>
      </section>

      <section className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon stat-blue">📁</div>

          <div className="stat-content">
            <span>My Private Files</span>

            <strong>
              {loading ? "—" : stats.privateFiles}
            </strong>

            <small>Your personal documents</small>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon stat-purple">🌐</div>

          <div className="stat-content">
            <span>Community Files</span>

            <strong>
              {loading ? "—" : stats.communityFiles}
            </strong>

            <small>Shared with members</small>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon stat-green">👥</div>

          <div className="stat-content">
            <span>Community Members</span>

            <strong>
              {loading ? "—" : stats.members}
            </strong>

            <small>Registered users</small>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon stat-orange">🔐</div>

          <div className="stat-content">
            <span>Account Status</span>

            <strong>Active</strong>

            <small>Secure access enabled</small>
          </div>
        </div>
      </section>

      <section className="section-heading">
        <div>
          <span className="eyebrow">WORKSPACE</span>
          <h3>Everything you need</h3>
          <p>
            Quickly access the most important areas of your portal.
          </p>
        </div>
      </section>

      <section className="quick-actions-grid">
        {quickActions.map((action) => (
          <Link
            to={action.path}
            className="quick-action-card"
            key={action.path}
          >
            <div className={`quick-action-icon ${action.className}`}>
              {action.icon}
            </div>

            <div className="quick-action-content">
              <h4>{action.title}</h4>

              <p>{action.description}</p>

              <span className="action-link">
                Open workspace <span>→</span>
              </span>
            </div>
          </Link>
        ))}
      </section>

      <section className="dashboard-bottom-grid">
        <div className="dashboard-info-card">
          <div className="card-heading">
            <div>
              <span className="eyebrow">YOUR ACCOUNT</span>
              <h3>Profile overview</h3>
            </div>

            <Link to="/profile" className="text-link">
              Edit profile →
            </Link>
          </div>

          <div className="profile-overview">
            <div className="large-avatar">
              {initials}
            </div>

            <div className="profile-overview-info">
              <h4>{user?.name || "Student"}</h4>

              <p>{user?.email || "student@example.com"}</p>

              <span className="role-badge">
                {user?.role === "admin" ? "Administrator" : "Student"}
              </span>
            </div>
          </div>

          <div className="security-row">
            <div className="security-icon">✓</div>

            <div>
              <strong>Account secured</strong>
              <span>Your account is protected by authentication.</span>
            </div>
          </div>
        </div>

        <div className="dashboard-info-card">
          <div className="card-heading">
            <div>
              <span className="eyebrow">QUICK TIP</span>
              <h3>Keep your workspace organized</h3>
            </div>
          </div>

          <div className="tip-content">
            <div className="tip-large-icon">💡</div>

            <p>
              Use <strong>My Files</strong> for personal documents and
              <strong> Community Files</strong> when you want to share
              resources with other members.
            </p>

            <Link to="/community-files" className="outline-button">
              Explore Community
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Dashboard;