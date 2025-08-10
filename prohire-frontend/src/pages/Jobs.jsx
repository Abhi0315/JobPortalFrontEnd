import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/jobs.css";
import { FiMenu, FiLogOut, FiHome, FiBriefcase, FiSettings, FiUser, FiBell, FiMessageSquare, FiHelpCircle } from "react-icons/fi";
import Sidebar from "../components/Sidebar";
import Mainheader from "../components/Mainheader";

const Jobs = () => {
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
            Authorization: `Token ${token}`,
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
              Authorization: `Token ${token}`,
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
    <div className="jobs-container">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen} 
        sidebarWidth={sidebarWidth}
        sidebarRef={sidebarRef}
        startResizing={startResizing}
        handleLogout={handleLogout}
      />

      {/* Main Content */}
      <div 
        className="main-content" 
        style={{ marginLeft: sidebarOpen ? `${sidebarWidth}px` : '60px' }}
      >
          <Mainheader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        
        {error && <div className="error-message">{error}</div>}
        
        <div className="jobs-content">
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

export default Jobs;