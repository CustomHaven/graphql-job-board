import { ApolloClient, HttpLink, gql, InMemoryCache, ApolloLink } from "@apollo/client";
import { getAccessToken } from "../auth";
import { jobByIdQuery, jobDetailFragment } from "./globalQueries";

const httpLink = new HttpLink({
    uri: "http://localhost:9000/graphql"
});

const authLink = new ApolloLink((operation, forward) => {
    const accessToken = getAccessToken();
    if (accessToken) {
        operation.setContext({
            headers: {
                "Authorization": `Bearer ${accessToken}`
            }
        });
    }
    return forward(operation);
});

const apolloClient = new ApolloClient({
    link: ApolloLink.from([authLink, httpLink]),
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

export async function createJob({ title, description}) {
    const mutation = gql`
        mutation CreateJob($input: CreateJobInput!) {
            job: createJob(input: $input) {
                ...JobDetail
            }
        }
        ${jobDetailFragment}
    `;

    const { data } = await apolloClient.mutate({
        mutation,
        variables: { input: { title, description } },
        update: (cache, { data }) => {
            cache.writeQuery({
                query: jobByIdQuery,
                variables: { id: data.job.id },
                data
            });
        },
    });

    return data.job;
}
