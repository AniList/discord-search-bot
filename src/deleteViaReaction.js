async function deleteViaReaction(
    commandMessage,
    responseEmbed,
    responseUrlMessage,
    client
) {
    // Create the initial reaction
    const reaction = await responseEmbed.react("❌");

    // Wait 20 seconds before giving up
    const reactionFilter = (reaction, user) =>
        reaction.emoji.name === "❌" && user.id === commandMessage.author.id;
    const reactionCollector = responseEmbed.createReactionCollector(
        reactionFilter,
        { time: 20000 }
    );

    // Delete the message if we 'collect' (Filter is successful)
    reactionCollector.once("collect", reaction => {
        reaction.message.delete();
        if (responseUrlMessage) responseUrlMessage.delete();
    });

    // When the time is up, remove the bots reaction to the post
    reactionCollector.once("end", () => {
        if (!reaction.message.deleted) {
            try {
                reaction.remove(client.user);
            } catch (e) {
                // Manage Messages permissions not enabled
            }
        }
    });
}

module.exports = deleteViaReaction;
