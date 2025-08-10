import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/dashboard.css";
import { FiMenu, FiLogOut, FiHome, FiBriefcase, FiSettings, FiUser, FiBell, FiMessageSquare, FiHelpCircle } from "react-icons/fi";

const Dashboard = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarWidth, setSidebarWidth] = useState(250);
  const sidebarRef = useRef(null);
  const [isResizing, setIsResizing] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      fetchJobs(token);
    }
  }, [navigate]);

  const fetchJobs = async (token) => {
    try {
      const response = await axios.get(
        "https://prohires.strangled.net/job/jobs",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setJobs(response.data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      setError("Failed to fetch jobs. Please try again later.");
      if (error.response && error.response.status === 401) {
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        await axios.post(
          "https://prohires.strangled.net/mainapp/user_logout/",
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  const startResizing = (e) => {
    setIsResizing(true);
    document.addEventListener('mousemove', resizeSidebar);
    document.addEventListener('mouseup', stopResizing);
  };

  const resizeSidebar = (e) => {
    if (isResizing) {
      const newWidth = e.clientX;
      if (newWidth > 150 && newWidth < 400) {
        setSidebarWidth(newWidth);
      }
    }
  };

  const stopResizing = () => {
    setIsResizing(false);
    document.removeEventListener('mousemove', resizeSidebar);
    document.removeEventListener('mouseup', stopResizing);
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
    <div 
      ref={sidebarRef}
      className={`sidebar ${sidebarOpen ? 'open' : 'minimized'}`}
      style={{ width: sidebarOpen ? `${sidebarWidth}px` : '60px' }}
    >
      <div className="sidebar-header">
        {sidebarOpen ? (
          <>
            <h2>ProHire</h2>
            <button 
              className="sidebar-toggle" 
              onClick={() => setSidebarOpen(false)}
            >
              <FiMenu />
            </button>
          </>
        ) : (
          <button 
            className="sidebar-toggle" 
            onClick={() => setSidebarOpen(true)}
            style={{ margin: "0 auto" }}
          >
            <FiMenu />
          </button>
        )}
      </div>
      
      <div className="sidebar-menu">
        <div className={`menu-item active ${!sidebarOpen ? "icon-only" : ""}`} title={!sidebarOpen ? "Dashboard" : ""}>
  <FiHome className="menu-icon" />
  {sidebarOpen && <span>Dashboard</span>}
</div>
<div className={`menu-item ${!sidebarOpen ? "icon-only" : ""}`} title={!sidebarOpen ? "Jobs" : ""}>
  <FiBriefcase className="menu-icon" />
  {sidebarOpen && <span>Jobs</span>}
</div>
<div className={`menu-item ${!sidebarOpen ? "icon-only" : ""}`} title={!sidebarOpen ? "Candidates" : ""}>
  <FiUser className="menu-icon" />
  {sidebarOpen && <span>Candidates</span>}
</div>
<div className={`menu-item ${!sidebarOpen ? "icon-only" : ""}`} title={!sidebarOpen ? "Messages" : ""}>
  <FiMessageSquare className="menu-icon" />
  {sidebarOpen && <span>Messages</span>}
</div>
<div className={`menu-item ${!sidebarOpen ? "icon-only" : ""}`} title={!sidebarOpen ? "Notifications" : ""}>
  <FiBell className="menu-icon" />
  {sidebarOpen && <span>Notifications</span>}
</div>
<div className={`menu-item ${!sidebarOpen ? "icon-only" : ""}`} title={!sidebarOpen ? "Settings" : ""}>
  <FiSettings className="menu-icon" />
  {sidebarOpen && <span>Settings</span>}
</div>
<div className={`menu-item ${!sidebarOpen ? "icon-only" : ""}`} title={!sidebarOpen ? "Help & Support" : ""}>
  <FiHelpCircle className="menu-icon" />
  {sidebarOpen && <span>Help & Support</span>}
</div>
      </div>

      <div className="sidebar-footer">
        <button onClick={handleLogout} className="logout-button">
          <FiLogOut className="menu-icon" />
          {sidebarOpen && <span>Logout</span>}
        </button>
      </div>

      {sidebarOpen && (
        <div 
          className="sidebar-resizer" 
          onMouseDown={startResizing}
        />
      )}
    </div>

      {/* Main Content */}
      <div 
        className="main-content" 
        style={{ marginLeft: sidebarOpen ? `${sidebarWidth}px` : '60px' }}
      >
        <div className="dashboard-header">
          <button 
            className="mobile-sidebar-toggle" 
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <FiMenu />
          </button>
          <h1>Dashboard</h1>
          <div className="user-profile">
            <div className="user-avatar">PH</div>
          </div>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <div className="dashboard-content">
          {loading ? (
            <div className="loading-spinner">
              <div className="spinner"></div>
              <p>Loading jobs...</p>
            </div>
          ) : jobs.length === 0 ? (
            <div className="empty-state">
              <h3>No jobs found</h3>
              <p>There are currently no jobs available. Please check back later.</p>
            </div>
          ) : (
            <div className="jobs-list">
              {jobs.map((job) => (
                <div key={job.job_id} className="job-card">
                  <div className="job-header">
                    <h3>{job.title}</h3>
                    <span className="job-type">{job.employment_type || 'Full-time'}</span>
                  </div>
                  <p className="job-description">{job.description?.slice(0, 150)}...</p>
                  <div className="job-details">
                    <div className="detail-item">
                      <span className="detail-label">Company:</span>
                      <span className="detail-value">{job.employer?.name}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Location:</span>
                      <span className="detail-value">
                        {job.location ? `${job.location.city}, ${job.location.country}` : "Remote"}
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Posted:</span>
                      <span className="detail-value">
                        {new Date(job.posted_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  {job.google_link && (
                    <a 
                      href={job.google_link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="job-link"
                    >
                      View on Google
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;