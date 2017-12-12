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

    const data = response.Character;

    let name = data.name.first;
    if (data.name.last != null) {
        name += ` ${data.name.last}`;
    }

    return discordMessage({
        name: name,
        url: data.siteUrl,
        imageUrl: data.image.large,
        description: data.description
    });
};

module.exports = {
    search
};
