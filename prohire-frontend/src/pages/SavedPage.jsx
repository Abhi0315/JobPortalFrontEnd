// import "../styles/SavedPage.css";
// import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import axios from "axios";
// import {
//   FiBookmark,
//   FiTrash2,
//   FiSearch,
//   FiClock,
//   FiTag,
//   FiFilter,
//   FiChevronDown,
//   FiExternalLink,
//   FiBriefcase,
//   FiMapPin,
//   FiDollarSign,
//   FiAlertCircle,
// } from "react-icons/fi";
// import { motion, AnimatePresence } from "framer-motion";

// const SavedPage = () => {
//   const [savedJobs, setSavedJobs] = useState([]);
//   const [filteredJobs, setFilteredJobs] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [activeFilter, setActiveFilter] = useState("all");
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [expandedJob, setExpandedJob] = useState(null);

//   // Fetch saved jobs from API
//   useEffect(() => {
//     const fetchSavedJobs = async () => {
//       setIsLoading(true);
//       setError(null);
//       const token = localStorage.getItem("token");

//       try {
//         const response = await axios.get(
//           "https://prohires.strangled.net/job/saved-jobs/",
//           {
//             headers: token ? { Authorization: `Token ${token}` } : {},
//           }
//         );

//         setSavedJobs(response.data);
//         setFilteredJobs(response.data);
//       } catch (err) {
//         console.error("Failed to fetch saved jobs:", err);
//         setError("Failed to load saved jobs. Please try again later.");
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchSavedJobs();
//   }, []);

//   // Filter and search functionality
//   useEffect(() => {
//     let results = savedJobs;

//     // Apply type filter
//     if (activeFilter !== "all") {
//       results = results.filter((job) => job.employment_type === activeFilter);
//     }

//     // Apply search term
//     if (searchTerm) {
//       const term = searchTerm.toLowerCase();
//       results = results.filter(
//         (job) =>
//           job.title.toLowerCase().includes(term) ||
//           job.company_name.toLowerCase().includes(term) ||
//           (job.description && job.description.toLowerCase().includes(term)) ||
//           (job.skills &&
//             job.skills.some((skill) => skill.toLowerCase().includes(term)))
//       );
//     }

//     setFilteredJobs(results);
//   }, [searchTerm, activeFilter, savedJobs]);

//   const handleUnsaveJob = async (jobId) => {
//     const token = localStorage.getItem("token");

//     try {
//       await axios.post(
//         `https://prohires.strangled.net/job/unsave-job/${jobId}/`,
//         {},
//         {
//           headers: token ? { Authorization: `Token ${token}` } : {},
//         }
//       );

//       setSavedJobs((prev) => prev.filter((job) => job.job_id !== jobId));
//     } catch (err) {
//       console.error("Failed to unsave job:", err);
//       setError("Failed to unsave job. Please try again.");
//     }
//   };

//   const toggleExpand = (jobId) => {
//     setExpandedJob(expandedJob === jobId ? null : jobId);
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return "Recently";
//     const options = { year: "numeric", month: "short", day: "numeric" };
//     return new Date(dateString).toLocaleDateString(undefined, options);
//   };

//   // Extract unique employment types for filter
//   const employmentTypes = [
//     ...new Set(savedJobs.map((job) => job.employment_type).filter(Boolean)),
//   ];

//   return (
//     <SavedJobsLayout>
//       <div className="saved-page-container">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//           <header className="mb-8">
//             <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
//               <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center">
//                 <FiBookmark className="mr-3 text-purple-600" />
//                 Saved Jobs
//               </h1>
//               <Link
//                 to="/jobs"
//                 className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center text-sm md:text-base"
//               >
//                 <FiBriefcase className="mr-2" />
//                 Browse Jobs
//               </Link>
//             </div>

//             <div className="flex flex-col md:flex-row gap-4 mb-6">
//               <div className="relative flex-grow">
//                 <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//                 <input
//                   type="text"
//                   placeholder="Search saved jobs..."
//                   className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all text-sm md:text-base"
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                 />
//               </div>

