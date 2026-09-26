import {
  useEffect,
  useState
} from "react";

function Profile() {

  const token =
    localStorage.getItem("token");

  const [user, setUser] =
    useState(null);

  const [formData, setFormData] =
    useState({
      name: "",
      email: "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    });

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");


  // ==========================================
  // LOAD PROFILE
  // ==========================================

  const loadProfile = async () => {

    try {

      const response =
        await fetch(
          "http://localhost:5000/api/users/me",
          {
            headers: {
              Authorization:
                `Bearer ${token}`
            }
          }
        );

      const data =
        await response.json();

      if (!response.ok) {

        throw new Error(
          data.message ||
          "Unable to load profile"
        );

      }

      setUser(data.user);

      setFormData({
        name: data.user.name || "",
        email: data.user.email || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });

    } catch (error) {

      setError(
        error.message
      );

    } finally {

      setLoading(false);

    }
  };


  useEffect(() => {

    loadProfile();

  }, []);


  // ==========================================
  // INPUT CHANGE
  // ==========================================

  const handleChange = (event) => {

    setFormData({
      ...formData,
      [event.target.name]:
        event.target.value
    });

    setError("");
    setMessage("");
  };


  // ==========================================
  // UPDATE PROFILE
  // ==========================================

  const handleSubmit =
    async (event) => {

      event.preventDefault();

      setError("");
      setMessage("");


      // Password confirmation
      if (
        formData.newPassword &&
        formData.newPassword !==
          formData.confirmPassword
      ) {

        setError(
          "New passwords do not match."
        );

        return;
      }


      // If changing email or password,
      // current password is required.
      const emailChanged =
        formData.email.trim()
          .toLowerCase() !==
        user.email.toLowerCase();

      const passwordChanged =
        formData.newPassword.length > 0;


      if (
        (emailChanged ||
          passwordChanged) &&
        !formData.currentPassword
      ) {

        setError(
          "Enter your current password to change email or password."
        );

        return;
      }


      try {

        setSaving(true);

        const response =
          await fetch(
            "http://localhost:5000/api/users/me",
            {
              method: "PUT",

              headers: {
                "Content-Type":
                  "application/json",

                Authorization:
                  `Bearer ${token}`
              },

              body: JSON.stringify({

                name:
                  formData.name.trim(),

                email:
                  formData.email
                    .trim()
                    .toLowerCase(),

                currentPassword:
                  formData.currentPassword,

                newPassword:
                  formData.newPassword

              })
            }
          );

        const data =
          await response.json();


        if (!response.ok) {

          throw new Error(
            data.message ||
            "Unable to update profile"
          );

        }


        // Update local user
        setUser(data.user);

        localStorage.setItem(
          "user",
          JSON.stringify(
            data.user
          )
        );


        // Clear passwords
        setFormData({
          name:
            data.user.name,

          email:
            data.user.email,

          currentPassword: "",

          newPassword: "",

          confirmPassword: ""
        });


        setMessage(
          "Profile updated successfully."
        );

      } catch (error) {

        setError(
          error.message
        );

      } finally {

        setSaving(false);

      }

    };


  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {

    return (

      <div className="page-container">

        <div className="empty-state">

          Loading profile...

        </div>

      </div>

    );

  }


  // ==========================================
  // PAGE
  // ==========================================

  return (

    <div className="page-container">

      {/* HEADER */}

      <div className="page-header">

        <div>

          <p className="eyebrow">
            ACCOUNT
          </p>

          <h1>
            My Profile
          </h1>

          <p>
            Manage your account information,
            email and password.
          </p>

        </div>

      </div>


      <div className="profile-layout">


        {/* =================================
            PROFILE CARD
        ================================== */}

        <div className="card profile-card">

          <div className="large-avatar">

            {user?.name
              ?.charAt(0)
              ?.toUpperCase()}

          </div>

          <h2>
            {user?.name}
          </h2>

          <p>
            {user?.email}
          </p>

          <span className="role-badge">

            {user?.role === "admin"
              ? "Administrator"
              : "Student"}

          </span>

        </div>


        {/* =================================
            ACCOUNT SETTINGS
        ================================== */}

        <div className="card">

          <div className="card-header">

            <h2>
              Account Settings
            </h2>

            <p>
              Update your personal information
              and password.
            </p>

          </div>


          <form
            onSubmit={handleSubmit}
            style={{
              padding: "24px"
            }}
          >


            {/* NAME */}

            <div className="form-group">

              <label className="form-label">
                Full Name
              </label>

              <input
                className="form-input"
                type="text"
                name="name"
                value={
                  formData.name
                }
                onChange={
                  handleChange
                }
                required
              />

            </div>


            {/* EMAIL */}

            <div className="form-group">

              <label className="form-label">
                Email Address
              </label>

              <input
                className="form-input"
                type="email"
                name="email"
                value={
                  formData.email
                }
                onChange={
                  handleChange
                }
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
                Changing your email requires
                your current password.
              </small>

            </div>


            {/* DIVIDER */}

            <div
              style={{
                height: "1px",
                background: "#e5e7eb",
                margin:
                  "25px 0"
              }}
            />


            <h3
              style={{
                marginTop: 0,
                marginBottom: "5px"
              }}
            >
              Change Password
            </h3>

            <p
              style={{
                color: "#64748b",
                fontSize: "13px",
                marginTop: 0,
                marginBottom: "20px"
              }}
            >
              Leave the new password fields
              empty if you don't want to
              change your password.
            </p>


            {/* CURRENT PASSWORD */}

            <div className="form-group">

              <label className="form-label">
                Current Password
              </label>

              <input
                className="form-input"
                type="password"
                name="currentPassword"
                value={
                  formData.currentPassword
                }
                onChange={
                  handleChange
                }
                placeholder="Enter current password"
              />

            </div>


            {/* NEW PASSWORD */}

            <div className="form-group">

              <label className="form-label">
                New Password
              </label>

              <input
                className="form-input"
                type="password"
                name="newPassword"
                value={
                  formData.newPassword
                }
                onChange={
                  handleChange
                }
                placeholder="Enter new password"
                minLength="6"
              />

            </div>


            {/* CONFIRM PASSWORD */}

            <div className="form-group">

              <label className="form-label">
                Confirm New Password
              </label>

              <input
                className="form-input"
                type="password"
                name="confirmPassword"
                value={
                  formData.confirmPassword
                }
                onChange={
                  handleChange
                }
                placeholder="Confirm new password"
              />

            </div>


            {/* ERROR */}

            {error && (

              <div className="error-message">

                {error}

              </div>

            )}


            {/* SUCCESS */}

            {message && (

              <div className="success-message">

                {message}

              </div>

            )}


            {/* SAVE */}

            <button
              type="submit"
              className="btn btn-primary"
              disabled={saving}
            >

              {saving
                ? "Saving..."
                : "Save Changes"}

            </button>

          </form>

        </div>

      </div>

    </div>

  );
}

export default Profile;