const Discord = require("discord.js")
const { SlashCommandBuilder } = require('@discordjs/builders');
async function main(bot, channel) {
    let msg = bot.snipes.get(channel);
    if (msg) { 
        let snipEmbed = new Discord.MessageEmbed()
            .setColor("#ff2052")
            .setAuthor({name: `${msg.author}`, iconURL: msg.avatar})
            .setDescription(msg.content)
            .setImage(msg.image?msg.image:null)
            .setFooter({text: `Message Deleted`})
            .setTimestamp(msg.time);
        return snipEmbed;
    }
    else {
        return (
            new Discord.MessageEmbed()
                .setColor("#00dfad")
                .setDescription("No deleted message in this channel.")
                .setTimestamp()
            );
    }
}module.exports = {
    name: 'snipe',
    
    description: 'shows last deleted message in that channel',
    aliases: [],
    permissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
    async execute(message, args, bot, Discord, prefix) {
       message.channel.send({embeds: [await main(bot, message.channel.id)]});
    },
    slash: new SlashCommandBuilder()
        .setName("snipe")
        .setDescription("See the last deleted message in that channel."),
    async slashExecute(interaction) {
        interaction.reply({embeds:[await main(interaction.client,interaction.channel.id)]})
    }
}
