const api = require("../api");
const query = require("./query");
const discordMessage = require("../discordMessage");

const capitalize = str =>
    str
        .split("_")
        .map(
            word =>
                word.charAt(0).toUpperCase() + word.substring(1).toLowerCase()
        )
        .join(" ");

const search = async (searchArg, type) => {
    const response = await api(query, {
        search: searchArg,
        type
    });

    if (response.error) {
        return response;
    }

    const data = response.Media;
    const { averageScore: score, status } = data;

    const scoreString = score != null ? `Score: ${score}%` : "";
    const statusString = status != null ? `Status: ${capitalize(status)}` : "";

    let footer = "";
    // Use the en quad space after score to not get stripped by Discord
    if (score) footer += scoreString + "  ";
    if (status) footer += statusString;

    return discordMessage({
        name: data.title.romaji,
        url: data.siteUrl,
        imageUrl: data.coverImage.large,
        description: data.description,
        footer: footer
    });
};

module.exports = {
    search
};
