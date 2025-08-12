// src/components/JobCard.jsx
import React, { useState } from "react";
import "../styles/JobCard.css";

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
    skills_required,
    experience_required,
    education_required
  } = job;

  const [expanded, setExpanded] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const toggleExpand = () => setExpanded(!expanded);
  
  const shortDescription = description?.split("\n")[0]?.slice(0, 150) + "...";
  const fullDescription = description || "No description provided";

  const applyLink = apply_options?.[0]?.apply_link;
  const jobType = employment_type || employment_types?.[0]?.type || "N/A";

  const locationStr = is_remote
    ? "🌍 Remote"
    : `${location?.city || ""}, ${location?.state || ""}`;

  const salaryStr = min_salary && max_salary
    ? `₹${min_salary.toLocaleString()} - ₹${max_salary.toLocaleString()}${salary_period ? ` / ${salary_period}` : ""}`
    : "Salary: Not disclosed";

  const postedDate = posted_at ? new Date(posted_at) : null;
  const daysAgo = postedDate ? Math.floor((new Date() - postedDate) / (1000 * 60 * 60 * 24)) : null;

  const handleSaveJob = (e) => {
    e.stopPropagation();
    setIsSaved(!isSaved);
    // Here you would typically make an API call to save the job
  };

  return (
    <div className={`job-card ${expanded ? 'expanded' : ''}`} onClick={toggleExpand}>
      <div className="job-card-header">
        <div className="job-title-wrapper">
          <h2>{title}</h2>
          <span className="job-id">#{job_id.slice(0, 8)}</span>
        </div>
        <button 
          className={`save-job-btn ${isSaved ? 'saved' : ''}`}
          onClick={handleSaveJob}
          aria-label={isSaved ? "Unsave job" : "Save job"}
        >
          {isSaved ? '✓ Saved' : '+ Save'}
        </button>
      </div>

      <div className="employer-info">
        {employer?.employer_logo ? (
          <img src={employer.employer_logo} alt={employer.name} className="employer-logo" />
        ) : (
          <div className="placeholder-logo">{employer.name?.charAt(0)}</div>
        )}
        <div className="employer-details">
          <span className="employer-name">{employer.name}</span>
          {employer.website && (
            <a
              href={employer.website}
              target="_blank"
              rel="noopener noreferrer"
              className="employer-website"
              onClick={e => e.stopPropagation()}
            >
              Visit Website
            </a>
          )}
        </div>
      </div>

      <div className="job-details">
        <p className={`job-desc ${expanded ? 'expanded' : ''}`}>
          {expanded ? fullDescription : shortDescription}
        </p>
        
        {expanded && (
          <div className="job-requirements">
            {skills_required && (
              <div className="requirements-section">
                <h4>Skills Required:</h4>
                <div className="skills-list">
                  {skills_required.map((skill, index) => (
                    <span key={index} className="skill-tag">{skill}</span>
                  ))}
                </div>
              </div>
            )}
            
            {experience_required && (
              <div className="requirements-section">
                <h4>Experience:</h4>
                <p>{experience_required}</p>
              </div>
            )}
            
            {education_required && (
              <div className="requirements-section">
                <h4>Education:</h4>
                <p>{education_required}</p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="job-meta">
        <div className="meta-item">
          <span className="meta-icon">📍</span>
          <span>{locationStr}</span>
        </div>
        <div className="meta-item">
          <span className="meta-icon">🕒</span>
          <span>{jobType}</span>
        </div>
        <div className="meta-item">
          <span className="meta-icon">💰</span>
          <span>{salaryStr}</span>
        </div>
        {postedDate && (
          <div className="meta-item">
            <span className="meta-icon">📅</span>
            <span>
              {postedDate.toLocaleDateString()} 
              {daysAgo !== null && ` (${daysAgo} ${daysAgo === 1 ? 'day' : 'days'} ago)`}
            </span>
          </div>
        )}
      </div>

      {applyLink && (
        <div className="job-footer">
          <a
            href={applyLink}
            className="apply-button"
            target="_blank"
            rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
          >
            Apply Now
          </a>
          {expanded && (
            <button className="quick-apply-btn" onClick={e => {
              e.stopPropagation();
              // Implement quick apply functionality
            }}>
              Quick Apply
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default JobCard;