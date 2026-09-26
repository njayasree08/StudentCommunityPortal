import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Register() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (event) => {

    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });

    setError("");
  };

  const handleSubmit = async (event) => {

    event.preventDefault();

    setError("");
    setSuccess("");

    // Check password
    if (
      formData.password !==
      formData.confirmPassword
    ) {

      setError(
        "Passwords do not match."
      );

      return;
    }

    // Basic password validation
    if (formData.password.length < 6) {

      setError(
        "Password must be at least 6 characters."
      );

      return;
    }

    setLoading(true);

    try {

      const response = await fetch(
        "http://localhost:5000/api/students/register",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify({
            name: formData.name.trim(),
            email: formData.email.trim(),
            password: formData.password
          })
        }
      );

      const data =
        await response.json();

      if (!response.ok) {

        throw new Error(
          data.message ||
          "Registration failed."
        );

      }

      setSuccess(
        "Account created successfully! Redirecting to login..."
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

      setError(
        error.message ||
        "Unable to create account."
      );

    } finally {

      setLoading(false);

    }
  };

  return (

    <div className="auth-page">

      <div className="auth-container">

        {/* =================================
            LEFT SECTION
        ================================== */}

        <div className="auth-brand">

          <div className="auth-brand-content">

            <div className="brand-logo">
              SC
            </div>

            <h1>
              Student Community
            </h1>

            <p>
              Create your account and join
              a connected learning community
              where students can communicate,
              share resources and stay updated.
            </p>


            <div className="auth-features">

              <div className="auth-feature">

                <span className="auth-feature-icon">
                  ✓
                </span>

                Create a secure student account

              </div>


              <div className="auth-feature">

                <span className="auth-feature-icon">
                  ✓
                </span>

                Connect with community members

              </div>


              <div className="auth-feature">

                <span className="auth-feature-icon">
                  ✓
                </span>

                Share educational resources

              </div>


              <div className="auth-feature">

                <span className="auth-feature-icon">
                  ✓
                </span>

                Access important updates

              </div>

            </div>

          </div>

        </div>


        {/* =================================
            REGISTER FORM
        ================================== */}

        <div className="auth-form-section">

          <form
            className="auth-form"
            onSubmit={handleSubmit}
          >

            <div className="auth-form-header">

              <h2>
                Create account
              </h2>

              <p>
                Register to join the student
                community.
              </p>

            </div>


            {/* ERROR */}

            {error && (

              <div className="error-message">

                {error}

              </div>

            )}


            {/* SUCCESS */}

            {success && (

              <div className="success-message">

                {success}

              </div>

            )}


            {/* NAME */}

            <div className="form-group">

              <label className="form-label">
                Full Name
              </label>

              <input
                className="form-input"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
              />

            </div>


            {/* EMAIL */}

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


            {/* PASSWORD */}

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
                placeholder="Create a password"
                minLength="6"
                required
              />

              <small
                style={{
                  display: "block",
                  marginTop: "6px",
                  color: "#64748b",
                  fontSize: "11px"
                }}
              >
                Minimum 6 characters
              </small>

            </div>


            {/* CONFIRM PASSWORD */}

            <div className="form-group">

              <label className="form-label">
                Confirm Password
              </label>

              <input
                className="form-input"
                type="password"
                name="confirmPassword"
                value={
                  formData.confirmPassword
                }
                onChange={handleChange}
                placeholder="Confirm your password"
                required
              />

            </div>


            {/* REGISTER */}

            <button
              type="submit"
              className="btn btn-primary btn-full"
              disabled={loading}
            >

              {loading
                ? "Creating account..."
                : "Create Account"}

            </button>


            {/* LOGIN LINK */}

            <p
              style={{
                marginTop: "20px",
                textAlign: "center",
                fontSize: "13px",
                color: "#6b7280"
              }}
            >

              Already have an account?{" "}

              <Link
                to="/login"
                style={{
                  color: "#4f46e5",
                  fontWeight: "600"
                }}
              >
                Sign in
              </Link>

            </p>

          </form>

        </div>

      </div>

    </div>
  );
}

export default Register;