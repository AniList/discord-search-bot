import { REST, Routes } from 'discord.js';
import loadCommands from './command.loader';

const commands = (await loadCommands()).map((command: any) => command.data.toJSON());

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(process.env.TOKEN ?? "null");

// and deploy your commands!
(async () => {
    try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);

        if (!process.env.CLIENT_ID || process.env.CLIENT_ID.length === 0) {
            console.log('No client ID found. Please ensure the CLIENT_ID environment variable is set.');
            return;
        }

        let data: any = null;

        if (!process.env.GUILD_ID || process.env.GUILD_ID.length === 0) {
            data = await rest.put(
                Routes.applicationCommands(process.env.CLIENT_ID ?? ""),
                { body: commands },
            );
        } else {
            data = await rest.put(
                Routes.applicationGuildCommands(process.env.CLIENT_ID ?? "", process.env.GUILD_ID ?? ""),
                { body: commands },
            );
        }

        console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
        // And of course, make sure you catch and log any errors!
        console.error(error);
    }
})();