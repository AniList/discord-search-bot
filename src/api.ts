import { GraphQLClient } from "graphql-request";
import { Variables } from "graphql-request/dist/src/types";

const client = new GraphQLClient("https://graphql.anilist.co", {
    redirect: "follow"
});

export type FetchResponse = any | { error: string };

export default async function fetch(query: string, variables: Variables): Promise<FetchResponse> {
    try {
        return client.request(query, variables);
    } catch (error) {
        return {
            error: error.response.errors[0] || "Unknown Error"
        };
    }
}
