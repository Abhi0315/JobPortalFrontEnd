import { useState, useEffect } from "react";
import DashboardSidebarHeader from "./dashboard";
import "../styles/dashboard.css";
import "../styles/DashboardContent.css";

const DashboardContent = () => {
  const [dashboardData, setDashboardData] = useState({
    stats: [],
    recommendedJobs: [],
    recentlyViewed: [],
    loading: true,
    error: null,
    showAllRecommended: false,
    showAllViewed: false,
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setTimeout(() => {
          setDashboardData({
            stats: [
              {
                id: "jobs-applied",
                label: "Jobs Applied",
                value: 12,
                icon: "📝",
              },
              { id: "saved-jobs", label: "Saved Jobs", value: 5, icon: "💾" },
              {
                id: "jobs-viewed",
                label: "Jobs Viewed",
                value: 34,
                icon: "👀",
              },
              {
                id: "active-alerts",
                label: "Active Alerts",
                value: 2,
                icon: "🔔",
              },
            ],
            recommendedJobs: [
              {
                id: "job-1",
                title: "Senior Frontend Developer",
                company: "TechCorp Inc.",
                location: "Remote",
                type: "Full-Time",
                salary: "$120,000 - $160,000",
                posted: "2 days ago",
                logo: "💻",
              },
              {
                id: "job-2",
                title: "UX Designer",
                company: "Creative Solutions",
                location: "New York, NY",
                type: "Contract",
                salary: "$80 - $100/hr",
                posted: "1 week ago",
                logo: "🎨",
              },
              {
                id: "job-3",
                title: "Product Manager",
                company: "Innovate Labs",
                location: "San Francisco, CA",
                type: "Full-Time",
                salary: "$130,000 - $160,000",
                posted: "3 days ago",
                logo: "📊",
              },
              {
                id: "job-4",
                title: "Data Scientist",
                company: "Analytics Pro",
                location: "Boston, MA",
                type: "Full-Time",
                salary: "$110,000 - $140,000",
                posted: "5 days ago",
                logo: "🔍",
              },
            ],
            recentlyViewed: [
              {
                id: "viewed-1",
                title: "Marketing Director",
                company: "Growth Partners",
                viewedDate: "2023-05-16",
                logo: "📈",
              },
              {
                id: "viewed-2",
                title: "Data Scientist",
                company: "Analytics Pro",
                viewedDate: "2023-05-14",
                logo: "🔍",
              },
              {
                id: "viewed-3",
                title: "HR Manager",
                company: "PeopleFirst",
                viewedDate: "2023-05-12",
                logo: "👥",
              },
              {
                id: "viewed-4",
                title: "Backend Engineer",
                company: "DataSystems",
                viewedDate: "2023-05-10",
                logo: "⚙️",
              },
            ],
            loading: false,
            error: null,
            showAllRecommended: false,
            showAllViewed: false,
          });
        }, 800);
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

  const handleJobAction = (action, jobId) => {
    console.log(`${action} job with id: ${jobId}`);
  };

  const toggleShowMore = (section) => {
    setDashboardData((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  if (dashboardData.loading) {
    return (
      <DashboardSidebarHeader>
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading your dashboard...</p>
        </div>
      </DashboardSidebarHeader>
    );
  }

  if (dashboardData.error) {
    return (
      <DashboardSidebarHeader>
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
      </DashboardSidebarHeader>
    );
  }

  const displayedRecommendedJobs = dashboardData.showAllRecommended
    ? dashboardData.recommendedJobs
    : dashboardData.recommendedJobs.slice(0, 3);

  const displayedViewedJobs = dashboardData.showAllViewed
    ? dashboardData.recentlyViewed
    : dashboardData.recentlyViewed.slice(0, 3);

  return (
    <div className="dashboard-container">
      {/* Welcome Header */}
      {/* <header className="dashboard-header">
        <h1>Welcome Back!</h1>
        <p>Here's what's happening with your job search today</p>
      </header> */}

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
                <div className="job-logo">{job.logo}</div>
                <div className="job-info">
                  <h3 className="job-title">{job.title}</h3>
                  <p className="job-company">{job.company}</p>
                  <div className="job-meta">
                    <span>{job.location}</span>
                    <span>{job.type}</span>
                    <span>{job.salary}</span>
                  </div>
                  <p className="job-posted">Posted: {job.posted}</p>
                </div>
                <div className="job-actions">
                  <button
                    className="action-btn apply-btn primary-action"
                    onClick={() => handleJobAction("apply", job.id)}
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
                <div className="job-logo">{job.logo}</div>
                <div className="job-info">
                  <h3 className="job-title">{job.title}</h3>
                  <p className="job-company">{job.company}</p>
                  <p className="job-date">Viewed: {job.viewedDate}</p>
                </div>
                <button
                  className="view-again-btn"
                  onClick={() => handleJobAction("view", job.id)}
                >
                  View Again
                </button>
              </div>
            ))}
            {dashboardData.recentlyViewed.length > 3 && (
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
