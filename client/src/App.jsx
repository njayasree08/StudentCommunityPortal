import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Messages from "./pages/Messages";
import PrivateFiles from "./pages/PrivateFiles";
import CommunityFiles from "./pages/CommunityFiles";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";

import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* ================================
            PUBLIC ROUTES
        ================================= */}

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />


        {/* ================================
            PROTECTED ROUTES
        ================================= */}

        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >

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

        </Route>


        {/* ================================
            ADMIN ROUTE
        ================================= */}

        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <Layout />
            </ProtectedRoute>
          }
        >

          <Route
            index
            element={<AdminDashboard />}
          />

        </Route>


        {/* ================================
            DEFAULT
        ================================= */}

        <Route
          path="/"
          element={
            <Navigate
              to="/dashboard"
              replace
            />
          }
        />

        <Route
          path="*"
          element={
            <Navigate
              to="/dashboard"
              replace
            />
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;