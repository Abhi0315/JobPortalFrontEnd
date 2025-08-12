import { useEffect, useState } from "react";
import JobCard from "../components/JobCard";
import axios from "axios";

const JobsPage = () => {
  const [jobs, setJobs] = useState([]);

useEffect(() => {
  const token = localStorage.getItem("token"); // Make sure it's stored with this key

  axios.get("https://prohires.strangled.net/job/jobs/", {
    headers: {
      Authorization: `Token ${token}`
    }
  })
  .then(res => setJobs(res.data))
  .catch(err => console.error("Failed to fetch jobs:", err));
}, []);


  return (
    <div>
      <h1>Available Jobs</h1>
      {jobs.length === 0 ? (
        <p>Loading jobs...</p>
      ) : (
        jobs.map(job => (
          <JobCard key={job.job_id} job={job} />
        ))
      )}
    </div>
  );
};

export default JobsPage;
