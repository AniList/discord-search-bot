const api = require('../api');
const query = require('./query');
var toMarkdown = require('to-markdown');

const search = async (searchArg) => {
    const response = await api(query, {
        search: searchArg
    });

    if (response.error) {
        return response;
    }

    return toDiscordObject(response.User);
}

const toDiscordObject = (user) => {
    let daysWatched = '';
    const chaptersRead = user.stats.chaptersRead != 0 ? `Chapters read: ${user.stats.chaptersRead} ` : '';

    if (user.stats.watchedTime != 0) {
        daysWatched = (user.stats.watchedTime / (60 * 24)).toFixed(1);
        daysWatched = `Days watched: ${daysWatched} `;
    }

    return {
        title: user.name,
        url: user.siteUrl,
        thumbnail: {
            url: user.avatar.large,
        },
        description: toMarkdown(user.about).substring(0, 300) + '...',
        footer: {
            text: daysWatched + chaptersRead
        }
    }
}

module.exports = {
    search
};
