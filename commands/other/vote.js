const Discord = require("discord.js");
const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
    name: 'vote',
    usage: '&{prefix}vote',
    description: 'support the bot by voting for the bot.',
    aliases: [],
    permissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
    async execute(message, args, bot, Discord, prefix) {
        
        
       const emb = new Discord.MessageEmbed()
        .setColor("PURPLE")
        .setTitle("Vote for GARUDA")
        .setDescription("Thank you for using this command. You can vote for Garuda on Top.gg and Discord Bot List.\nYou can vote for the bot every 12 hours!.")
        .addField(`**Top.gg**`, `**[Vote Now!](https://top.gg/bot/777840690515279872/vote)**`)
        .addField(`**Discord Bot List**`, `**[Vote Now!](https://discordbotlist.com/bots/garuda/upvote)**`)
        .setThumbnail(message.author.displayAvatarURL())
        .setTimestamp()
        .setFooter("Thank You!");
       message.channel.send({embeds:[emb]});
    },
    slash: new SlashCommandBuilder()
	    .setName('vote')
	    .setDescription('Vote for the bot!'),
    async slashExecute(interaction) {
      await interaction.deferReply()
      const emb = new Discord.MessageEmbed()
        .setColor("PURPLE")
        .setTitle("Vote for GARUDA")
        .setDescription("Thank you for using this command. You can vote for Garuda on Top.gg and Discord Bot List.\nYou can vote for the bot every 12 hours!.")
        .addField(`**Top.gg**`, `**[Vote Now!](https://top.gg/bot/777840690515279872/vote)**`)
        .addField(`**Discord Bot List**`, `**[Vote Now!](https://discordbotlist.com/bots/garuda/upvote)**`)
        .setThumbnail(message.author.displayAvatarURL())
        .setTimestamp()
        .setFooter("Thank You!");
      interaction.editReply({embeds:[emb]});
    }
}
