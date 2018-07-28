module.exports = `
query ($search: String) {
    User(name: $search) {
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
