const api = require("../api");
const query = require("./query");
const discordMessage = require("../discordMessage");
const striptags = require("striptags");

const search = async searchArg => {
    const response = await api(query, {
        search: searchArg
    });

    if (response.error) {
        return response;
    }

    const data = response.User;
    const watchedTime = data.statistics.anime.minutesWatched;
    const chaptersRead = data.statistics.manga.chaptersRead;

    const chaptersString =
        chaptersRead != 0 ? `Chapters read: ${chaptersRead} ` : "";

    let daysWatched = "";
    if (watchedTime != 0) {
        daysWatched = (watchedTime / (60 * 24)).toFixed(1);
        daysWatched = `Days watched: ${daysWatched}`;
    }

    let footer = "";
    // Use the en quad space after score to not get stripped by Discord
    if (watchedTime) footer += daysWatched + "  ";
    if (chaptersRead) footer += chaptersString;

    return discordMessage({
        name: data.name,
        url: data.siteUrl,
        imageUrl: data.avatar.large,
        description: striptags(data.about),
        footer: footer
    });
};

module.exports = {
    search
};
