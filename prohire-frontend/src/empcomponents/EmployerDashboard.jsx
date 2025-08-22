import "../EmployerPortalStyles/EmployerDashboard.css";
import React, { useState, useEffect } from "react";
import EmployerHeader from "./EmployerHeader";

import EmployerSidebar from "./EmployerSidebar";
// import "./EmployerDashboard.css";

const EmployerDashboard = ({ children }) => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const getAuthToken = () => {
    // Check multiple storage locations for auth token
    return (
      localStorage.getItem("employer_access_token") ||
      sessionStorage.getItem("employer_access_token") ||
      document.cookie
        .split("; ")
        .find((row) => row.startsWith("employer_token="))
        ?.split("=")[1]
    );
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = getAuthToken();
      const headers = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers["Authorization"] = `Token ${token}`;
      }

      // Add timestamp to prevent caching
      const response = await fetch(
        `https://prohires.strangled.net/employer/employer_config/?t=${Date.now()}`,
        {
          method: "GET",
          headers: headers,
          credentials: "include",
        }
      );

      if (response.status === 401) {
        throw new Error(
          "Authentication required. Please log in to access the employer dashboard."
        );
      }

      if (response.status === 403) {
        throw new Error(
          "Access forbidden. You do not have permission to access employer resources."
        );
      }

      if (!response.ok) {
        throw new Error(`Server error! Status: ${response.status}`);
      }

      const result = await response.json();
      setDashboardData(result);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching employer dashboard data:", err);

      // Use mock data for development
      if (process.env.NODE_ENV === "development") {
        const mockData = {
          header: {
            title: "Employer Dashboard",
            logo: "https://via.placeholder.com/40x40/2c3e50/ffffff?text=E",
            buttons: [
              {
                label: "Logout",
                icon: "FaSignOutAlt",
                action: "/employer/logout",
              },
              {
                label: "Settings",
                icon: "FaCog",
                action: "/employer/settings",
              },
            ],
          },
          sidebar: [
            {
              title: "Dashboard",
              icon: "FaHome",
              path: "/employer/dashboard",
              order: 1,
            },
            {
              title: "Post Job",
              icon: "FaBriefcase",
              path: "/employer/jobs/post",
              order: 2,
            },
            {
              title: "Post Internship",
              icon: "FaGraduationCap",
              path: "/employer/internships/post",
              order: 3,
            },
            {
              title: "Manage Jobs",
              icon: "FaTasks",
              path: "/employer/jobs",
              order: 4,
            },
            {
              title: "Applications",
              icon: "FaFileAlt",
              path: "/employer/applications",
              order: 5,
            },
            {
              title: "Company Profile",
              icon: "FaBuilding",
              path: "/employer/profile",
              order: 6,
            },
          ],
        };
        setDashboardData(mockData);
        setError(null);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [retryCount]);

  const handleRetry = () => {
    setRetryCount((prev) => prev + 1);
  };

  const handleLoginRedirect = () => {
    window.location.href = "/employer/login";
  };

  if (loading) {
    return (
      <div className="employer-dashboard-loading">
        <div className="employer-loading-spinner"></div>
        <p>Loading Employer Dashboard...</p>
        <small>Please wait while we load your employer resources</small>
      </div>
    );
  }

  if (error && !dashboardData) {
    const isAuthError =
      error.includes("Authentication") ||
      error.includes("401") ||
      error.includes("403");

    return (
      <div className="employer-dashboard-error">
        <div className="employer-error-icon">🔒</div>
        <h3>
          {isAuthError
            ? "Employer Access Required"
            : "Dashboard Loading Failed"}
        </h3>
        <p>{error}</p>
        <div className="employer-error-actions">
          {isAuthError ? (
            <button
              onClick={handleLoginRedirect}
              className="employer-login-button"
            >
              Go to Employer Login
            </button>
          ) : (
            <button onClick={handleRetry} className="employer-retry-button">
              Try Again
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="employer-dashboard">
      <EmployerHeader headerData={dashboardData?.header} />
      <div className="employer-dashboard-content">
        <EmployerSidebar sidebarData={dashboardData?.sidebar} />
        <main className="employer-main-content">
          {children || (
            <div className="employer-welcome-section">
              <div className="employer-welcome-card">
                <h1>Welcome to Your Employer Dashboard</h1>
                <p>
                  Manage your job postings, review applications, and grow your
                  team with ProHires.
                </p>
                <div className="employer-welcome-stats">
                  <div className="stat-card">
                    <h3>0</h3>
                    <p>Active Jobs</p>
                  </div>
                  <div className="stat-card">
                    <h3>0</h3>
                    <p>Applications</p>
                  </div>
                  <div className="stat-card">
                    <h3>0</h3>
                    <p>Interviews</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default EmployerDashboard;
