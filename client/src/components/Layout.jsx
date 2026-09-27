import React, { useEffect, useMemo, useState } from "react";
import {
  NavLink,
  Outlet,
  useLocation,
  useNavigate
} from "react-router-dom";

const icon = (name, size = 20) => {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    className: "nav-svg"
  };

  const icons = {
    dashboard: (
      <svg {...common}>
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),

    messages: (
      <svg {...common}>
        <path d="M20 11.5a7.5 7.5 0 0 1-7.5 7.5H8l-4 2v-4.5A7.5 7.5 0 1 1 20 11.5Z" />
        <path d="M8 11h.01M12 11h.01M16 11h.01" />
      </svg>
    ),

    files: (
      <svg {...common}>
        <path d="M13 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V10Z" />
        <path d="M13 3v7h7" />
        <path d="M8 14h8M8 18h5" />
      </svg>
    ),

    community: (
      <svg {...common}>
        <circle cx="9" cy="8" r="3" />
        <circle cx="17" cy="9" r="2.5" />
        <path d="M3.5 19a5.5 5.5 0 0 1 11 0" />
        <path d="M14 15a4.5 4.5 0 0 1 6.5 4" />
      </svg>
    ),

    profile: (
      <svg {...common}>
        <circle cx="12" cy="8" r="3.5" />
        <path d="M5 21a7 7 0 0 1 14 0" />
      </svg>
    ),

    admin: (
      <svg {...common}>
        <path d="M12 3 20 6v5c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6Z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),

    logout: (
      <svg {...common}>
        <path d="M10 17l5-5-5-5" />
        <path d="M15 12H3" />
        <path d="M21 19V5a2 2 0 0 0-2-2h-6" />
      </svg>
    ),

    menu: (
      <svg {...common}>
        <path d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    ),

    close: (
      <svg {...common}>
        <path d="m6 6 12 12M18 6 6 18" />
      </svg>
    ),

    bell: (
      <svg {...common}>
        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
        <path d="M10 21h4" />
      </svg>
    ),

    search: (
      <svg {...common}>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-4-4" />
      </svg>
    ),

    chevron: (
      <svg {...common}>
        <path d="m9 18 6-6-6-6" />
      </svg>
    )
  };

  return icons[name] || null;
};

function Layout() {
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");

      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const navigation = useMemo(() => {
    const items = [
      {
        path: "/dashboard",
        label: "Dashboard",
        icon: "dashboard"
      },
      {
        path: "/messages",
        label: "Messages",
        icon: "messages"
      },
      {
        path: "/private-files",
        label: "My Files",
        icon: "files"
      },
      {
        path: "/community-files",
        label: "Community Files",
        icon: "community"
      },
      {
        path: "/profile",
        label: "Profile",
        icon: "profile"
      }
    ];

    if (user?.role === "admin") {
      items.push({
        path: "/admin",
        label: "Admin Dashboard",
        icon: "admin"
      });
    }

    return items;
  }, [user]);

  const pageInfo = {
    "/dashboard": {
      title: "Dashboard",
      description: "Overview of your StudentHub activity"
    },
    "/messages": {
      title: "Messages",
      description: "Connect privately with your community"
    },
    "/private-files": {
      title: "My Files",
      description: "Manage your private documents and files"
    },
    "/community-files": {
      title: "Community Files",
      description: "Discover files shared with the community"
    },
    "/profile": {
      title: "Profile",
      description: "Manage your account and security"
    },
    "/admin": {
      title: "Admin Dashboard",
      description: "Manage your StudentHub community"
    }
  };

  const currentPage = pageInfo[location.pathname] || {
    title: "StudentHub",
    description: "Student Community & Education Portal"
  };

  const getInitials = () => {
    if (!user?.name) return "S";

    return user.name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("rememberMe");

    navigate("/login", {
      replace: true
    });
  };

  return (
    <div className="app-shell">
      {mobileOpen && (
        <button
          className="sidebar-overlay"
          onClick={() => setMobileOpen(false)}
          aria-label="Close navigation"
        />
      )}

      <aside className={`app-sidebar ${mobileOpen ? "mobile-open" : ""}`}>
        <div className="sidebar-brand">
          <div className="brand-logo">
            <span>SH</span>
          </div>

          <div className="brand-copy">
            <strong>StudentHub</strong>
            <span>Community Portal</span>
          </div>

          <button
            className="mobile-close-button"
            onClick={() => setMobileOpen(false)}
          >
            {icon("close", 19)}
          </button>
        </div>

        <div className="sidebar-user">
          <div className="avatar avatar-sidebar">
            {getInitials()}
          </div>

          <div className="sidebar-user-info">
            <strong>{user?.name || "Student"}</strong>
            <span>{user?.role === "admin" ? "Administrator" : "Student"}</span>
          </div>

          <span className="online-dot" />
        </div>

        <div className="sidebar-section-title">MAIN MENU</div>

        <nav className="sidebar-navigation">
          {navigation.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "active" : ""}`
              }
            >
              <span className="sidebar-link-icon">
                {icon(item.icon)}
              </span>

              <span>{item.label}</span>

              <span className="sidebar-link-arrow">
                {icon("chevron", 16)}
              </span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-spacer" />

        <div className="sidebar-help-card">
          <div className="help-icon">?</div>

          <div>
            <strong>Need help?</strong>
            <span>Contact your administrator</span>
          </div>
        </div>

        <button className="sidebar-logout" onClick={logout}>
          <span>{icon("logout")}</span>
          <span>Sign out</span>
        </button>
      </aside>

      <div className="main-area">
        <header className="topbar">
          <div className="topbar-left">
            <button
              className="mobile-menu-button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation"
            >
              {icon("menu")}
            </button>

            <div className="page-heading">
              <h1>{currentPage.title}</h1>
              <p>{currentPage.description}</p>
            </div>
          </div>

          <div className="topbar-right">
            <div className="topbar-search">
              <span>{icon("search", 18)}</span>
              <input placeholder="Search..." />
              <kbd>⌘ K</kbd>
            </div>

            <button className="notification-button" title="Notifications">
              {icon("bell", 19)}
              <span className="notification-dot" />
            </button>

            <button
              className="topbar-profile"
              onClick={() => navigate("/profile")}
            >
              <div className="avatar avatar-topbar">
                {getInitials()}
              </div>

              <div className="topbar-profile-info">
                <strong>{user?.name || "Student"}</strong>
                <span>
                  {user?.role === "admin" ? "Administrator" : "Student"}
                </span>
              </div>

              <span className="profile-chevron">
                {icon("chevron", 15)}
              </span>
            </button>
          </div>
        </header>

        <main className="page-container">
          <Outlet />
        </main>

        <footer className="app-footer">
          <span>© 2026 StudentHub</span>
          <span>Student Community & Education Portal</span>
        </footer>
      </div>
    </div>
  );
}

export default Layout;