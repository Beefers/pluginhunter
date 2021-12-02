import { Client, Intents, MessageEmbed, MessageButton, MessageActionRow } from "discord.js";
import fetch from "node-fetch";
import config from "./config.js";

export const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

client.once("ready", () => {
    console.log("[Client] Ready!");

    client.on("messageCreate", async (message) => {
        if (message.author.bot) return;
        const matches = message.content.match(new RegExp(/\[\[.*?\]\]/g));
        if (!matches) return;

        const matchesMap = matches.map((s) => s.substring(2, s.length - 2).toLowerCase());

        const plugins = await fetch(
            "https://cumcordplugins.github.io/Condom/plugins-large.json"
        ).then((res) => res.json());
        const foundEmbeds = [];

        for (const plugin of plugins) {
            if (matchesMap.includes(plugin.name.toLowerCase())) {
                foundEmbeds.push(
                    new MessageEmbed()
                        .setColor("WHITE")
                        .setTitle(plugin.name)
                        .setURL(`https://send.cumcord.com/#${plugin.url}`)
                        .addField("Description", plugin.description)
                        .addField("Author", plugin.author, true)
                        .addField("License", plugin.license, true)
                        .setFooter("Psst! You can click the title to install the plugin!")
                );
            }
        }
        message.reply({ embeds: foundEmbeds });
    });
});

client.login(config.token);
