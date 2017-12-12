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

const discordMessage = ({ name, url, imageUrl, description, score, status, title } = {}) => {
    const scoreString = score != null ? `Score: ${score}%` : '';
    const statusString = status != null ? `Status: ${capitalize(status)}` : '';

    return {
        title: title,
        fields: fields,
        author: {
            name: name,
            url: url,
            icon_url: anilistLogo
        },
        thumbnail: {
            url: imageUrl,
        },
        description: shorten(description),
        footer: {
            // Use the en quad space after score to not get stripped by Discord
            text: score || status ? `${scoreString}  ${statusString}` : null
        }
    }
}

module.exports = discordMessage;
