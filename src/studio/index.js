const api = require("../api");
const query = require("./query");
const discordMessage = require("../discordMessage");

const search = async searchArg => {
    const response = await api(query, {
        search: searchArg
    });

    if (response.error) {
        return response;
    }

    const data = response.Studio;
    let anime = "";
    data.media.nodes.map(media => {
        anime += `
            <a href='${media.siteUrl}'>${media.title.romaji}</a> <br>
        `;
    });

    return discordMessage({
        title: "Popular Anime",
        name: data.name,
        url: data.siteUrl,
        description: anime
    });
};

module.exports = {
    search
};
