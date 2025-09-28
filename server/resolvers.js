import {  GraphQLError } from "graphql";
import { createJob, deleteJob, getJob, getJobs, getJobsByCompany, updateJob } from "./db/jobs.js";
import { getCompany } from "./db/companies.js";

export const resolvers = {
    Query: {
        company: async (_root, args) => {
            const company = await getCompany(args.id);
            if (!company) {
                throw notFoundError("No Company found with id " + args.id);
            }
            return company;
        },
        job: async (_root, args) => {
            const job = await getJob(args.id)
            if (!job) {
                throw notFoundError("No Job found with id " + args.id);
            }
            return job;
        },
        jobs: async () => await getJobs(),
    },

    Mutation: {
        createJob: (_root, { input: { title, description }}) => {
            const companyId = "FjcJCHJALA4i"; // TODO: Change when doing Auth
            return createJob({ companyId, title, description });
        },
        updateJob: (_root, {input: { id, title, description }}) => updateJob({ id, title, description }),
        deleteJob: (_root, { id }) => deleteJob(id),
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

function notFoundError(message) {
    return new GraphQLError(message, {
        extensions: {
            code: "NOT_FOUND",
        }
    });
}
