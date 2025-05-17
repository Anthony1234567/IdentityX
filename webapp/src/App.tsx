// src/App.tsx
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import Dashboard from "@/pages/Dashboard";
import Account from "@/pages/Account";
import Settings from "@/pages/Settings";
import Layout from "@/components/Layout";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("authenticated") === "true"
  );

  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(localStorage.getItem("authenticated") === "true");
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />
          }
        />
        <Route
          path="/login"
          element={<Login onAuth={() => setIsAuthenticated(true)} />}
        />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/dashboard"
          element={
            isAuthenticated ? (
              <Layout>
                <Dashboard />
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/account"
          element={
            isAuthenticated ? (
              <Layout>
                <Account />
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/settings"
          element={
            isAuthenticated ? (
              <Layout>
                <Settings />
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="*"
          element={
            <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />
          }
        />
      </Routes>
    </Router>
  );
}
