import {
  NavLink,
  Outlet,
  useNavigate
} from "react-router-dom";

function Layout() {

  const navigate =
    useNavigate();

  const user =
    JSON.parse(
      localStorage.getItem("user") ||
      "null"
    );

  const logout = () => {

    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "user"
    );

    navigate(
      "/login",
      {
        replace: true
      }
    );
  };

  const navClass = ({
    isActive
  }) =>
    `sidebar-link ${
      isActive
        ? "sidebar-link-active"
        : ""
    }`;

  return (

    <div className="app-shell">

      {/* ============================
          SIDEBAR
      ============================= */}

      <aside className="sidebar">

        <div className="sidebar-brand">

          <div className="brand-logo">
            SC
          </div>

          <div>

            <h2>
              Student
            </h2>

            <span>
              Community
            </span>

          </div>

        </div>


        {/* USER */}

        <div className="sidebar-user">

          <div className="user-avatar">

            {user?.name
              ?.charAt(0)
              ?.toUpperCase() || "U"}

          </div>

          <div className="sidebar-user-info">

            <strong>
              {user?.name ||
                "User"}
            </strong>

            <span>
              {user?.role ===
              "admin"
                ? "Administrator"
                : "Student"}
            </span>

          </div>

        </div>


        {/* NAVIGATION */}

        <nav className="sidebar-nav">

          <NavLink
            to="/dashboard"
            className={navClass}
          >
            <span>⌂</span>
            Dashboard
          </NavLink>

          <NavLink
            to="/messages"
            className={navClass}
          >
            <span>✉</span>
            Messages
          </NavLink>

          <NavLink
            to="/private-files"
            className={navClass}
          >
            <span>▣</span>
            My Files
          </NavLink>

          <NavLink
            to="/community-files"
            className={navClass}
          >
            <span>▤</span>
            Community Files
          </NavLink>

          <NavLink
            to="/profile"
            className={navClass}
          >
            <span>◉</span>
            Profile
          </NavLink>


          {/* ADMIN */}

          {user?.role ===
            "admin" && (

            <div className="admin-nav-section">

              <div className="nav-section-title">
                ADMIN
              </div>

              <NavLink
                to="/admin"
                className={navClass}
              >
                <span>◆</span>
                Admin Dashboard
              </NavLink>

            </div>

          )}

        </nav>


        {/* LOGOUT */}

        <div className="sidebar-bottom">

          <button
            className="logout-button"
            onClick={logout}
          >
            <span>
              ↪
            </span>

            Logout

          </button>

        </div>

      </aside>


      {/* ============================
          MAIN CONTENT
      ============================= */}

      <main className="main-content">

        <Outlet />

      </main>

    </div>
  );
}

export default Layout;