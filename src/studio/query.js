module.exports = `
query ($search: String) {
    Studio(search: $search) {
        id
        name
        siteUrl
        media (isMain: true, sort: POPULARITY_DESC, perPage: 5) {
            nodes {
                siteUrl
                title {
                    romaji
                }
            }
        }
    }
}
`;
