const api = require('../api');
const query = require('./query');
const toMarkdown = require('to-markdown');

const search = async (searchArg) => {
    const response = await api(query, {
        search: searchArg,
    });

    if (response.error) {
        return response;
    }

    return toDiscordObject(response.Character);
}

const toDiscordObject = (character) => {
    return {
        title: `${character.name.first} ${character.name.last}`,
        url: character.siteUrl,
        thumbnail: {
            url: character.image.large,
        },
        description: toMarkdown(character.description).substring(0, 400) + '...',
    }
}

module.exports = {
    search
};