//               <div className="flex items-center gap-2">
//                 <FiFilter className="text-gray-500" />
//                 <select
//                   className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all text-sm md:text-base"
//                   value={activeFilter}
//                   onChange={(e) => setActiveFilter(e.target.value)}
//                 >
//                   <option value="all">All Types</option>
//                   {employmentTypes.map((type) => (
//                     <option key={type} value={type}>
//                       {type}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>

//             <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//               <p className="text-gray-600 text-sm md:text-base">
//                 {filteredJobs.length}{" "}
//                 {filteredJobs.length === 1 ? "job" : "jobs"} saved
//               </p>
//               <div className="flex flex-wrap gap-2">
//                 {["all", ...employmentTypes].map((type) => (
//                   <button
//                     key={type}
//                     className={`px-3 py-1 rounded-full text-xs md:text-sm capitalize ${
//                       activeFilter === type
//                         ? "bg-purple-600 text-white"
//                         : "bg-gray-200 text-gray-700 hover:bg-gray-300"
//                     }`}
//                     onClick={() => setActiveFilter(type)}
//                   >
//                     {type}
//                   </button>
//                 ))}
//               </div>
//             </div>
//           </header>

//           {error && (
//             <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 rounded">
//               <div className="flex items-center">
//                 <FiAlertCircle className="text-red-400 mr-2" />
//                 <p className="text-red-700">{error}</p>
//               </div>
//             </div>
//           )}

//           {isLoading ? (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {[...Array(6)].map((_, i) => (
//                 <div
//                   key={i}
//                   className="bg-white rounded-xl shadow-sm p-4 h-64 animate-pulse"
//                 >
//                   <div className="h-5 bg-gray-200 rounded w-3/4 mb-4"></div>
//                   <div className="h-4 bg-gray-200 rounded w-full mb-3"></div>
//                   <div className="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>
//                   <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
//                   <div className="flex gap-2">
//                     <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
//                     <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           ) : filteredJobs.length === 0 ? (
//             <div className="text-center py-16 bg-white rounded-xl shadow-sm">
//               <FiBookmark className="mx-auto text-5xl text-gray-300 mb-4" />
//               <h3 className="text-xl font-medium text-gray-600 mb-2">
//                 {searchTerm || activeFilter !== "all"
//                   ? "No saved jobs match your criteria"
//                   : "You haven't saved any jobs yet"}
//               </h3>
//               <p className="text-gray-500 mb-6 max-w-md mx-auto">
//                 {searchTerm || activeFilter !== "all"
//                   ? "Try adjusting your search or filter criteria"
//                   : "Browse jobs and save them to view here"}
//               </p>
//               <Link
//                 to="/jobs"
//                 className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors inline-flex items-center text-sm md:text-base"
//               >
//                 <FiBriefcase className="mr-2" />
//                 Browse Jobs
//               </Link>
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               <AnimatePresence>
//                 {filteredJobs.map((job) => (
//                   <motion.div
//                     key={job.job_id}
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     exit={{ opacity: 0, scale: 0.95 }}
//                     transition={{ duration: 0.2 }}
//                     className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow flex flex-col"
//                   >
//                     <div className="p-5 flex-grow">
//                       <div className="flex justify-between items-start mb-3">
//                         <h3 className="font-semibold text-lg text-gray-800 line-clamp-2">
//                           {job.title}
//                         </h3>
//                         <button
//                           onClick={() => handleUnsaveJob(job.job_id)}
//                           className="text-gray-400 hover:text-red-500 transition-colors p-1 ml-2"
//                           aria-label="Unsave job"
//                         >
//                           <FiTrash2 />
//                         </button>
//                       </div>

//                       <p className="text-gray-600 text-sm mb-3 font-medium">
//                         {job.company_name}
//                       </p>

//                       <div className="flex items-center text-sm text-gray-500 mb-3">
//                         <FiMapPin className="mr-1 flex-shrink-0" />
//                         <span className="truncate">
//                           {job.location || "Remote"}
//                         </span>
//                       </div>

