import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
        "http://127.0.0.1:8000//job/jobs",
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
        // Call logout endpoint
        await axios.post(
          "http://127.0.0.1:8000/mainapp/user_logout/",
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
      // Clear token and redirect regardless of API success
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      {loading ? (
        <p>Loading jobs...</p>
      ) : jobs.length === 0 ? (
        <p>No jobs found.</p>
      ) : (
        <div className="jobs-list">
          {jobs.map((job) => (
            <div key={job.job_id} className="job-card">
              <h3>{job.title}</h3>
              <p>{job.description?.slice(0, 150)}...</p>
              <p>
                <strong>Company:</strong> {job.employer?.name}
              </p>
              <p>
                <strong>Location:</strong>{" "}
                {job.location
                  ? `${job.location.city}, ${job.location.country}`
                  : "Remote"}
              </p>
              {job.google_link && (
                <a href={job.google_link} target="_blank" rel="noopener noreferrer">
                  View on Google
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;