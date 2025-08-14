// import { useEffect, useState } from "react";
// import JobCard from "../components/JobCard";
// import axios from "axios";
// import "../styles/JobsPage.css"; // Import the CSS file

// const JobsPage = () => {
//   const [jobs, setJobs] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const fetchJobs = async () => {
//       setIsLoading(true);
//       const token = localStorage.getItem("token");

//       try {
//         const response = await axios.get(
//           `https://prohires.strangled.net/job/jobs/?page=${currentPage}`,
//           {
//             headers: token ? { Authorization: `Token ${token}` } : {}
//           }
//         );

//         setJobs(response.data.results);
//         setTotalPages(response.data.total_pages || 1);
//       } catch (err) {
//         console.error("Failed to fetch jobs:", err);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchJobs();
//   }, [currentPage]);

//   const handleNextPage = () => {
//     if (currentPage < totalPages) {
//       setCurrentPage(currentPage + 1);
//     }
//   };

//   const handlePrevPage = () => {
//     if (currentPage > 1) {
//       setCurrentPage(currentPage - 1);
//     }
//   };

//   const handlePageChange = (page) => {
//     setCurrentPage(page);
//   };

//   // Calculate visible page numbers (max 5 pages shown at a time)
//   const getVisiblePages = () => {
//     const visiblePages = [];
//     let startPage = Math.max(1, currentPage - 2);
//     let endPage = Math.min(totalPages, startPage + 4);
    
//     // Adjust if we're near the start
//     if (endPage - startPage < 4 && totalPages > 5) {
//       startPage = Math.max(1, endPage - 4);
//     }
    
//     for (let i = startPage; i <= endPage; i++) {
//       visiblePages.push(i);
//     }
    
//     return visiblePages;
//   };

//   return (
//     <div className="jobs-page-container">
//       <h1 className="jobs-page-title">Available Jobs</h1>
      
//       {isLoading ? (
//         <div className="loading-spinner"></div>
//       ) : jobs.length === 0 ? (
//         <p className="no-jobs-message">No jobs found</p>
//       ) : (
//         <>
//           <div className="jobs-list">
//             {jobs.map(job => (
//               <JobCard key={job.job_id} job={job} />
//             ))}
//           </div>
          
//           {totalPages > 1 && (
//             <div className="pagination-container">
//               <button 
//                 onClick={handlePrevPage} 
//                 disabled={currentPage === 1}
//                 className="pagination-arrow"
//                 aria-label="Previous page"
//               >
//                 <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//                   <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//                 </svg>
//               </button>
              
//               <div className="pagination-numbers">
//                 {currentPage > 3 && totalPages > 5 && (
//                   <>
//                     <button onClick={() => handlePageChange(1)} className="page-number">
//                       1
//                     </button>
//                     <span className="page-ellipsis">...</span>
//                   </>
//                 )}
                
//                 {getVisiblePages().map(page => (
//                   <button
//                     key={page}
//                     onClick={() => handlePageChange(page)}
//                     className={`page-number ${currentPage === page ? 'active' : ''}`}
//                     aria-label={`Page ${page}`}
//                   >
//                     {page}
//                   </button>
//                 ))}
                
//                 {currentPage < totalPages - 2 && totalPages > 5 && (
//                   <>
//                     <span className="page-ellipsis">...</span>
//                     <button onClick={() => handlePageChange(totalPages)} className="page-number">
//                       {totalPages}
//                     </button>
//                   </>
//                 )}
//               </div>
              
//               <button 
//                 onClick={handleNextPage} 
//                 disabled={currentPage === totalPages}
//                 className="pagination-arrow"
//                 aria-label="Next page"
//               >
//                 <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//                   <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//                 </svg>
//               </button>
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// };

// export default JobsPage;


import { useEffect, useState } from "react";
import JobCard from "../components/JobCard";
import axios from "axios";
import "../styles/JobsPage.css";

const JobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: "",
    location: "",
    employment_type: "",
    min_salary: "",
    is_remote: false
  });
  const [availableFilters, setAvailableFilters] = useState({
    employment_types: []
  });
  const [showFilters, setShowFilters] = useState(false);

  const fetchJobs = async () => {
    setIsLoading(true);
    const token = localStorage.getItem("token");
    const params = new URLSearchParams({
      page: currentPage,
      ...(filters.search && { search: filters.search }),
      ...(filters.location && { location: filters.location }),
      ...(filters.employment_type && { employment_type: filters.employment_type }),
      ...(filters.min_salary && { min_salary: filters.min_salary }),
      ...(filters.is_remote && { is_remote: filters.is_remote })
    });

    try {
      const response = await axios.get(
        `https://prohires.strangled.net/job/jobs/?${params.toString()}`,
        {
          headers: token ? { Authorization: `Token ${token}` } : {}
        }
      );

      setJobs(response.data.results);
      setTotalPages(response.data.total_pages);
      setAvailableFilters(response.data.filters || { employment_types: [] });
    } catch (err) {
      console.error("Failed to fetch jobs:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [currentPage, filters]);

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  const handleResetFilters = () => {
    setFilters({
      search: "",
      location: "",
      employment_type: "",
      min_salary: "",
      is_remote: false
    });
    setCurrentPage(1);
  };

  // Pagination functions remain the same...

  return (
    <div className="jobs-page-container">
      <h1 className="jobs-page-title">Find Your Dream Job</h1>
      
      {/* Search and Filter Bar */}
      <div className="search-filter-container">
        <form onSubmit={handleSearchSubmit} className="search-form">
          <div className="search-input-group">
            <input
              type="text"
              name="search"
              placeholder="Job title, keywords, or company"
              value={filters.search}
              onChange={handleFilterChange}
              className="search-input"
            />
            <button type="submit" className="search-button">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
          </div>
          
          <div className="search-input-group">
            <input
              type="text"
              name="location"
              placeholder="Location"
              value={filters.location}
              onChange={handleFilterChange}
              className="search-input"
            />
            <button type="button" className="filter-toggle" onClick={() => setShowFilters(!showFilters)}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="4" y1="21" x2="4" y2="14"></line>
                <line x1="4" y1="10" x2="4" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12" y2="3"></line>
                <line x1="20" y1="21" x2="20" y2="16"></line>
                <line x1="20" y1="12" x2="20" y2="3"></line>
                <line x1="1" y1="14" x2="7" y2="14"></line>
                <line x1="9" y1="8" x2="15" y2="8"></line>
                <line x1="17" y1="16" x2="23" y2="16"></line>
              </svg>
              Filters
            </button>
          </div>
        </form>
        
        {/* Expanded Filters Panel */}
        {showFilters && (
          <div className="filters-panel">
            <div className="filter-section">
              <h4>Employment Type</h4>
              <select
                name="employment_type"
                value={filters.employment_type}
                onChange={handleFilterChange}
                className="filter-select"
              >
                <option value="">All Types</option>
                {availableFilters.employment_types.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            
            <div className="filter-section">
              <h4>Minimum Salary</h4>
              <input
                type="number"
                name="min_salary"
                placeholder="₹ Minimum"
                value={filters.min_salary}
                onChange={handleFilterChange}
                className="filter-input"
              />
            </div>
            
            <div className="filter-section">
              <label className="filter-checkbox">
                <input
                  type="checkbox"
                  name="is_remote"
                  checked={filters.is_remote}
                  onChange={handleFilterChange}
                />
                <span>Remote Only</span>
              </label>
            </div>
            
            <div className="filter-actions">
              <button type="button" onClick={handleResetFilters} className="reset-filters">
                Reset All
              </button>
              <button type="button" onClick={() => setShowFilters(false)} className="apply-filters">
                Show Results
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Results Count */}
      {!isLoading && jobs.length > 0 && (
        <div className="results-count">
          Showing {jobs.length} of {totalPages > 1 ? `${totalPages * 10}+` : jobs.length} jobs
        </div>
      )}
      
      {/* Loading and Empty States */}
      {isLoading ? (
        <div className="loading-spinner"></div>
      ) : jobs.length === 0 ? (
        <div className="no-jobs-found">
          <h3>No jobs found matching your criteria</h3>
          <p>Try adjusting your search or filters</p>
          <button onClick={handleResetFilters} className="reset-search">
            Reset Search
          </button>
        </div>
      ) : (
        <>
          <div className="jobs-list">
            {jobs.map(job => (
              <JobCard key={job.job_id} job={job} />
            ))}
          </div>
          
          {/* Pagination - same as before */}
          {/* Pagination */}
{totalPages > 1 && (
  <div className="pagination">
    <button
      className="pagination-button"
      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
      disabled={currentPage === 1}
    >
      Prev
    </button>

    {Array.from({ length: totalPages }, (_, i) => i + 1)
      .filter(page =>
        page === 1 ||
        page === totalPages ||
        Math.abs(currentPage - page) <= 2
      )
      .map((page, index, array) => {
        const prevPage = array[index - 1];
        const showDots = prevPage && page - prevPage > 1;

        return (
          <span key={page} className="pagination-wrapper">
            {showDots && <span className="pagination-dots">...</span>}
            <button
              className={`pagination-button ${page === currentPage ? "active" : ""}`}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          </span>
        );
      })}

    <button
      className="pagination-button"
      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
      disabled={currentPage === totalPages}
    >
      Next
    </button>
  </div>
)}

        </>
      )}
    </div>
  );
};

export default JobsPage;