import {
  Link
} from "react-router-dom";

function AdminDashboard() {

  const user =
    JSON.parse(
      localStorage.getItem("user") ||
      "null"
    );

  return (

    <div className="page-container">

      <div className="dashboard-hero admin-hero">

        <div>

          <p className="eyebrow">
            ADMINISTRATION
          </p>

          <h1>
            Admin Dashboard
          </h1>

          <p>
            Welcome,{" "}
            {user?.name}.
            Manage communication,
            files and community activity.
          </p>

        </div>

        <div className="hero-icon">
          🛡️
        </div>

      </div>


      <div className="section-heading">

        <div>

          <h2>
            Admin Actions
          </h2>

          <p>
            All available management tools.
          </p>

        </div>

      </div>


      <div className="dashboard-grid">


        <Link
          to="/messages"
          className="dashboard-card"
        >

          <div className="dashboard-card-icon">
            📢
          </div>

          <h3>
            Community Messages
          </h3>

          <p>
            Send messages to individual
            users or the entire community.
          </p>

          <span className="card-action">
            Open Messages →
          </span>

        </Link>


        <Link
          to="/private-files"
          className="dashboard-card"
        >

          <div className="dashboard-card-icon">
            🔐
          </div>

          <h3>
            My Private Files
          </h3>

          <p>
            Upload, read and manage your
            own private files.
          </p>

          <span className="card-action">
            Manage Files →
          </span>

        </Link>


        <Link
          to="/community-files"
          className="dashboard-card"
        >

          <div className="dashboard-card-icon">
            📚
          </div>

          <h3>
            Community Resources
          </h3>

          <p>
            Share and manage useful files
            for community members.
          </p>

          <span className="card-action">
            Manage Resources →
          </span>

        </Link>


        <Link
          to="/profile"
          className="dashboard-card"
        >

          <div className="dashboard-card-icon">
            👤
          </div>

          <h3>
            Admin Profile
          </h3>

          <p>
            View and update your administrator
            account information.
          </p>

          <span className="card-action">
            Open Profile →
          </span>

        </Link>

      </div>

    </div>
  );
}

export default AdminDashboard;