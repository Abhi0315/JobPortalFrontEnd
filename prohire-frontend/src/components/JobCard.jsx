// // src/components/JobCard.jsx
// import React, { useState } from "react";
// import "../styles/JobCard.css";
// import axios from "axios";

// const JobCard = ({ job }) => {
//   const {
//     job_id,
//     title,
//     description,
//     is_remote,
//     employment_type,
//     employment_types,
//     posted_at,
//     min_salary,
//     max_salary,
//     salary_period,
//     employer,
//     location,
//     apply_options,
//     skills_required,
//     experience_required,
//     education_required
//   } = job;

//   const [expanded, setExpanded] = useState(false);
//   const [isSaved, setIsSaved] = useState(false);

//   const toggleExpand = () => setExpanded(!expanded);
  
//   const shortDescription = description?.split("\n")[0]?.slice(0, 150) + "...";
//   const fullDescription = description || "No description provided";

//   const applyLink = apply_options?.[0]?.apply_link;
//   const jobType = employment_type || employment_types?.[0]?.type || "N/A";

//   const locationStr = is_remote
//     ? "🌍 Remote"
//     : `${location?.city || ""}, ${location?.state || ""}`;

//   const salaryStr = min_salary && max_salary
//     ? `₹${min_salary.toLocaleString()} - ₹${max_salary.toLocaleString()}${salary_period ? ` / ${salary_period}` : ""}`
//     : "Salary: Not disclosed";

//   const postedDate = posted_at ? new Date(posted_at) : null;
//   const daysAgo = postedDate ? Math.floor((new Date() - postedDate) / (1000 * 60 * 60 * 24)) : null;

//   const handleSaveJob = async (e, jobId) => {
//   e.stopPropagation();

//   const token = localStorage.getItem('token');

//   if (!token){
//     console.error("No auth provided")
//     return ;
//     }



//   try {
//     const response = await axios.post(
//       'https://prohires.strangled.net/job/save_jobs/',
//       { job_id: jobId },
//       {
//         headers: {
//           Authorization: `Token ${token}`, // 👈 Include token in the header
//           'Content-Type': 'application/json'
//         }
//       }
//     );

//     if (response.status === 200 || response.status === 201) {
//       setIsSaved(true); // You could also use response.data to update state more precisely
//     } else {
//       console.error('Failed to save job');
//     }
//   } catch (error) {
//     console.error('Error saving job:', error);
//   }
// };

//   return (
//     <div className={`job-card ${expanded ? 'expanded' : ''}`} onClick={toggleExpand}>
//       <div className="job-card-header">
//         <div className="job-title-wrapper">
//           <h2>{title}</h2>
//           <span className="job-id">#{job_id.slice(0, 8)}</span>
//         </div>
// <button 
//   className={`save-job-btn ${isSaved ? 'saved' : ''}`}
//   onClick={(e) => handleSaveJob(e, job_id)}
//   aria-label={isSaved ? "Unsave job" : "Save job"}
// >
//   {isSaved ? '✓ Saved' : '+ Save'}
// </button>

//       </div>

//       <div className="employer-info">
//         {employer?.employer_logo ? (
//           <img src={employer.employer_logo} alt={employer.name} className="employer-logo" />
//         ) : (
//           <div className="placeholder-logo">{employer.name?.charAt(0)}</div>
//         )}
//         <div className="employer-details">
//           <span className="employer-name">{employer.name}</span>
//           {employer.website && (
//             <a
//               href={employer.website}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="employer-website"
//               onClick={e => e.stopPropagation()}
//             >
//               Visit Website
//             </a>
//           )}
//         </div>
//       </div>

//       <div className="job-details">
//         <p className={`job-desc ${expanded ? 'expanded' : ''}`}>
//           {expanded ? fullDescription : shortDescription}
//         </p>
        
//         {expanded && (
//           <div className="job-requirements">
//             {skills_required && (
//               <div className="requirements-section">
//                 <h4>Skills Required:</h4>
//                 <div className="skills-list">
//                   {skills_required.map((skill, index) => (
//                     <span key={index} className="skill-tag">{skill}</span>
//                   ))}
//                 </div>
//               </div>
//             )}
            
//             {experience_required && (
//               <div className="requirements-section">
//                 <h4>Experience:</h4>
//                 <p>{experience_required}</p>
//               </div>
//             )}
            
