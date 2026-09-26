import {
  Menu,
  Bell,
  Search
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

const Navbar = ({ openMobile }) => {
  const { user } = useAuth();

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button
          className="mobile-menu-button"
          onClick={openMobile}
        >
          <Menu size={22} />
        </button>

        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search portal..."
          />
        </div>
      </div>

      <div className="topbar-right">
        <button className="icon-button">
          <Bell size={20} />
          <span className="notification-dot"></span>
        </button>

        <div className="topbar-user">
          <div className="topbar-avatar">
            {user?.name?.charAt(0).toUpperCase()}
          </div>

          <div className="topbar-user-text">
            <strong>{user?.name}</strong>
            <span>
              {user?.role === "admin"
                ? "Administrator"
                : "Student"}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;