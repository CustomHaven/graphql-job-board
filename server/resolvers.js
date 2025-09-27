import { getJob, getJobs, getJobsByCompany } from "./db/jobs.js";
import { getCompany } from "./db/companies.js";

export const resolvers = {
    Query: {
        company: async (_root, args) => await getCompany(args.id),
        job: async (_root, args) => await getJob(args.id),
        jobs: async () => await getJobs(),
    },

    Company: {
        jobs: async (company) => await getJobsByCompany(company.id),
    },

    Job: {
        company: async (job) => await getCompany(job.companyId),
        date: (job) => toISODate(job.createdAt)
    }
};

function toISODate(value) { // value.replace(/T.*/, "");
    return value.slice(0, "yyyy-mm-dd".length);
}
