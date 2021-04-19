require("dotenv").config();
const Discord = require("discord.js");

const character = require("./character");
const media = require("./media");
const staff = require("./staff");
const user = require("./user");
const studio = require("./studio");

const client = new Discord.Client({ disableMentions: "everyone" });

const deleteViaReaction = require("./deleteViaReaction");

// Use exclamation mark as the default prefix
const prefix = process.env.PREFIX || "!";

client.on("ready", () => {
    // This event will run if the bot starts, and logs in, successfully.
    console.log(
        `Bot has started, with ${client.users.cache.size} users, in ${client.channels.cache.size} channels of ${client.guilds.cache.size} guilds.`
    );
    console.log(
        `\nAdd the bot to your server here:\nhttps://discordapp.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=1024`
    );
});

client.on("message", async message => {
    const messageContent = message.content;

    // Ensure the message starts with our prefix
    if (messageContent.indexOf(prefix) !== 0) {
        return;
    }

    let args = messageContent
        .slice(prefix.length)
        .trim()
        .split(/ +/g);
    const command = args.shift().toLowerCase();
    args = args.join(" ");

    let response = null;

    switch (command) {
        case "help":
            response = help;
            break;

        case "a":
        case "anime":
            response = await media.search(args, "ANIME");
            break;

        case "m":
        case "manga":
            response = await media.search(args, "MANGA");
            break;

        case "c":
        case "character":
            response = await character.search(args);
            break;

        case "p":
        case "person":
        case "staff":
            response = await staff.search(args);
            break;

        case "s":
        case "studio":
            response = await studio.search(args);
            break;

        case "u":
        case "user":
            response = await user.search(args);
            break;
    }

    if (response === null) return;

    if (response.error) {
        message.channel.send(response.error.message);
        return;
    }

    let replyUrl;
    if (response.author && response.author.url) {
        replyUrl = message.channel.send(`<${response.author.url}>`);
    }

    const replyEmbed = message.channel.send({
        embed: {
            ...response,
            color: 3447003
        }
    });

    if (command !== "help") {
        deleteViaReaction(
            message,
            await replyEmbed,
            replyUrl ? await replyUrl : replyUrl,
            client
        );
    }
});

const help = {
    title: "Commands",
    description: `
Search anime: !a or !anime <anime title>
Search manga: !m or !manga <manga title>
Search character: !c or !character <character name>
Search staff: !p or !person or !staff <staff name>
Search studio: !s or !studio <studio name>
Search user: !u or !user <user name>

GitHub: https://github.com/AniList/AniList-Discord-Bot`
};

client.login(process.env.TOKEN);
