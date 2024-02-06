import api from "../../api";
import query from "./query";
import discordMessage from "../../discordMessage";
import { SlashCommandBuilder } from "discord.js";

function capitalize(str: string) {
    return str
        .split("_")
        .map(
            word =>
                word.charAt(0).toUpperCase() + word.substring(1).toLowerCase()
        )
        .join(" ");
}

export const data = new SlashCommandBuilder()
    .setName("manga").setDescription("Search for a manga")
    .addStringOption(option => option.setName("search").setDescription("The manga to search for").setRequired(true));

export async function execute(interaction: any) {
    const searchArg = interaction.options.getString("search");

    try {
        const response = await search(searchArg, "MANGA");

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

async function search(searchArg: string, type: any) {
    const response = await api(query, {
        search: searchArg,
        type
    });

    if (response.error)
        throw new Error(response.error);

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
        footer: footer,
        title: "Manga",
    });
};
