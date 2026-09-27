import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [broadcastMessage, setBroadcastMessage] = useState("");
  const [sending, setSending] = useState(false);

  const [status, setStatus] = useState({
    type: "",
    message: ""
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${API_URL}/users`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (response.ok) {
        setUsers(data.users || []);
      }
    } catch (error) {
      console.error("Admin users error:", error);
    } finally {
      setLoading(false);
    }
  };

  const sendBroadcast = async (event) => {
    event.preventDefault();

    if (!broadcastMessage.trim()) return;

    const token = localStorage.getItem("token");

    setSending(true);
    setStatus({
      type: "",
      message: ""
    });

    try {
      const response = await fetch(
        `${API_URL}/messages/broadcast`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            message: broadcastMessage.trim()
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to send announcement"
        );
      }

      setBroadcastMessage("");

      setStatus({
        type: "success",
        message: data.message
      });
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message
      });
    } finally {
      setSending(false);
    }
  };

  const students = users.filter(
    (user) => user.role !== "admin"
  );

  return (
    <div className="admin-page">
      <section className="admin-hero">
        <div>
          <div className="hero-mini-badge">
            🛡️ Administrator workspace
          </div>

          <h2>Community control center</h2>

          <p>
            Manage your StudentHub community and communicate
            with registered members.
          </p>
        </div>

        <div className="admin-hero-mark">SH</div>
      </section>

      <section className="admin-stats">
        <div className="admin-stat-card">
          <span className="admin-stat-icon blue">👥</span>

          <div>
            <small>Total members</small>
            <strong>{loading ? "—" : users.length}</strong>
          </div>
        </div>

        <div className="admin-stat-card">
          <span className="admin-stat-icon purple">🎓</span>

          <div>
            <small>Students</small>
            <strong>{loading ? "—" : students.length}</strong>
          </div>
        </div>

        <div className="admin-stat-card">
          <span className="admin-stat-icon green">🛡️</span>

          <div>
            <small>Administrators</small>
            <strong>
              {loading
                ? "—"
                : users.filter(
                    (user) => user.role === "admin"
                  ).length}
            </strong>
          </div>
        </div>

        <div className="admin-stat-card">
          <span className="admin-stat-icon orange">✓</span>

          <div>
            <small>System status</small>
            <strong>Online</strong>
          </div>
        </div>
      </section>

      <section className="admin-grid">
        <div className="admin-card broadcast-card">
          <div className="admin-card-heading">
            <div className="admin-heading-icon">📢</div>

            <div>
              <span className="eyebrow">COMMUNITY MESSAGE</span>
              <h3>Message all students</h3>
              <p>
                Send one message to every registered community
                member.
              </p>
            </div>
          </div>

          {status.message && (
            <div
              className={`page-alert ${
                status.type === "success"
                  ? "success"
                  : "error"
              }`}
            >
              <span>
                {status.type === "success" ? "✓" : "!"}
              </span>

              {status.message}
            </div>
          )}

          <form onSubmit={sendBroadcast}>
            <textarea
              className="admin-message-input"
              value={broadcastMessage}
              onChange={(event) =>
                setBroadcastMessage(event.target.value)
              }
              placeholder="Write an important message for the community..."
              rows="6"
            />

            <div className="broadcast-footer">
              <span>
                This message will be sent to all other registered
                users.
              </span>

              <button
                type="submit"
                className="primary-button"
                disabled={
                  sending || !broadcastMessage.trim()
                }
              >
                {sending ? "Sending..." : "Send to community →"}
              </button>
            </div>
          </form>
        </div>

        <div className="admin-card quick-admin-card">
          <div className="admin-card-heading">
            <div className="admin-heading-icon purple-bg">
              ⚡
            </div>

            <div>
              <span className="eyebrow">QUICK ACTIONS</span>
              <h3>Manage portal</h3>
              <p>Jump directly to important areas.</p>
            </div>
          </div>

          <div className="admin-actions">
            <Link to="/messages" className="admin-action">
              <span>💬</span>
              <div>
                <strong>Messages</strong>
                <small>View conversations</small>
              </div>
              <b>→</b>
            </Link>

            <Link
              to="/community-files"
              className="admin-action"
            >
              <span>🌐</span>
              <div>
                <strong>Community Files</strong>
                <small>View shared resources</small>
              </div>
              <b>→</b>
            </Link>

            <Link
              to="/private-files"
              className="admin-action"
            >
              <span>📁</span>
              <div>
                <strong>My Files</strong>
                <small>Manage admin files</small>
              </div>
              <b>→</b>
            </Link>

            <Link to="/profile" className="admin-action">
              <span>⚙️</span>
              <div>
                <strong>Profile</strong>
                <small>Manage admin account</small>
              </div>
              <b>→</b>
            </Link>
          </div>
        </div>
      </section>

      <section className="admin-card users-card">
        <div className="admin-card-heading users-heading">
          <div>
            <span className="eyebrow">MEMBERS</span>
            <h3>Registered community members</h3>
            <p>
              Users currently registered on StudentHub.
            </p>
          </div>

          <span className="member-count">
            {users.length} members
          </span>
        </div>

        <div className="users-table-wrapper">
          <table className="users-table">
            <thead>
              <tr>
                <th>Member</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" className="table-empty">
                    Loading members...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="4" className="table-empty">
                    No registered users found.
                  </td>
                </tr>
              ) : (
                users.map((user) => {
                  const initials = user.name
                    ?.split(" ")
                    .map((item) => item[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase();

                  return (
                    <tr key={user._id}>
                      <td>
                        <div className="table-user">
                          <div className="table-avatar">
                            {initials || "U"}
                          </div>

                          <strong>{user.name}</strong>
                        </div>
                      </td>

                      <td>{user.email}</td>

                      <td>
                        <span
                          className={`table-role ${
                            user.role === "admin"
                              ? "admin"
                              : ""
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>

                      <td>
                        <span className="table-status">
                          <span />
                          Active
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default AdminDashboard;