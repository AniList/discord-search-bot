
async function deleteViaReaction(commandMessage, responseMessage, client) {
    const reactionFilter = (reaction, user) => {
        // Type coercion is on purpose.
        if (reaction.emoji.id != "472490448016113675")
            return false;

        const member = responseMessage.guild.fetchMember(user)

        // hasPermission docs: https://discord.js.org/#/docs/main/stable/class/GuildMember?scrollTo=hasPermission
        // Check to see if they have delete messages permission or is the user who issued the command.
        if (!(member.hasPermission("MANAGE_MESSAGES", false, true, true)) || user.id !== commandMessage.author.id)
            return false;

        return true;
    };

    const flippityFlappingFuck = await responseMessage.react("472490448016113675");
    // Wait 2 minutes before giving up
    const reactionCollector = responseMessage.createReactionCollector(reactionFilter, { time: 2 * 60 * 60 });
    // Delete the message if we 'collect' (Filter is successful)
    reactionCollector.once("collect", reaction => { reaction.message.delete() });
    // When the time is up, remove the bots reaction to the post
    reactionCollector.once("end", collected => { flippityFlappingFuck.remove(client.user) } );
}

module.exports = deleteViaReaction;
