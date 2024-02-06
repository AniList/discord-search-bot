import api from "../../api";
import query from "./query";
import discordMessage from "../../discordMessage";
import striptags from "striptags";
import { SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
    .setName("user")
    .setDescription("Search for a user")
    .addStringOption(option =>
        option
            .setName("search")
            .setDescription("The user to search for")
            .setRequired(true)
    );

export async function execute(interaction: any) {
    const searchArg = interaction.options.getString("search");

    try {
        const response = await search(searchArg);

        await interaction.reply({
            embeds: [response],
            ephemeral: true
        });
    } catch (error: any) {
        await interaction.reply({
            content: error.message,
            ephemeral: true
        });
    }
}

async function search(searchArg: string) {
    const response = await api(query, {
        search: searchArg
    });

    if (response.error)
        throw new Error(response.error);

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
        footer: footer,
        title: "User"
    });
};
