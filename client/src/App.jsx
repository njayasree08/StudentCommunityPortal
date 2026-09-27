import React from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes
} from "react-router-dom";

import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Messages from "./pages/Messages";
import PrivateFiles from "./pages/PrivateFiles";
import CommunityFiles from "./pages/CommunityFiles";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            <Route
              path="/dashboard"
              element={<Dashboard />}
            />

            <Route
              path="/messages"
              element={<Messages />}
            />

            <Route
              path="/private-files"
              element={<PrivateFiles />}
            />

            <Route
              path="/community-files"
              element={<CommunityFiles />}
            />

            <Route
              path="/profile"
              element={<Profile />}
            />

            <Route element={<ProtectedRoute adminOnly />}>
              <Route
                path="/admin"
                element={<AdminDashboard />}
              />
            </Route>
          </Route>
        </Route>

        <Route
          path="*"
          element={<Navigate to="/dashboard" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;