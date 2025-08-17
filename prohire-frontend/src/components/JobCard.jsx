import React, { useState } from "react";
import { FaRegBookmark, FaBookmark } from "react-icons/fa";
import "../styles/JobCard.css";
import axios from "axios";

const JobCard = ({ job }) => {
  const {
    job_id,
    title,
    description,
    is_remote,
    employment_type,
    employment_types,
    posted_at,
    min_salary,
    max_salary,
    salary_period,
    employer,
    location,
    apply_options,
    skills_required = [],
    experience_required,
    education_required,
  } = job;

  const [expanded, setExpanded] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const [isApplying, setIsApplying] = useState(false);

  const toggleExpand = () => setExpanded(!expanded);

  const shortDescription =
    description?.split("\n")[0]?.slice(0, 150) +
    (description?.length > 150 ? "..." : "");
  const fullDescription = description || "No description provided";

  const applyLink = apply_options?.[0]?.apply_link;
  const jobType = employment_type || employment_types?.[0]?.type || "N/A";

  const locationStr = is_remote
    ? "🌍 Remote"
    : location?.city
    ? `${location.city}${location.state ? `, ${location.state}` : ""}${
        location.country ? `, ${location.country}` : ""
      }`
    : "Location not specified";

  const salaryStr =
    min_salary && max_salary
      ? `₹${min_salary.toLocaleString()} - ₹${max_salary.toLocaleString()}${
          salary_period ? ` / ${salary_period}` : ""
        }`
      : "Salary not disclosed";

  const postedDate = posted_at ? new Date(posted_at) : null;
  const daysAgo = postedDate
    ? Math.floor((new Date() - postedDate) / (1000 * 60 * 60 * 24))
    : null;

  const handleSaveJob = async (e) => {
    e.stopPropagation();
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      setIsSaved(!isSaved);
      await axios.post(
        "https://prohires.strangled.net/job/save_jobs/",
        { job_id },
        { headers: { Authorization: `Token ${token}` } }
      );
    } catch (error) {
      console.error("Error saving job:", error);
      setIsSaved(!isSaved);
    }
  };

  const trackJobApplication = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("Cannot track job view - no auth token");
      return false;
    }

    try {
      console.log(`Tracking view for job: ${job_id}`);
      const response = await axios.post(
        "https://prohires.strangled.net/job/view_job/",
        { job_id },
        {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
          timeout: 3000,
        }
      );
      console.log("Job view tracked successfully", response.data);
      return true;
    } catch (error) {
      console.error("Failed to track job view:", {
        error: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      return false;
    }
  };

  const handleApply = async (e) => {
    e.stopPropagation();
    setIsApplying(true);

    // 1. First track the job view via your API
    await trackJobApplication();

    // 2. Then proceed with application redirect (external apply link)
    if (applyLink) {
      window.open(applyLink, "_blank");
    }

    setIsApplying(false);
  };

  const getLogoUrl = () => {
    if (!employer?.employer_logo) return null;
    if (employer.employer_logo.startsWith("http")) {
      return employer.employer_logo;
    }
    return `https://prohires.strangled.net${employer.employer_logo}`;
  };

  const logoUrl = getLogoUrl();

  return (
    <div className={`job-card ${expanded ? "expanded" : ""}`}>
      <div className="job-card-header" onClick={toggleExpand}>
        <div className="job-title-wrapper">
          {logoUrl && !logoError ? (
            <img
              src={logoUrl}
              alt={employer.name}
              className="employer-logo-small"
              onError={() => setLogoError(true)}
            />
          ) : (
            <div className="employer-logo-placeholder">
              {employer.name?.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="job-title-container">
            <h2>{title}</h2>
            <div className="employer-name">{employer.name}</div>
          </div>
        </div>

        <div className="job-card-actions">
          <button
            className={`save-job-btn ${isSaved ? "saved" : ""}`}
            onClick={handleSaveJob}
            aria-label={isSaved ? "Unsave job" : "Save job"}
          >
            {isSaved ? <FaBookmark /> : <FaRegBookmark />}
            <span className="save-btn-text">{isSaved ? "Saved" : "Save"}</span>
          </button>
          {postedDate && (
            <div className="posted-date">
              {daysAgo === 0
                ? "Today"
                : `${daysAgo} ${daysAgo === 1 ? "day" : "days"} ago`}
            </div>
          )}
        </div>
      </div>

      <div className={`job-card-body ${expanded ? "expanded" : ""}`}>
        <div className="job-highlights">
          <div className="highlight-item">
            <span className="highlight-icon">📍</span>
            <span>{locationStr}</span>
          </div>
          <div className="highlight-item">
            <span className="highlight-icon">🕒</span>
            <span>{jobType}</span>
          </div>
          <div className="highlight-item">
            <span className="highlight-icon">💰</span>
            <span>{salaryStr}</span>
          </div>
        </div>

        <div className="job-description">
          <p>{expanded ? fullDescription : shortDescription}</p>
          <button className="read-more" onClick={toggleExpand}>
            {expanded ? "Show less" : "Read more"}
          </button>
        </div>

        {expanded && skills_required.length > 0 && (
          <div className="job-skills">
            <h4>Skills:</h4>
            <div className="skills-list">
              {skills_required.map((skill, index) => (
                <span key={index} className="skill-tag">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {expanded && (experience_required || education_required) && (
          <div className="job-requirements">
            {experience_required && (
              <div className="requirement-item">
                <strong>Experience:</strong> {experience_required}
              </div>
            )}
            {education_required && (
              <div className="requirement-item">
                <strong>Education:</strong> {education_required}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="job-card-footer">
        <button
          className="apply-button"
          onClick={handleApply}
          disabled={isApplying}
        >
          {isApplying ? "Applying..." : "Apply Now"}
        </button>
        {employer.website && (
          <a
            href={employer.website}
            className="company-website"
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
          >
            Visit Company
          </a>
        )}
      </div>
    </div>
  );
};

export default JobCard;
