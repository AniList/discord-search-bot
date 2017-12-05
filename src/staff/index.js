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

    return toDiscordObject(response.Staff);
}

const toDiscordObject = (staff) => {
    let name = staff.name.first;
    if (staff.name.last != null) {
        name += ` ${staff.name.last}`;
    }

    return {
        title: name,
        url: staff.siteUrl,
        thumbnail: {
            url: staff.image.large,
        },
        description: toMarkdown(staff.description).substring(0, 400) + '...',
    }
}

module.exports = {
    search
};
