const api = require('../api');
const query = require('./query');
const discordMessage = require('../discordMessage');

const search = async (searchArg, type) => {
    const response = await api(query, {
        search: searchArg,
        type
    });

    if (response.error) {
        return response;
    }

    const data = response.Media;

    return discordMessage({
        name: data.title.romaji,
        url: data.siteUrl,
        imageUrl: data.coverImage.large,
        description: data.description,
        score: data.averageScore,
        status: data.status
    })
}

module.exports = {
    search
};
