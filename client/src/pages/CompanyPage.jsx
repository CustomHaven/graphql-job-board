import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import JobList from '../components/JobList';
import { getCompany } from '../lib/graphql/queries';

function CompanyPage() {
  const { companyId } = useParams();
  const [company, setCompany] = useState({});

  useEffect(() => {
    setTimeout(() => {
      getCompany(companyId).then(setCompany);
    }, 500);
  }, [companyId]);

  if (!("id" in company)) {
    return <div>Loading..</div>
  }

  console.log("company,", company)

  return (
    <div>
      <h1 className="title">
        {company.name}
      </h1>
      <div className="box">
        {company.description}
      </div>
      <h2 className='title is-5'>
        Jobs at {company.name}
      </h2>
      <JobList jobs={company.jobs} />
    </div>
  );
}

export default CompanyPage;
