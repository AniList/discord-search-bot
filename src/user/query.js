module.exports = `
query ($search: String) {
    User(search: $search) {
        id
        name
        siteUrl
        avatar {
            large
        }
        about (asHtml: true),
        stats {
            watchedTime
            chaptersRead
        }
    }
}
`;
