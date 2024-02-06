import api from "../../api";
import query from "./query";
import discordMessage from "../../discordMessage";
import { SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
    .setName("studio").setDescription("Search for a studio")
    .addStringOption(option => option.setName("search").setDescription("The studio to search for").setRequired(true));

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

    const data = response.Studio;
    let anime = "";
    data.media.nodes.map((media: any) => {
        anime += `
            <a href='${media.siteUrl}'>${media.title.romaji}</a> <br>
        `;
    });

    return discordMessage({
        title: "Popular Anime",
        name: data.name,
        url: data.siteUrl,
        description: anime,
        footer: "Anilist",
        imageUrl: data.siteUrl,
    });
};