//             {education_required && (
//               <div className="requirements-section">
//                 <h4>Education:</h4>
//                 <p>{education_required}</p>
//               </div>
//             )}
//           </div>
//         )}
//       </div>

//       <div className="job-meta">
//         <div className="meta-item">
//           <span className="meta-icon">📍</span>
//           <span>{locationStr}</span>
//         </div>
//         <div className="meta-item">
//           <span className="meta-icon">🕒</span>
//           <span>{jobType}</span>
//         </div>
//         <div className="meta-item">
//           <span className="meta-icon">💰</span>
//           <span>{salaryStr}</span>
//         </div>
//         {postedDate && (
//           <div className="meta-item">
//             <span className="meta-icon">📅</span>
//             <span>
//               {postedDate.toLocaleDateString()} 
//               {daysAgo !== null && ` (${daysAgo} ${daysAgo === 1 ? 'day' : 'days'} ago)`}
//             </span>
//           </div>
//         )}
//       </div>

//       {applyLink && (
//         <div className="job-footer">
//           <a
//             href={applyLink}
//             className="apply-button"
//             target="_blank"
//             rel="noopener noreferrer"
//             onClick={e => e.stopPropagation()}
//           >
//             Apply Now
//           </a>
//         </div>
//       )}
//     </div>
//   );
// };

// export default JobCard;

import React, { useState } from "react";
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
    education_required
  } = job;

  const [expanded, setExpanded] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const toggleExpand = () => setExpanded(!expanded);
  
  const shortDescription = description?.split("\n")[0]?.slice(0, 150) + (description?.length > 150 ? "..." : "");
  const fullDescription = description || "No description provided";

  const applyLink = apply_options?.[0]?.apply_link;
  const jobType = employment_type || employment_types?.[0]?.type || "N/A";

  const locationStr = is_remote
    ? "🌍 Remote"
    : location?.city 
      ? `${location.city}${location.state ? `, ${location.state}` : ''}${location.country ? `, ${location.country}` : ''}`
      : "Location not specified";

  const salaryStr = min_salary && max_salary
    ? `₹${min_salary.toLocaleString()} - ₹${max_salary.toLocaleString()}${salary_period ? ` / ${salary_period}` : ""}`
    : "Salary not disclosed";

  const postedDate = posted_at ? new Date(posted_at) : null;
  const daysAgo = postedDate ? Math.floor((new Date() - postedDate) / (1000 * 60 * 60 * 24)) : null;

  const handleSaveJob = async (e) => {
    e.stopPropagation();
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      await axios.post(
        'https://prohires.strangled.net/job/save_jobs/',
        { job_id },
        { headers: { Authorization: `Token ${token}` } }
      );
      setIsSaved(true);
    } catch (error) {
      console.error('Error saving job:', error);
    }
  };

  return (
    <div className={`job-card ${expanded ? 'expanded' : ''}`}>
      <div className="job-card-header" onClick={toggleExpand}>
        <div className="job-title-wrapper">
          {employer?.employer_logo && (
            <img src={employer.employer_logo} alt={employer.name} className="employer-logo-small" />
          )}
          <div>
            <h2>{title}</h2>
            <div className="employer-name">{employer.name}</div>
          </div>
        </div>
        
        <div className="job-card-actions">
          <button 
            className={`save-job-btn ${isSaved ? 'saved' : ''}`}
            onClick={handleSaveJob}
            aria-label={isSaved ? "Unsave job" : "Save job"}
          >
            {isSaved ? '✓ Saved' : 'Save'}
          </button>
          {postedDate && (
            <div className="posted-date">
              {daysAgo === 0 ? "Today" : `${daysAgo} ${daysAgo === 1 ? 'day' : 'days'} ago`}
            </div>
          )}
        </div>
      </div>

      <div className={`job-card-body ${expanded ? 'expanded' : ''}`}>
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
            {expanded ? 'Show less' : 'Read more'}
          </button>
        </div>

        {expanded && skills_required.length > 0 && (
          <div className="job-skills">
            <h4>Skills:</h4>
            <div className="skills-list">
              {skills_required.map((skill, index) => (
                <span key={index} className="skill-tag">{skill}</span>
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
        {applyLink && (
          <a
            href={applyLink}
            className="apply-button"
            target="_blank"
            rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
          >
            Apply Now
          </a>
        )}
        {employer.website && (
          <a
            href={employer.website}
            className="company-website"
            target="_blank"
            rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
          >
            Visit Company
          </a>
        )}
      </div>
    </div>
  );
};

export default JobCard;