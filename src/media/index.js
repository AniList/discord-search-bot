const api = require('../api');
const query = require('./query');
const toMarkdown = require('to-markdown');

const anilistLogo = "https://anilist.co/img/logo_al.png";
const capitalize = str => str.charAt(0).toUpperCase() + str.substring(1).toLowerCase();

const shorten = str => {
    const markdown = toMarkdown(str);
    if (markdown.length > 400) {
        return markdown.substring(0, 400) + '...'
    } else {
        return markdown;
    }
}

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
    const score = media.averageScore != null ? `Score: ${media.averageScore}%` : '';
    const status = media.averageScore != null ? `Status: ${capitalize(media.status)}` : '';

    return {
        author: {
            name: media.title.romaji,
            url: media.siteUrl,
            icon_url: anilistLogo
        },
        thumbnail: {
            url: media.coverImage.large,
        },
        description: shorten(media.description),
        footer: {
            // Use the en quad space after score to not get stripped by Discord
            text: `${score}  ${status}`
        }
    }
}

module.exports = {
    search
};
