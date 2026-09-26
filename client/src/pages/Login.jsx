import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const handleChange = (event) => {

    setFormData({
      ...formData,
      [event.target.name]:
        event.target.value
    });

  };

  const handleSubmit = async (event) => {

    event.preventDefault();

    setError("");
    setLoading(true);

    try {

      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify(formData)
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
          "Login failed"
        );
      }

      /*
      ========================================
      SAVE LOGIN SESSION
      ========================================
      */

      localStorage.setItem(
        "token",
        data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      /*
      ========================================
      REDIRECT
      ========================================
      */

      if (
        data.user.role === "admin"
      ) {

        navigate("/admin");

      } else {

        navigate("/dashboard");

      }

    } catch (error) {

      setError(
        error.message ||
        "Unable to login"
      );

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="auth-page">

      <div className="auth-container">

        <div className="auth-brand">

          <div className="auth-brand-content">

            <div className="brand-logo">
              SC
            </div>

            <h1>
              Student Community
            </h1>

            <p>
              A modern platform for students
              to connect, communicate, share
              resources and stay updated with
              important announcements.
            </p>

            <div className="auth-features">

              <div className="auth-feature">
                <span className="auth-feature-icon">
                  ✓
                </span>
                Secure student accounts
              </div>

              <div className="auth-feature">
                <span className="auth-feature-icon">
                  ✓
                </span>
                Private messaging
              </div>

              <div className="auth-feature">
                <span className="auth-feature-icon">
                  ✓
                </span>
                Educational file sharing
              </div>

              <div className="auth-feature">
                <span className="auth-feature-icon">
                  ✓
                </span>
                Important announcements
              </div>

            </div>

          </div>

        </div>

        <div className="auth-form-section">

          <form
            className="auth-form"
            onSubmit={handleSubmit}
          >

            <div className="auth-form-header">

              <h2>
                Welcome back
              </h2>

              <p>
                Sign in to access your
                student dashboard.
              </p>

            </div>

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <div className="form-group">

              <label className="form-label">
                Email
              </label>

              <input
                className="form-input"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />

            </div>

            <div className="form-group">

              <label className="form-label">
                Password
              </label>

              <input
                className="form-input"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
              />

            </div>

            <button
              type="submit"
              className="btn btn-primary btn-full"
              disabled={loading}
            >

              {loading
                ? "Signing in..."
                : "Sign In"}

            </button>

            <p
              style={{
                marginTop: "20px",
                textAlign: "center",
                fontSize: "13px",
                color: "#6b7280"
              }}
            >

              Don't have an account?{" "}

              <Link
                to="/register"
                style={{
                  color: "#4f46e5",
                  fontWeight: "600"
                }}
              >
                Create account
              </Link>

            </p>

          </form>

        </div>

      </div>

    </div>
  );
}

export default Login;