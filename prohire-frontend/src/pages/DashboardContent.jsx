import { useState, useEffect } from "react";
import "../styles/dashboard.css";
import "../styles/DashboardContent.css";

const DashboardContent = () => {
  const [dashboardData, setDashboardData] = useState({
    stats: [],
    recommendedJobs: [],
    recentViewedJobs: [],
    loading: true,
    error: null,
    showAllRecommended: false,
    showAllViewed: false,
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const authToken = localStorage.getItem("token");

        const response = await fetch(
          "https://prohires.strangled.net/job/dashboard_data/",
          {
            headers: {
              Authorization: `Token ${authToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const apiResponse = await response.json();

        setDashboardData({
          stats: [
            {
              id: "jobs-applied",
              label: "Jobs Applied",
              value: 12,
              icon: "📝",
            },
            {
              id: "saved-jobs",
              label: "Saved Jobs",
              value: apiResponse.saved_jobs_count,
              icon: "💾",
            },
            {
              id: "jobs-viewed",
              label: "Jobs Viewed",
              value: apiResponse.viewed_jobs_count,
              icon: "👀",
            },
            {
              id: "active-alerts",
              label: "Active Alerts",
              value: 2,
              icon: "🔔",
            },
          ],
          recommendedJobs: apiResponse.recommended_jobs.map((job) => ({
            id: job.job_id,
            title: job.title,
            company: job.employer.name,
            location: job.location
              ? `${job.location.city}, ${job.location.state}`
              : "Remote",
            type: job.employment_type,
            posted: job.posted_at
              ? new Date(job.posted_at).toLocaleDateString()
              : "Recently",
            logo: job.employer.employer_logo || "🏢",
            isRemote: job.is_remote,
            applyLink: job.apply_option?.apply_link,
          })),
          recentViewedJobs: apiResponse.recent_viewed_jobs.map((job) => ({
            id: job.job_id,
            title: job.title,
            company: job.employer.name,
            location: job.location
              ? `${job.location.city}, ${job.location.state}`
              : "Remote",
            viewedDate: job.posted_at
              ? new Date(job.posted_at).toLocaleDateString()
              : "Recently",
            logo: job.employer.employer_logo || "🏢",
            applyLink: job.apply_option?.apply_link,
          })),
          loading: false,
          error: null,
        });
      } catch (err) {
        setDashboardData((prev) => ({
          ...prev,
          loading: false,
          error: err.message,
        }));
      }
    };

    fetchDashboardData();
  }, []);

  const handleJobAction = (action, jobId, applyLink) => {
    console.log(`${action} job with id: ${jobId}`);
    if (action === "apply" && applyLink) {
      window.open(applyLink, "_blank");
    }
  };

  const toggleShowMore = (section) => {
    setDashboardData((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  if (dashboardData.loading) {
    return (

        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading your dashboard...</p>
        </div>

    );
  }

  if (dashboardData.error) {
    return (
        <div className="error-state">
          <div className="error-icon">⚠️</div>
          <h3>Something went wrong</h3>
          <p>{dashboardData.error}</p>
          <button
            className="retry-btn"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
    );
  }

  const displayedRecommendedJobs = dashboardData.showAllRecommended
    ? dashboardData.recommendedJobs
    : dashboardData.recommendedJobs.slice(0, 3);

  const displayedViewedJobs = dashboardData.showAllViewed
    ? dashboardData.recentViewedJobs
    : dashboardData.recentViewedJobs.slice(0, 3);

  return (
    <div className="dashboard-container">
      {/* Stats Section */}
      <section className="stats-section">
        <div className="grid-container">
          {dashboardData.stats.map((stat) => (
            <div key={stat.id} className="stat-card">
              <div className="stat-icon">{stat.icon}</div>
              <h3 className="stat-value">{stat.value}</h3>
              <p className="stat-label">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Dual Columns Layout */}
      <div className="dual-columns">
        {/* Recommended Jobs Column */}
        <section className="jobs-column recommended-column">
          <div className="column-header">
            <h2>Recommended Jobs</h2>
            <p>Based on your profile and preferences</p>
          </div>
          <div className="jobs-list">
            {displayedRecommendedJobs.map((job) => (
              <div key={job.id} className="job-card">
                <div className="job-logo">
                  {job.logo.startsWith("/media") ? (
                    <img
                      src={`https://prohires.strangled.net${job.logo}`}
                      alt={job.company}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "https://prohires.strangled.net/media/employer_logo/default.png";
                      }}
                    />
                  ) : (
                    <div className="logo-placeholder">{job.logo}</div>
                  )}
                </div>
                <div className="job-info">
                  <h3 className="job-title">{job.title}</h3>
                  <p className="job-company">{job.company}</p>
                  <div className="job-meta">
                    <span>{job.location}</span>
                    <span>{job.type}</span>
                    {job.isRemote && <span>Remote</span>}
                  </div>
                  <p className="job-posted">Posted: {job.posted}</p>
                </div>
                <div className="job-actions">
                  <button
                    className="action-btn apply-btn primary-action"
                    onClick={() =>
                      handleJobAction("apply", job.id, job.applyLink)
                    }
                  >
                    Apply
                  </button>
                  <button
                    className="action-btn save-btn secondary-action"
                    onClick={() => handleJobAction("save", job.id)}
                  >
                    Save
                  </button>
                </div>
              </div>
            ))}
            {dashboardData.recommendedJobs.length > 3 && (
              <button
                className="show-more-link"
                onClick={() => toggleShowMore("showAllRecommended")}
              >
                {dashboardData.showAllRecommended
                  ? "Show Less"
                  : "Show More..."}
              </button>
            )}
          </div>
        </section>

        {/* Recently Viewed Column */}
        <section className="jobs-column viewed-column">
          <div className="column-header">
            <h2>Recently Viewed</h2>
            <p>Jobs you've recently checked out</p>
          </div>
          <div className="jobs-list">
            {displayedViewedJobs.map((job) => (
              <div key={job.id} className="job-card">
                <div className="job-logo">
                  {job.logo.startsWith("/media") ? (
                    <img
                      src={`https://prohires.strangled.net${job.logo}`}
                      alt={job.company}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "https://prohires.strangled.net/media/employer_logo/default.png";
                      }}
                    />
                  ) : (
                    <div className="logo-placeholder">{job.logo}</div>
                  )}
                </div>
                <div className="job-info">
                  <h3 className="job-title">{job.title}</h3>
                  <p className="job-company">{job.company}</p>
                  <p className="job-location">{job.location}</p>
                  <p className="job-date">Viewed: {job.viewedDate}</p>
                </div>
                <div className="job-actions">
                  <button
                    className="action-btn view-again-btn"
                    onClick={() =>
                      handleJobAction("view", job.id, job.applyLink)
                    }
                  >
                    View Again
                  </button>
                </div>
              </div>
            ))}
            {dashboardData.recentViewedJobs.length > 3 && (
              <button
                className="show-more-link"
                onClick={() => toggleShowMore("showAllViewed")}
              >
                {dashboardData.showAllViewed ? "Show Less" : "Show More..."}
              </button>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default DashboardContent;
