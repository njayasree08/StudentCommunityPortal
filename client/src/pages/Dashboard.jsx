import {
  Link
} from "react-router-dom";

function Dashboard() {

  const user =
    JSON.parse(
      localStorage.getItem("user") ||
      "null"
    );

  return (

    <div className="page-container">

      {/* HEADER */}

      <div className="dashboard-hero">

        <div>

          <p className="eyebrow">
            STUDENT COMMUNITY
          </p>

          <h1>
            Welcome back,{" "}
            {user?.name || "Student"} 👋
          </h1>

          <p>
            Stay connected, communicate
            with your community and manage
            your learning resources.
          </p>

        </div>

        <div className="hero-icon">
          🎓
        </div>

      </div>


      {/* QUICK ACTIONS */}

      <div className="section-heading">

        <div>

          <h2>
            Quick Actions
          </h2>

          <p>
            Everything you need in one place.
          </p>

        </div>

      </div>


      <div className="dashboard-grid">


        {/* MESSAGES */}

        <Link
          to="/messages"
          className="dashboard-card"
        >

          <div className="dashboard-card-icon">
            💬
          </div>

          <h3>
            Messages
          </h3>

          <p>
            Send private messages to
            community members or yourself.
          </p>

          <span className="card-action">
            Open Messages →
          </span>

        </Link>


        {/* PRIVATE FILES */}

        <Link
          to="/private-files"
          className="dashboard-card"
        >

          <div className="dashboard-card-icon">
            📁
          </div>

          <h3>
            My Files
          </h3>

          <p>
            Upload your personal files
            and open or read them anytime.
          </p>

          <span className="card-action">
            Open My Files →
          </span>

        </Link>


        {/* COMMUNITY FILES */}

        <Link
          to="/community-files"
          className="dashboard-card"
        >

          <div className="dashboard-card-icon">
            🌐
          </div>

          <h3>
            Community Files
          </h3>

          <p>
            Share and access useful files
            with other community members.
          </p>

          <span className="card-action">
            Explore Files →
          </span>

        </Link>


        {/* PROFILE */}

        <Link
          to="/profile"
          className="dashboard-card"
        >

          <div className="dashboard-card-icon">
            👤
          </div>

          <h3>
            My Profile
          </h3>

          <p>
            View and update your
            account information.
          </p>

          <span className="card-action">
            View Profile →
          </span>

        </Link>

      </div>


      {/* HOW IT WORKS */}

      <div className="info-panel">

        <div className="info-panel-icon">
          💡
        </div>

        <div>

          <h3>
            Your community space
          </h3>

          <p>
            Use Messages to communicate,
            My Files to manage your private
            resources, and Community Files
            to share useful materials with
            other students.
          </p>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;