import { Navigate } from "react-router-dom";

function ProtectedRoute({
  children,
  role
}) {

  const token =
    localStorage.getItem("token");

  const user =
    JSON.parse(
      localStorage.getItem("user") ||
      "null"
    );

  // Not logged in
  if (!token || !user) {

    return (
      <Navigate
        to="/login"
        replace
      />
    );

  }

  // Admin-only route
  if (
    role &&
    user.role !== role
  ) {

    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );

  }

  return children;
}

export default ProtectedRoute;