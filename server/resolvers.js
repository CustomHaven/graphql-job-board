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
        createJob: async (_root, { input: { title, description } }, context) => {
            if (!context.user) {
                throw unauthorisedError("Missing authentication");
            }
            const companyId = context.user.companyId;
            return await createJob({ companyId, title, description });
        },
        updateJob: async (_root, { input: { id, title, description } }, { user }) => {
            if (!user) {
                throw unauthorisedError("Missing authentication");
            }
            const job = await updateJob({ id, title, description, companyId: user.companyId });
            if (!job) {
                throw notFoundError("No Job found with id " + id);
            }
            return job;
        },
        
        
        deleteJob: async (_root, { id }, { user }) => {
            if (!user) {
                throw unauthorisedError("Missing authentication");
            }
            // getJob
            // check that job.companyId === user.companyId
            const job = await deleteJob(id, user.companyId);
            if (!job) {
                throw notFoundError("No Job found with id " + id);
            }
            return job;
        },
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

function unauthorisedError(message) {
    return new GraphQLError(message, {
        extensions: {
            code: "UNAUTHORISED",
        }
    });
}
