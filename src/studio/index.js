const api = require('../api');
const query = require('./query');
const toMarkdown = require('to-markdown');

const search = async (searchArg) => {
    const response = await api(query, {
        search: searchArg
    });

    if (response.error) {
        return response;
    }

    return toDiscordObject(response.Studio);
}

const toDiscordObject = (studio) => {
    let anime = 'Popular Anime: <br>';

    studio.media.nodes.map(media => {
        anime += `
            <a href='${media.siteUrl}'>${media.title.romaji}</a> <br>
        `;
    });

    return {
        title: studio.name,
        url: studio.siteUrl,
        description: toMarkdown(anime),
    }
}

module.exports = {
    search
};
