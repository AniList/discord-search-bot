import api from "../../api";
import query from "./query";
import discordMessage from "../../discordMessage";
import { SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
    .setName("staff").setDescription("Search for a staff member")
    .addStringOption(option => option.setName("search").setDescription("The staff member to search for").setRequired(true));

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

    const data = response.Staff;

    let name = data.name.first;
    if (data.name.last != null) {
        name += ` ${data.name.last}`;
    }

    return discordMessage({
        name: name,
        url: data.siteUrl,
        imageUrl: data.image.large,
        description: data.description,
        footer: "Anilist",
        title: "Staff",
    });
};
