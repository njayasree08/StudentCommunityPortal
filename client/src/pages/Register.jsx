import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Register.css";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value
    }));

    setError("");
    setSuccess("");
  };

  const getPasswordStrength = () => {
    const password = formData.password;

    if (!password) {
      return {
        label: "",
        level: 0
      };
    }

    let score = 0;

    if (password.length >= 6) score++;
    if (password.length >= 10) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 2) {
      return {
        label: "Weak password",
        level: 1
      };
    }

    if (score <= 4) {
      return {
        label: "Medium password",
        level: 2
      };
    }

    return {
      label: "Strong password",
      level: 3
    };
  };

  const passwordStrength = getPasswordStrength();

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    const name = formData.name.trim();
    const email = formData.email.trim().toLowerCase();
    const password = formData.password;
    const confirmPassword = formData.confirmPassword;

    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (name.length < 2) {
      setError("Please enter a valid name.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/students/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            name,
            email,
            password
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to create your account."
        );
      }

      setSuccess(
        "Account created successfully. Redirecting to login..."
      );

      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
      });

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      console.error("Registration error:", error);

      setError(
        error.message ||
          "Unable to create your account. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-background-shape register-shape-one"></div>
      <div className="register-background-shape register-shape-two"></div>

      <div className="register-container">
        {/* LEFT BRANDING SECTION */}
        <section className="register-brand-panel">
          <div className="register-brand-content">
            <div className="register-logo">
              <div className="register-logo-icon">SC</div>

              <div>
                <h1>Student Community</h1>
                <span>Education Portal</span>
              </div>
            </div>

            <div className="register-welcome">
              <div className="register-small-label">
                JOIN THE COMMUNITY
              </div>

              <h2>
                Start your
                <span> learning journey.</span>
              </h2>

              <p>
                Create your account and connect with students,
                announcements, learning resources and your
                academic community.
              </p>
            </div>

            <div className="register-feature-list">
              <div className="register-feature">
                <div className="register-feature-icon">✓</div>

                <div>
                  <strong>Connect with Students</strong>
                  <p>Communicate with your community.</p>
                </div>
              </div>

              <div className="register-feature">
                <div className="register-feature-icon">✓</div>

                <div>
                  <strong>Stay Updated</strong>
                  <p>Receive important announcements.</p>
                </div>
              </div>

              <div className="register-feature">
                <div className="register-feature-icon">✓</div>

                <div>
                  <strong>Share Resources</strong>
                  <p>Access and share educational files.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="register-brand-footer">
            <span>Student Community & Education Portal</span>
            <span>© 2026</span>
          </div>
        </section>

        {/* RIGHT FORM SECTION */}
        <section className="register-form-panel">
          <div className="register-form-wrapper">
            <div className="register-form-header">
              <div className="register-mobile-logo">SC</div>

              <div className="register-form-title">
                <span>Create Account</span>

                <h2>Join us today</h2>

                <p>
                  Create your student account to get started.
                </p>
              </div>
            </div>

            {error && (
              <div className="register-alert register-alert-error">
                <span className="register-alert-icon">!</span>
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="register-alert register-alert-success">
                <span className="register-alert-icon">✓</span>
                <span>{success}</span>
              </div>
            )}

            <form
              className="register-form"
              onSubmit={handleSubmit}
            >
              {/* NAME */}
              <div className="register-field">
                <label htmlFor="name">Full Name</label>

                <div className="register-input-wrapper">
                  <span className="register-input-icon">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <path d="M20 21a8 8 0 0 0-16 0" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </span>

                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                    autoComplete="name"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* EMAIL */}
              <div className="register-field">
                <label htmlFor="email">
                  Email Address
                </label>

                <div className="register-input-wrapper">
                  <span className="register-input-icon">
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
                  </span>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    autoComplete="email"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div className="register-field">
                <div className="register-label-row">
                  <label htmlFor="password">
                    Password
                  </label>

                  <span className="register-password-hint">
                    Min. 6 characters
                  </span>
                </div>

                <div className="register-input-wrapper">
                  <span className="register-input-icon">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <rect
                        x="5"
                        y="10"
                        width="14"
                        height="10"
                        rx="2"
                      />
                      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                    </svg>
                  </span>

                  <input
                    id="password"
                    name="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="new-password"
                    disabled={loading}
                  />

                  <button
                    type="button"
                    className="register-password-toggle"
                    onClick={() =>
                      setShowPassword(
                        (previous) => !previous
                      )
                    }
                    disabled={loading}
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
                        <path d="M3 3l18 18" />
                        <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
                        <path d="M9.9 4.2A10.7 10.7 0 0 1 12 4c5.5 0 9.5 5 9.5 8s-4 8-9.5 8a10.5 10.5 0 0 1-5.5-1.6" />
                        <path d="M6.6 6.7C4.2 8.1 2.5 10.6 2.5 12c0 1.1 1.1 3.1 3.1 4.9" />
                      </svg>
                    ) : (
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      >
                        <path d="M2.5 12s3.5-7 9.5-7 9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7Z" />
                        <circle cx="12" cy="12" r="2.5" />
                      </svg>
                    )}
                  </button>
                </div>

                {formData.password && (
                  <div className="register-password-strength">
                    <div className="register-strength-bars">
                      <span
                        className={
                          passwordStrength.level >= 1
                            ? `strength-active strength-${passwordStrength.level}`
                            : ""
                        }
                      ></span>

                      <span
                        className={
                          passwordStrength.level >= 2
                            ? `strength-active strength-${passwordStrength.level}`
                            : ""
                        }
                      ></span>

                      <span
                        className={
                          passwordStrength.level >= 3
                            ? `strength-active strength-${passwordStrength.level}`
                            : ""
                        }
                      ></span>
                    </div>

                    <small>
                      {passwordStrength.label}
                    </small>
                  </div>
                )}
              </div>

              {/* CONFIRM PASSWORD */}
              <div className="register-field">
                <label htmlFor="confirmPassword">
                  Confirm Password
                </label>

                <div className="register-input-wrapper">
                  <span className="register-input-icon">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <rect
                        x="5"
                        y="10"
                        width="14"
                        height="10"
                        rx="2"
                      />
                      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                      <path d="m9 15 2 2 4-4" />
                    </svg>
                  </span>

                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    autoComplete="new-password"
                    disabled={loading}
                  />

                  <button
                    type="button"
                    className="register-password-toggle"
                    onClick={() =>
                      setShowConfirmPassword(
                        (previous) => !previous
                      )
                    }
                    disabled={loading}
                    aria-label={
                      showConfirmPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showConfirmPassword ? (
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      >
                        <path d="M3 3l18 18" />
                        <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
                        <path d="M9.9 4.2A10.7 10.7 0 0 1 12 4c5.5 0 9.5 5 9.5 8s-4 8-9.5 8a10.5 10.5 0 0 1-5.5-1.6" />
                        <path d="M6.6 6.7C4.2 8.1 2.5 10.6 2.5 12c0 1.1 1.1 3.1 3.1 4.9" />
                      </svg>
                    ) : (
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      >
                        <path d="M2.5 12s3.5-7 9.5-7 9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7Z" />
                        <circle cx="12" cy="12" r="2.5" />
                      </svg>
                    )}
                  </button>
                </div>

                {formData.confirmPassword && (
                  <div
                    className={
                      formData.password ===
                      formData.confirmPassword
                        ? "register-match register-match-success"
                        : "register-match register-match-error"
                    }
                  >
                    {formData.password ===
                    formData.confirmPassword
                      ? "✓ Passwords match"
                      : "Passwords do not match"}
                  </div>
                )}
              </div>

              {/* TERMS */}
              <div className="register-terms">
                <span className="register-terms-check">
                  ✓
                </span>

                <p>
                  By creating an account, you agree to use
                  the Student Community Portal responsibly.
                </p>
              </div>

              {/* SUBMIT */}
              <button
                type="submit"
                className="register-submit-button"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="register-spinner"></span>
                    Creating account...
                  </>
                ) : (
                  <>
                    Create Account

                    <span className="register-submit-arrow">
                      →
                    </span>
                  </>
                )}
              </button>
            </form>

            {/* LOGIN */}
            <div className="register-login-section">
              <span>Already have an account?</span>

              <Link to="/login">
                Sign in
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Register;