import { APIEmbed, Colors, EmbedBuilder, HexColorString } from "discord.js";
import TurndownService from "turndown";

const turndownService = new TurndownService();
const anilistLogo = "https://anilist.co/img/logo_al.png";

turndownService.remove("span");

function shorten(str: string) {
    const markdown = turndownService.turndown(str);
    if (markdown.length > 400)
        return markdown.substring(0, 400) + "...";
    return markdown;
};

export type DiscordEmbedOptions = {
    name: string;
    url: string;
    imageUrl: string;
    description: string;
    footer: string;
    title: string;
    color?: HexColorString;
};

export default function discordEmbed(options: DiscordEmbedOptions): APIEmbed {
    return new EmbedBuilder()
        .setTitle(options.title)
        .setAuthor({
            name: options.name,
            url: options.url,
            iconURL: anilistLogo
        })
        .setThumbnail(options.imageUrl)
        .setDescription(shorten(options.description))
        .setFooter({
            text: options.footer
        })
        .setColor(options.color ?? "#344700")
        .toJSON();
}
