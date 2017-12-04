module.exports = `
query ($search: String, $type: MediaType) {
    Media(search: $search, type: $type) {
        id
        siteUrl
        title {
            romaji
        }
        coverImage {
            large
        }
        status
        description(asHtml: true)
        averageScore
    }
}
`;
