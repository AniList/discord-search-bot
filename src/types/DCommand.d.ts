import { CommandInteraction, SlashCommandBuilder } from "discord.js"

export type DCommand = {
    data: SlashCommandBuilder;
    execute: (interaction: CommandInteraction) => Promise<void>;
}