import {
  LayoutDashboard,
  User,
  MessageCircle,
  Megaphone,
  FolderLock,
  Users,
  ShieldCheck,
  LogOut,
  GraduationCap,
  X
} from "lucide-react";

import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Sidebar = ({ mobileOpen, closeMobile }) => {
  const { user, logout } = useAuth();

  const studentLinks = [
    {
      label: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard
    },
    {
      label: "Profile",
      path: "/profile",
      icon: User
    },
    {
      label: "Messages",
      path: "/messages",
      icon: MessageCircle
    },
    {
      label: "Announcements",
      path: "/announcements",
      icon: Megaphone
    },
    {
      label: "Private Files",
      path: "/private-files",
      icon: FolderLock
    },
    {
      label: "Community Files",
      path: "/community-files",
      icon: Users
    }
  ];

  return (
    <>
      {mobileOpen && (
        <div
          className="sidebar-overlay"
          onClick={closeMobile}
        />
      )}

      <aside
        className={`sidebar ${
          mobileOpen ? "sidebar-mobile-open" : ""
        }`}
      >
        <div className="sidebar-header">
          <div className="brand">
            <div className="brand-icon">
              <GraduationCap size={23} />
            </div>

            <div>
              <h2>StudentHub</h2>
              <span>Community Portal</span>
            </div>
          </div>

          <button
            className="mobile-close"
            onClick={closeMobile}
          >
            <X size={21} />
          </button>
        </div>

        <div className="sidebar-user">
          <div className="avatar">
            {user?.name?.charAt(0).toUpperCase()}
          </div>

          <div className="sidebar-user-info">
            <strong>{user?.name}</strong>
            <span>
              {user?.role === "admin"
                ? "Administrator"
                : "Student"}
            </span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <p className="nav-section-title">
            MAIN MENU
          </p>

          {studentLinks.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={closeMobile}
                className={({ isActive }) =>
                  `nav-link ${
                    isActive ? "active" : ""
                  }`
                }
              >
                <Icon size={19} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}

          {user?.role === "admin" && (
            <>
              <p className="nav-section-title admin-title">
                ADMINISTRATION
              </p>

              <NavLink
                to="/admin"
                onClick={closeMobile}
                className={({ isActive }) =>
                  `nav-link ${
                    isActive ? "active" : ""
                  }`
                }
              >
                <ShieldCheck size={19} />
                <span>Admin Dashboard</span>
              </NavLink>
            </>
          )}
        </nav>

        <div className="sidebar-bottom">
          <button
            className="logout-button"
            onClick={logout}
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;