//                       <div className="flex items-center text-sm text-gray-500 mb-4">
//                         <FiDollarSign className="mr-1 flex-shrink-0" />
//                         <span>{job.salary || "Salary not specified"}</span>
//                       </div>

//                       {job.skills && job.skills.length > 0 && (
//                         <div className="flex flex-wrap gap-2 mb-4">
//                           {job.skills.slice(0, 3).map((skill) => (
//                             <span
//                               key={skill}
//                               className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full"
//                             >
//                               {skill}
//                             </span>
//                           ))}
//                           {job.skills.length > 3 && (
//                             <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-full">
//                               +{job.skills.length - 3} more
//                             </span>
//                           )}
//                         </div>
//                       )}

//                       <div className="flex justify-between items-center mt-auto">
//                         <a
//                           href={`/jobs/${job.job_id}`}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className="text-purple-600 hover:text-purple-800 text-sm font-medium flex items-center"
//                         >
//                           View Job <FiExternalLink className="ml-1" size={14} />
//                         </a>

//                         <button
//                           onClick={() => toggleExpand(job.job_id)}
//                           className="text-gray-500 hover:text-gray-700 text-sm flex items-center"
//                         >
//                           {expandedJob === job.job_id
//                             ? "Show less"
//                             : "Show more"}
//                           <FiChevronDown
//                             className={`ml-1 transition-transform ${
//                               expandedJob === job.job_id ? "rotate-180" : ""
//                             }`}
//                             size={14}
//                           />
//                         </button>
//                       </div>
//                     </div>

//                     {expandedJob === job.job_id && (
//                       <motion.div
//                         initial={{ opacity: 0, height: 0 }}
//                         animate={{ opacity: 1, height: "auto" }}
//                         exit={{ opacity: 0, height: 0 }}
//                         className="px-5 pb-5 border-t border-gray-100"
//                       >
//                         <div className="pt-4">
//                           <h4 className="font-medium text-gray-700 mb-2">
//                             Job Details
//                           </h4>
//                           <div className="grid grid-cols-2 gap-4 text-sm mb-4">
//                             <div>
//                               <p className="text-gray-500">Type</p>
//                               <p className="capitalize">
//                                 {job.employment_type || "Not specified"}
//                               </p>
//                             </div>
//                             <div>
//                               <p className="text-gray-500">Posted</p>
//                               <p>{formatDate(job.posted_at)}</p>
//                             </div>
//                             <div>
//                               <p className="text-gray-500">Experience</p>
//                               <p>{job.experience || "Not specified"}</p>
//                             </div>
//                             <div>
//                               <p className="text-gray-500">Remote</p>
//                               <p>{job.is_remote ? "Yes" : "No"}</p>
//                             </div>
//                           </div>

//                           {job.description && (
//                             <>
//                               <h4 className="font-medium text-gray-700 mb-2">
//                                 Description
//                               </h4>
//                               <p className="text-gray-600 text-sm mb-4 line-clamp-4">
//                                 {job.description}
//                               </p>
//                             </>
//                           )}

//                           <div className="flex gap-2">
//                             {job.apply_link && (
//                               <a
//                                 href={job.apply_link}
//                                 target="_blank"
//                                 rel="noopener noreferrer"
//                                 className="text-purple-600 hover:text-purple-800 text-sm font-medium"
//                               >
//                                 Apply Now
//                               </a>
//                             )}
//                             <button
//                               onClick={() => handleUnsaveJob(job.job_id)}
//                               className="text-red-600 hover:text-red-800 text-sm font-medium"
//                             >
//                               Remove Saved
//                             </button>
//                           </div>
//                         </div>
//                       </motion.div>
//                     )}
//                   </motion.div>
//                 ))}
//               </AnimatePresence>
//             </div>
//           )}
//         </div>
//       </div>
//     </SavedJobsLayout>
//   );
// };

// export default SavedPage;
