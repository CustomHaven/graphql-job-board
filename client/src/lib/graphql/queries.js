import { ApolloClient, HttpLink, gql, InMemoryCache } from "@apollo/client";
import { jobByIdQuery } from "./globalQueries";

const apolloClient = new ApolloClient({
    link: new HttpLink({ uri: "http://localhost:9000/graphql" }),
    cache: new InMemoryCache(),
    defaultOptions: {
        query: {
            fetchPolicy: "network-only"
        },
        watchQuery: {
            fetchPolicy: "network-only"
        }
    }
});

export async function getCompany(id) {
    const query = gql`
        query TheCompanyId($id: ID!) {
            company(id: $id) {
                id
                name
                description
                jobs {
                    id
                    date
                    title
                }
            }
        }
    `;

    const { data } = await apolloClient.query({
        query,
        variables: {
            id
        } 
    });
    return data.company;
};

export async function getJob(id) {
    const { data } = await apolloClient.query({
        query: jobByIdQuery,
        variables: { id },
    });
    return data.job;
}

export async function getJobs() {
    const query = gql`
        query {
            jobs {
                id
                date
                title
                company {
                    id
                    name
                }
                description
            }
        }
    `;
    const { data } = await apolloClient.query({
        query,
        // fetchPolicy: "network-only"
    });
    return data.jobs;
}
