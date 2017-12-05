module.exports = `
query ($search: String) {
    Character(search: $search) {
        id
        siteUrl
        name {
            first
            last
        }
        image {
            large
        }
        description(asHtml: true)
    }
}
`;
