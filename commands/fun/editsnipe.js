const Discord = require("discord.js")
const { SlashCommandBuilder } = require('@discordjs/builders');
async function main(bot, channel) {
    let msg = bot.editSnipes.get(channel);
    if (msg) { 
        let editSnipEMbed = new Discord.MessageEmbed()
            .setColor("#00dfad")
            .setAuthor({name: `${msg.author}`, iconURL: msg.avatar})
            .addFields(
                {
                    name: "Old Message" ,value: msg.oldContent!=""?msg.oldContent:"[NA]"
                },
                {
                    name: "New Message" ,value: msg.newContent!=""?msg.newContent:"[NA]"
                }
            )
            .setFooter({text: `Message Edited`})
            .setTimestamp(msg.time);
        return editSnipEMbed;
    }
    else {
        return (
            new Discord.MessageEmbed()
                .setColor("#00dfad")
                .setDescription("No edited message in this channel.")
                .setTimestamp()
            );
    }
}
module.exports = {
    name: 'editsnipe',
    usage: '&{prefix}editsnipe',
    description: 'shows last edited message in that channel',
    aliases: [],
    permissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
    async execute(message, args, bot, Discord, prefix) {
       
        message.channel.send({embeds: [await main(bot, message.channel.id)]});
    },
    slash: new SlashCommandBuilder()
        .setName("editsnipe")
        .setDescription("See the last edited message in that channel."),
    async slashExecute(interaction) {
        interaction.reply({embeds:[await main(interaction.client,interaction.channel.id)]})
    }
}
