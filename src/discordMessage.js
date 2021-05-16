const TurndownService = require("turndown");
const turndownService = new TurndownService();
const anilistLogo = "https://anilist.co/img/logo_al.png";

turndownService.remove("span");

const shorten = str => {
    const markdown = turndownService.turndown(str);
    if (markdown.length > 400) {
        return markdown.substring(0, 400) + "...";
    } else {
        return markdown;
    }
};

const discordMessage = ({
    name,
    url,
    imageUrl,
    description,
    footer,
    title
} = {}) => {
    return {
        title: title,
        author: {
            name: name,
            url: url,
            icon_url: anilistLogo
        },
        thumbnail: {
            url: imageUrl
        },
        description: shorten(description),
        footer: {
            text: footer
        }
    };
};

module.exports = discordMessage;
