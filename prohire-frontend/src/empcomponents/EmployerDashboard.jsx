// import "../EmployerPortalStyles/EmployerDashboard.css";
// import React, { useState, useEffect } from "react";
// import EmployerHeader from "./EmployerHeader";
// import EmployerSidebar from "./EmployerSidebar";

// const EmployerDashboard = ({ children }) => {
//   const [dashboardData, setDashboardData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [hasAttemptedFetch, setHasAttemptedFetch] = useState(false);

//   // Mock data for development
//   const mockData = {
//     header: {
//       title: "Employer Dashboard",
//       logo: "/employer-logo.png",
//       buttons: [
//         {
//           label: "Logout",
//           icon: "FaSignOutAlt",
//           action: "/employer/logout",
//         },
//         {
//           label: "Settings",
//           icon: "FaCog",
//           action: "/employer/settings",
//         },
//       ],
//     },
//     sidebar: [
//       {
//         title: "Dashboard",
//         icon: "FaHome",
//         path: "/employer/dashboard",
//         order: 1,
//       },
//       {
//         title: "Post Job",
//         icon: "FaBriefcase",
//         path: "/employer/jobs/post",
//         order: 2,
//       },
//       {
//         title: "Post Internship",
//         icon: "FaGraduationCap",
//         path: "/employer/internships/post",
//         order: 3,
//       },
//       {
//         title: "Manage Jobs",
//         icon: "FaTasks",
//         path: "/employer/jobs",
//         order: 4,
//       },
//       {
//         title: "Applications",
//         icon: "FaFileAlt",
//         path: "/employer/applications",
//         order: 5,
//       },
//       {
//         title: "Company Profile",
//         icon: "FaBuilding",
//         path: "/employer/profile",
//         order: 6,
//       },
//     ],
//   };

//   const getAuthToken = () => {
//     return (
//       localStorage.getItem("employer_access_token") ||
//       sessionStorage.getItem("employer_access_token")
//     );
//   };

//   const fetchDashboardData = async () => {
//     // Prevent multiple attempts
//     if (hasAttemptedFetch) return;

//     try {
//       setLoading(true);
//       setError(null);
//       setHasAttemptedFetch(true);

//       const token = getAuthToken();
//       const headers = {
//         "Content-Type": "application/json",
//       };

//       if (token) {
//         headers["Authorization"] = `Token ${token}`;
//       }

//       const response = await fetch(
//         "https://prohires.strangled.net/job/dashboard_data/",
//         {
//           headers: {
//             Authorization: `Token ${authToken}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       if (response.status === 401) {
//         console.log("Authentication failed, using mock data");
//         setDashboardData(mockData);
//         return;
//       }

//       if (response.status === 403) {
//         console.log("Access forbidden, using mock data");
//         setDashboardData(mockData);
//         return;
//       }

//       if (!response.ok) {
//         throw new Error(`Server error! Status: ${response.status}`);
//       }

//       const result = await response.json();
//       setDashboardData(result);
//     } catch (err) {
//       console.log("API fetch failed, using mock data:", err.message);
//       setDashboardData(mockData);
//       setError(null); // Don't show error since we have mock data
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchDashboardData();
//   }, []); // Empty dependency array - fetch only once

//   const handleRetry = () => {
//     setHasAttemptedFetch(false);
//     fetchDashboardData();
//   };

//   const handleLoginRedirect = () => {
//     window.location.href = "/employer/login";
//   };

//   if (loading) {
//     return (
//       <div className="employer-dashboard-loading">
//         <div className="employer-loading-spinner"></div>
//         <p>Loading Employer Dashboard...</p>
//       </div>
//     );
//   }

//   if (error && !dashboardData) {
//     const isAuthError =
//       error.includes("Authentication") ||
//       error.includes("401") ||
//       error.includes("403");

//     return (
//       <div className="employer-dashboard-error">
//         <div className="employer-error-icon">🔒</div>
//         <h3>
//           {isAuthError
//             ? "Employer Access Required"
//             : "Dashboard Loading Failed"}
//         </h3>
//         <p>{error}</p>
//         <div className="employer-error-actions">
//           {isAuthError ? (
//             <button
//               onClick={handleLoginRedirect}
//               className="employer-login-button"
//             >
//               Go to Employer Login
//             </button>
//           ) : (
//             <button onClick={handleRetry} className="employer-retry-button">
//               Try Again
//             </button>
//           )}
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="employer-dashboard">
//       <EmployerHeader headerData={dashboardData?.header} />
//       <div className="employer-dashboard-content">
//         <EmployerSidebar sidebarData={dashboardData?.sidebar} />
//         <main className="employer-main-content">
//           {children || (
//             <div className="employer-welcome-section">
//               <div className="employer-welcome-card">
//                 <h1>Welcome to Your Employer Dashboard</h1>
//                 <p>
//                   Manage your job postings, review applications, and grow your
//                   team with ProHires.
//                 </p>
//                 <div className="employer-welcome-stats">
//                   <div className="stat-card">
//                     <h3>0</h3>
//                     <p>Active Jobs</p>
//                   </div>
//                   <div className="stat-card">
//                     <h3>0</h3>
//                     <p>Applications</p>
//                   </div>
//                   <div className="stat-card">
//                     <h3>0</h3>
//                     <p>Interviews</p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}
//         </main>
//       </div>
//     </div>
//   );
// };

// export default EmployerDashboard;
import "../EmployerPortalStyles/EmployerDashboard.css";
import React, { useState, useEffect } from "react";
import EmployerHeader from "./EmployerHeader";
import EmployerSidebar from "./EmployerSidebar";

const EmployerDashboard = ({ children }) => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasAttemptedFetch, setHasAttemptedFetch] = useState(false);

  // Mock data for development
  const mockData = {
    header: {
      title: "Employer Dashboard",
      logo: "/employer-logo.png", // Local fallback logo
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

  const getAuthToken = () => {
    return (
      localStorage.getItem("employer_access_token") ||
      sessionStorage.getItem("employer_access_token")
    );
  };

  const fetchDashboardData = async () => {
    if (hasAttemptedFetch) return;

    try {
      setLoading(true);
      setError(null);
      setHasAttemptedFetch(true);

      const token = getAuthToken();
      const headers = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers["Authorization"] = `Token ${token}`;
      }

      const response = await fetch(
        "https://prohires.strangled.net/employer/employer_config/",
        {
          method: "GET",
          headers: headers,
          credentials: "include",
        }
      );

      if (response.status === 401 || response.status === 403) {
        console.log("Authentication failed, using mock data");
        setDashboardData(mockData);
        return;
      }

      if (!response.ok) {
        throw new Error(`Server error! Status: ${response.status}`);
      }

      const result = await response.json();
      setDashboardData(result);
    } catch (err) {
      console.log("API fetch failed, using mock data:", err.message);
      setDashboardData(mockData);
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleRetry = () => {
    setHasAttemptedFetch(false);
    fetchDashboardData();
  };

  const handleLoginRedirect = () => {
    window.location.href = "/employer/login";
  };

  if (loading) {
    return (
      <div className="employer-dashboard-loading">
        <div className="employer-loading-spinner"></div>
        <p>Loading Employer Dashboard...</p>
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
