const Discord = require('discord.js');
const config = require('./config.json');

const character = require('./character');
const media = require('./media');
const staff = require('./staff');
const user = require('./user');
const studio = require('./studio');

const client = new Discord.Client();

client.on('ready', () => {
    // This event will run if the bot starts, and logs in, successfully.
    console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`);
});

client.on('message', async message => {
    // Ignore other bot messages
    if (message.author.bot && message.author.username != 'irc') {
        return;
    }

    // Remove irc username suffix
    const messageContent = message.content.replace(/<.*> /, '');

     // Ensure the message starts with our prefix
    if (messageContent.indexOf(config.prefix) !== 0) {
        return;
    }

    let args = messageContent.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    args = args.join(' ');

    let response = null;

    switch (command) {
        case 'help':
            response = help;
            break;

        case 'a':
        case 'anime':
            response = await media.search(args, 'ANIME');
            break;

        case 'm':
        case 'manga':
            response = await media.search(args, 'MANGA');
            break;

        case 'c':
        case 'character':
            response = await character.search(args);
            break;

        case 'p':
        case 'person':
        case 'staff':
            response = await staff.search(args);
            break;

        case 's':
        case 'studio':
            response = await studio.search(args);
            break;

        case 'u':
        case 'user':
            response = await user.search(args);
            break;
    }

    if (response.error) {
        message.channel.send(response.error.message);
        return;
    }

    if (response.url) {
        message.channel.send(`<${response.url}>`);
    }

    message.channel.send({
        embed: {
            ...response,
            color: 3447003
        }
    });
});

const help = {
    title: 'Commands',
    description: `
Search anime: !a or !anime <anime title>
Search manga: !m or !manga <manga title>
Search character: !c or !character <character name>
Search staff: !p or !person or !staff <staff name>
Search studio: !s or !studio <studio name>
Search user: !u or !user <user name>
GitHub: https://github.com/joshstar/AniList-Discord-Bot`
};

client.login(config.token);
