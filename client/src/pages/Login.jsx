import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value
    }));

    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (!formData.email || !formData.password) {
      setError(
        "Please enter your email address and password."
      );
      return;
    }

    try {
      setLoading(true);

      const apiUrl =
        import.meta.env.VITE_API_URL ||
        "http://localhost:5000/api";

      const response = await fetch(
        `${apiUrl}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email: formData.email.trim(),
            password: formData.password
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Login failed."
        );
      }

      localStorage.setItem(
        "token",
        data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      if (rememberMe) {
        localStorage.setItem(
          "rememberMe",
          "true"
        );
      } else {
        localStorage.removeItem(
          "rememberMe"
        );
      }

      if (data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      setError(
        error.message ||
          "Unable to login. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    window.alert(
      "Please contact the administrator to reset your password."
    );
  };

  return (
    <div className="login-page-shell">

      {/* Background decoration */}
      <div className="login-page-background-grid"></div>

      <div className="login-page-background-glow login-page-glow-one"></div>

      <div className="login-page-background-glow login-page-glow-two"></div>

      <div className="login-page-floating-shape login-page-shape-one"></div>

      <div className="login-page-floating-shape login-page-shape-two"></div>

      <div className="login-page-floating-shape login-page-shape-three"></div>

      <main className="login-page-container">

        {/* =================================================
            BRAND
        ================================================== */}

        <div className="login-page-brand">

          <Link
            to="/login"
            className="login-page-brand-link"
          >
            <div className="login-page-brand-icon">
              <span>✦</span>
            </div>

            <div className="login-page-brand-text">
              <h1>StudentHub</h1>

              <p>
                Student Community Portal
              </p>
            </div>
          </Link>

          <div className="login-page-online-status">
            <span></span>
            Online
          </div>

        </div>

        {/* =================================================
            MAIN CARD
        ================================================== */}

        <section className="login-page-card">

          {/* =================================================
              HEADER
          ================================================== */}

          <div className="login-page-header">

            <div className="login-page-security-label">
              <span></span>
              Secure student access
            </div>

            <h2>
              Welcome back
            </h2>

            <p>
              Sign in to continue to your
              student workspace.
            </p>

          </div>

          {/* =================================================
              ERROR
          ================================================== */}

          {error && (
            <div className="login-page-error">

              <div className="login-page-error-icon">
                !
              </div>

              <div className="login-page-error-content">
                <strong>
                  Unable to sign in
                </strong>

                <p>
                  {error}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setError("")}
                aria-label="Close error"
              >
                ×
              </button>

            </div>
          )}

          {/* =================================================
              FORM
          ================================================== */}

          <form
            className="login-page-form"
            onSubmit={handleSubmit}
          >

            {/* Email */}

            <div className="login-page-field">

              <div className="login-page-field-header">

                <label htmlFor="login-email">
                  Email address
                </label>

                <span>
                  Required
                </span>

              </div>

              <div className="login-page-input-wrapper">

                <div className="login-page-input-icon">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <rect
                      x="3"
                      y="5"
                      width="18"
                      height="14"
                      rx="2"
                    />

                    <path d="m3 7 9 6 9-6" />
                  </svg>
                </div>

                <input
                  id="login-email"
                  name="email"
                  type="email"
                  placeholder="student@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                />

                {formData.email && (
                  <div className="login-page-input-check">
                    ✓
                  </div>
                )}

              </div>

            </div>

            {/* Password */}

            <div className="login-page-field">

              <div className="login-page-field-header">

                <label htmlFor="login-password">
                  Password
                </label>

                <span className="login-page-secure-label">
                  🔒 Secure
                </span>

              </div>

              <div className="login-page-input-wrapper">

                <div className="login-page-input-icon">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <rect
                      x="4"
                      y="10"
                      width="16"
                      height="10"
                      rx="2"
                    />

                    <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                  </svg>
                </div>

                <input
                  id="login-password"
                  name="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                />

                <button
                  type="button"
                  className="login-page-password-toggle"
                  onClick={() =>
                    setShowPassword(
                      (previous) => !previous
                    )
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" />
                      <circle
                        cx="12"
                        cy="12"
                        r="2.5"
                      />
                      <path d="m4 4 16 16" />
                    </svg>
                  ) : (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" />
                      <circle
                        cx="12"
                        cy="12"
                        r="2.5"
                      />
                    </svg>
                  )}
                </button>

              </div>

            </div>

            {/* Options */}

            <div className="login-page-options">

              <label className="login-page-checkbox">

                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(event) =>
                    setRememberMe(
                      event.target.checked
                    )
                  }
                />

                <span className="login-page-checkbox-design"></span>

                <span>
                  Remember me
                </span>

              </label>

              <button
                type="button"
                className="login-page-forgot-button"
                onClick={handleForgotPassword}
              >
                Forgot password?
              </button>

            </div>

            {/* Submit */}

            <button
              type="submit"
              className="login-page-submit-button"
              disabled={loading}
            >

              {loading ? (
                <>
                  <span className="login-page-spinner"></span>

                  <span>
                    Signing in...
                  </span>
                </>
              ) : (
                <>
                  <span>
                    Sign in to StudentHub
                  </span>

                  <span className="login-page-submit-arrow">
                    →
                  </span>
                </>
              )}

            </button>

          </form>

          {/* =================================================
              REGISTER
          ================================================== */}

          <div className="login-page-register-divider">

            <span></span>

            <small>
              NEW TO STUDENTHUB?
            </small>

            <span></span>

          </div>

          <Link
            to="/register"
            className="login-page-create-account"
          >

            <div className="login-page-create-icon">
              +
            </div>

            <div className="login-page-create-content">

              <strong>
                Create your student account
              </strong>

              <span>
                Join the student community
              </span>

            </div>

            <div className="login-page-create-arrow">
              →
            </div>

          </Link>

          {/* =================================================
              FEATURES
          ================================================== */}

          <div className="login-page-features">

            <div className="login-page-features-header">

              <div>
                <span>
                  STUDENTHUB FEATURES
                </span>

                <strong>
                  Everything you need in one place
                </strong>
              </div>

              <div className="login-page-live">
                <span></span>
                Live
              </div>

            </div>

            <div className="login-page-feature-grid">

              <div className="login-page-feature-card">
                <div className="login-page-feature-icon purple">
                  📢
                </div>

                <div>
                  <strong>
                    Announcements
                  </strong>

                  <span>
                    Stay updated
                  </span>
                </div>
              </div>

              <div className="login-page-feature-card">
                <div className="login-page-feature-icon blue">
                  💬
                </div>

                <div>
                  <strong>
                    Community Chat
                  </strong>

                  <span>
                    Connect with students
                  </span>
                </div>
              </div>

              <div className="login-page-feature-card">
                <div className="login-page-feature-icon green">
                  📁
                </div>

                <div>
                  <strong>
                    File Sharing
                  </strong>

                  <span>
                    Access resources
                  </span>
                </div>
              </div>

              <div className="login-page-feature-card">
                <div className="login-page-feature-icon orange">
                  📅
                </div>

                <div>
                  <strong>
                    Personal Events
                  </strong>

                  <span>
                    Manage reminders
                  </span>
                </div>
              </div>

            </div>

          </div>

          {/* =================================================
              STATS
          ================================================== */}

          <div className="login-page-stats">

            <div className="login-page-stat">
              <strong>
                24/7
              </strong>

              <span>
                Access
              </span>
            </div>

            <div className="login-page-stat-divider"></div>

            <div className="login-page-stat">
              <strong>
                100%
              </strong>

              <span>
                Secure
              </span>
            </div>

            <div className="login-page-stat-divider"></div>

            <div className="login-page-stat">
              <strong>
                1
              </strong>

              <span>
                Community
              </span>
            </div>

          </div>

          {/* =================================================
              SECURITY
          ================================================== */}

          <div className="login-page-security">

            <div className="login-page-security-item">

              <div className="login-page-security-icon">
                🔐
              </div>

              <div>
                <strong>
                  Secure Authentication
                </strong>

                <span>
                  Protected login
                </span>
              </div>

            </div>

            <div className="login-page-security-item">

              <div className="login-page-security-icon">
                🛡️
              </div>

              <div>
                <strong>
                  Private Data
                </strong>

                <span>
                  Your information stays protected
                </span>
              </div>

            </div>

          </div>

          {/* =================================================
              MESSAGE
          ================================================== */}

          <div className="login-page-message">

            <div className="login-page-message-decoration">
              ✦
            </div>

            <div className="login-page-message-content">

              <strong>
                Learn • Connect • Grow
              </strong>

              <p>
                A simple digital space designed
                to bring students, resources and
                communication together in one place.
              </p>

            </div>

            <span className="login-page-message-arrow">
              →
            </span>

          </div>

        </section>

        {/* =================================================
            FOOTER
        ================================================== */}

        <footer className="login-page-footer">

          <div>
            <span>⌾</span>
            Protected by secure authentication
          </div>

          <span>
            v1.0
          </span>

        </footer>

      </main>

      <div className="login-page-bottom-text">
        <span>STUDENT COMMUNITY</span>
        <span>•</span>
        <span>LEARN</span>
        <span>•</span>
        <span>CONNECT</span>
        <span>•</span>
        <span>GROW</span>
      </div>

    </div>
  );
};

export default Login;