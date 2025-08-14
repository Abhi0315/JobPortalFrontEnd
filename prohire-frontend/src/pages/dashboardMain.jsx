import { FiBell, FiBookmark, FiBriefcase, FiEye } from "react-icons/fi";
import "../styles/dashboardMain.css";

const Dashboard = () => {
  // Sample data - replace with real data from your API
  const recommendedJobs = [
    {
      id: 1,
      title: "Senior Frontend Developer",
      company: "TechCorp Inc.",
      location: "Remote",
      type: "Full-Time",
      salary: "$120,000 - $150,000",
      posted: "2 days ago",
    },
    {
      id: 2,
      title: "UX Designer",
      company: "Creative Solutions",
      location: "New York, NY",
      type: "Contract",
      salary: "$80 - $100/hr",
      posted: "1 week ago",
    },
    {
      id: 3,
      title: "Product Manager",
      company: "Innovate Labs",
      location: "San Francisco, CA",
      type: "Full-Time",
      salary: "$130,000 - $160,000",
      posted: "3 days ago",
    },
  ];

  const savedJobs = [
    {
      id: 101,
      title: "Backend Engineer",
      company: "DataSystems",
      savedDate: "2023-05-15",
    },
    {
      id: 102,
      title: "DevOps Specialist",
      company: "CloudNine",
      savedDate: "2023-05-10",
    },
  ];

  const recentlyViewed = [
    {
      id: 201,
      title: "Marketing Director",
      company: "Growth Partners",
      viewedDate: "2023-05-16",
    },
    {
      id: 202,
      title: "Data Scientist",
      company: "Analytics Pro",
      viewedDate: "2023-05-14",
    },
  ];

  const stats = [
    { icon: <FiBriefcase />, label: "Jobs Applied", value: 12 },
    { icon: <FiBookmark />, label: "Saved Jobs", value: 5 },
    { icon: <FiEye />, label: "Jobs Viewed", value: 34 },
    { icon: <FiBell />, label: "Active Alerts", value: 2 },
  ];

  return (
    <div className="dashboard-container">
      {/* Dashboard Overview Widgets */}
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div className="stat-card" key={index}>
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-content">
              <h3>{stat.value}</h3>
              <p>{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recommended Jobs Section */}
      <section className="dashboard-section">
        <h2>Recommended Jobs for You</h2>
        <div className="jobs-grid">
          {recommendedJobs.map((job) => (
            <div className="job-card" key={job.id}>
              <div className="job-header">
                <h3>{job.title}</h3>
                <span className="company">{job.company}</span>
              </div>
              <div className="job-details">
                <p>
                  <span>Location:</span> {job.location}
                </p>
                <p>
                  <span>Type:</span> {job.type}
                </p>
                <p>
                  <span>Salary:</span> {job.salary}
                </p>
                <p>
                  <span>Posted:</span> {job.posted}
                </p>
              </div>
              <div className="job-actions">
                <button className="btn-apply">Apply Now</button>
                <button className="btn-save">Save</button>
              </div>
              <div className="job-tags">
                <span className="tag">{job.type}</span>
                {job.location === "Remote" && (
                  <span className="tag">Remote</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Saved Jobs and Recently Viewed Side by Side */}
      <div className="dual-columns">
        {/* Saved Jobs Section */}
        <section className="dashboard-section saved-jobs">
          <h2>Saved Jobs</h2>
          {savedJobs.length > 0 ? (
            <div className="jobs-list">
              {savedJobs.map((job) => (
                <div className="list-item" key={job.id}>
                  <div className="item-content">
                    <h4>{job.title}</h4>
                    <p>{job.company}</p>
                    <small>Saved on {job.savedDate}</small>
                  </div>
                  <div className="item-actions">
                    <button className="btn-remove">Remove</button>
                    <button className="btn-apply">Apply</button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>You haven't saved any jobs yet.</p>
            </div>
          )}
        </section>

        {/* Recently Viewed Section */}
        <section className="dashboard-section recently-viewed">
          <h2>Recently Viewed</h2>
          {recentlyViewed.length > 0 ? (
            <div className="jobs-list">
              {recentlyViewed.map((job) => (
                <div className="list-item" key={job.id}>
                  <div className="item-content">
                    <h4>{job.title}</h4>
                    <p>{job.company}</p>
                    <small>Viewed on {job.viewedDate}</small>
                  </div>
                  <div className="item-actions">
                    <button className="btn-view">View Again</button>
                  </div>
                </div>
              ))}
              <button className="see-all">See All</button>
            </div>
          ) : (
            <div className="empty-state">
              <p>No recently viewed jobs.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
