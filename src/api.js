const { GraphQLClient } = require("graphql-request");

const client = new GraphQLClient("https://graphql.anilist.co", {
    redirect: "follow"
});

const fetch = (query, variables) =>
    client
        .request(query, variables)
        .then(data => data)
        .catch(error => ({
            error: error.response.errors[0] || "Unknown Error"
        }));

module.exports = fetch;
