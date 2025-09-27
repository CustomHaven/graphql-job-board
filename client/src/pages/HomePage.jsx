import { useState, useEffect } from 'react';
import JobList from '../components/JobList';
import { getJobs } from '../lib/graphql/queries';


function HomePage() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    // if (jobs.length === 0) {
      getJobs().then(setJobs);
    // }
  }, []);

  console.log("HomePage, Jobs:", jobs);

  return (
    <div>
      <h1 className="title">
        Job Board
      </h1>
      <JobList jobs={jobs} />
    </div>
  );
}

export default HomePage;
