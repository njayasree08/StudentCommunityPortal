import React, { useEffect, useState } from "react";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function Profile() {
  const [user, setUser] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    currentPassword: "",
    newPassword: ""
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${API_URL}/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to load profile");
      }

      setUser(data.user);

      setForm({
        name: data.user.name || "",
        email: data.user.email || "",
        currentPassword: "",
        newPassword: ""
      });
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field, value) => {
    setForm((previous) => ({
      ...previous,
      [field]: value
    }));
  };

  const saveProfile = async (event) => {
    event.preventDefault();

    setSaving(true);
    setError("");
    setSuccess("");

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${API_URL}/users/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to update profile");
      }

      setUser(data.user);

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      setForm((previous) => ({
        ...previous,
        currentPassword: "",
        newPassword: ""
      }));

      setSuccess("Your profile has been updated successfully.");
    } catch (error) {
      setError(error.message);
    } finally {
      setSaving(false);
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

  if (loading) {
    return (
      <div className="profile-loading">
        <div className="loading-spinner" />
        <span>Loading your profile...</span>
      </div>
    );
  }

  return (
    <div className="profile-page">
      {error && (
        <div className="page-alert error">
          <span>!</span>
          {error}
        </div>
      )}

      {success && (
        <div className="page-alert success">
          <span>✓</span>
          {success}
        </div>
      )}

      <div className="profile-layout">
        <aside className="profile-sidebar-card">
          <div className="profile-cover">
            <div className="profile-large-avatar">
              {initials}
            </div>
          </div>

          <div className="profile-summary">
            <h2>{user?.name}</h2>

            <p>{user?.email}</p>

            <span className="role-badge">
              {user?.role === "admin"
                ? "Administrator"
                : "Student"}
            </span>
          </div>

          <div className="profile-status">
            <div className="status-item">
              <span className="status-check">✓</span>

              <div>
                <strong>Account active</strong>
                <small>You can access the portal.</small>
              </div>
            </div>

            <div className="status-item">
              <span className="status-check">🔒</span>

              <div>
                <strong>Private account</strong>
                <small>Your personal data is protected.</small>
              </div>
            </div>
          </div>
        </aside>

        <section className="profile-main-card">
          <div className="profile-card-header">
            <div>
              <span className="eyebrow">ACCOUNT SETTINGS</span>
              <h2>Personal information</h2>
              <p>
                Keep your StudentHub account information up to
                date.
              </p>
            </div>
          </div>

          <form onSubmit={saveProfile}>
            <div className="profile-section">
              <div className="form-section-heading">
                <span>01</span>
                <div>
                  <h3>Basic information</h3>
                  <p>Update your name and email address.</p>
                </div>
              </div>

              <div className="profile-form-grid">
                <label className="modern-field">
                  <span>Full name</span>

                  <input
                    value={form.name}
                    onChange={(event) =>
                      updateField("name", event.target.value)
                    }
                    placeholder="Your full name"
                    required
                  />
                </label>

                <label className="modern-field">
                  <span>Email address</span>

                  <input
                    type="email"
                    value={form.email}
                    onChange={(event) =>
                      updateField("email", event.target.value)
                    }
                    placeholder="you@example.com"
                    required
                  />
                </label>
              </div>
            </div>

            <div className="profile-divider" />

            <div className="profile-section">
              <div className="form-section-heading">
                <span>02</span>
                <div>
                  <h3>Security</h3>
                  <p>
                    Change your password using your current
                    password.
                  </p>
                </div>
              </div>

              <div className="profile-form-grid">
                <label className="modern-field">
                  <span>Current password</span>

                  <input
                    type="password"
                    value={form.currentPassword}
                    onChange={(event) =>
                      updateField(
                        "currentPassword",
                        event.target.value
                      )
                    }
                    placeholder="Enter current password"
                  />
                </label>

                <label className="modern-field">
                  <span>New password</span>

                  <input
                    type="password"
                    value={form.newPassword}
                    onChange={(event) =>
                      updateField(
                        "newPassword",
                        event.target.value
                      )
                    }
                    placeholder="Enter new password"
                  />
                </label>
              </div>

              <div className="security-tip">
                <span>🔐</span>

                <p>
                  Leave the password fields empty if you do not
                  want to change your password.
                </p>
              </div>
            </div>

            <div className="profile-form-footer">
              <button
                type="button"
                className="secondary-button"
                onClick={loadProfile}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="primary-button"
                disabled={saving}
              >
                {saving ? "Saving..." : "Save changes"}
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}

export default Profile;