import "dotenv/config";

import { Client, Events } from "discord.js";
import type { DCommand } from "./types/DCommand";

const client = new Client({ intents: [] });
import loadCommands from "./command.loader";

client.on("ready", () => {
    if (process.env.DEPLOY_COMMANDS === "1") {
        console.log("Deploying commands...");
        import("./deploy.commands")
    }

    // This event will run if the bot starts, and logs in, successfully.
    console.log(
        `Bot has started, with ${client.users.cache.size} users, in ${client.channels.cache.size} channels of ${client.guilds.cache.size} guilds.`
    );
    console.log(
        `\nAdd the bot to your server here:\nhttps://discordapp.com/oauth2/authorize?client_id=${client.user?.id}&scope=bot&permissions=1024`
    );
});

const commands: DCommand[] = await loadCommands();

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command: DCommand | undefined = commands.find((command: any) => command.data.name === interaction.commandName);

    if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
        } else {
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    }
});

client.login(process.env.TOKEN);
