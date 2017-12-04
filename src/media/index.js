const api = require('../api');
const query = require('./query');
var toMarkdown = require('to-markdown');

const search = async (searchArg, type) => {
    const response = await api(query, {
        search: searchArg,
        type
    });

    if (response.error) {
        return response;
    }

    return toDiscordObject(response.Media);
}

const toDiscordObject = (media) => {
    const score = media.averageScore != null ? `Score: ${media.averageScore}% ` : '';
    const status = media.averageScore != null ? `Status: ${media.status.toLowerCase()} ` : '';

    return {
        title: media.title.romaji,
        url: media.siteUrl,
        thumbnail: {
            url: media.coverImage.large,
        },
        description: toMarkdown(media.description).substring(0, 400) + '...',
        footer: {
            text: score + status
        }
    }
}

module.exports = {
    search
};
