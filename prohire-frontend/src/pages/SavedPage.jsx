import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/SavedPage.css";

function SavedPage() {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSavedJobs = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No token found. Please log in.");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          "https://prohires.strangled.net/job/saved_jobs/",
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );

        if (response.data && Array.isArray(response.data.saved_jobs)) {
          setSavedJobs(response.data.saved_jobs);
        } else {
          setError("Unexpected response format");
        }
      } catch (err) {
        console.error("Error fetching saved jobs:", err);
        setError("Failed to fetch saved jobs. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchSavedJobs();
  }, []);

  const handleUnsaveJob = async (jobId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No token found. Please log in.");
        return;
      }

      // First try DELETE method (more RESTful)
      try {
        await axios.delete(
          `https://prohires.strangled.net/job/unsave_job/${jobId}/`,
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );
      } catch (deleteError) {
        // If DELETE fails with 405, try POST
        if (deleteError.response?.status === 405) {
          await axios.post(
            `https://prohires.strangled.net/job/unsave_job/${jobId}/`,
            {},
            {
              headers: {
                Authorization: `Token ${token}`,
              },
            }
          );
        } else {
          throw deleteError;
        }
      }

      // Update the UI by removing the unsaved job
      setSavedJobs((prevJobs) =>
        prevJobs.filter((job) => job.job_id !== jobId)
      );
    } catch (err) {
      console.error("Error unsaving job:", err);
      setError(
        err.response?.data?.message ||
          "Failed to unsave job. Please try again later."
      );
    }
  };

  const formatLocation = (location) => {
    if (!location) return "Location not specified";
    const { city, state, country } = location;
    return [city, state, country].filter(Boolean).join(", ");
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Date not specified";
    return new Date(dateString).toLocaleDateString();
  };

  const getLogoUrl = (logoPath) => {
    if (!logoPath) return null;
    return logoPath.startsWith("/media/")
      ? `https://prohires.strangled.net${logoPath}`
      : logoPath;
  };

  if (loading) {
    return (
      <div className="saved-container">
        <div className="loading-spinner"></div>
        <p className="loading">Loading saved jobs...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="saved-container">
        <p className="error">{error}</p>
        <button
          className="retry-btn"
          onClick={() => {
            setError(null);
            setLoading(true);
            fetchSavedJobs();
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="saved-container">
      <h1 className="saved-title">Saved Jobs</h1>

      {savedJobs.length === 0 ? (
        <p className="no-jobs">No saved jobs found.</p>
      ) : (
        <div className="jobs-grid">
          {savedJobs.map((job) => {
            const logoUrl = getLogoUrl(job.employer?.employer_logo);
            return (
              <div className="job-card" key={job.job_id}>
                <h2 className="job-title">{job.title}</h2>

                {job.employer && (
                  <div className="employer-info">
                    {logoUrl && (
                      <img
                        src={logoUrl}
                        alt={`${job.employer.name} logo`}
                        className="employer-logo"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            "https://via.placeholder.com/50?text=Logo";
                        }}
                      />
                    )}
                    <p className="company">{job.employer.name}</p>
                  </div>
                )}

                <div className="job-meta">
                  {job.employment_type && (
                    <span className="employment-type">
                      {job.employment_type}
                    </span>
                  )}
                  <p className="location">{formatLocation(job.location)}</p>
                  <p className="posted-date">
                    Posted: {formatDate(job.posted_at)}
                  </p>
                </div>

                <div className="job-actions">
                  {job.apply_option?.apply_link && (
                    <a
                      href={job.apply_option.apply_link}
                      className="apply-btn"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Apply Now
                    </a>
                  )}
                  <button
                    className="unsave-btn"
                    onClick={() => handleUnsaveJob(job.job_id)}
                  >
                    Unsave
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default SavedPage;
