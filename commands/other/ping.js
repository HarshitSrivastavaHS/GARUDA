const Discord = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    name: 'ping',
    description: 'This is the ping command',
    permissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
    aliases: [],
    async execute(message, args, bot, Discord, prefix) {
        
      const cnt = new Date().getTime();
      const ping = cnt - message.createdAt;
     var icon = bot.user.displayAvatarURL(); 
      const embed = new Discord.MessageEmbed()
      .setColor("#FFC0CB")
      .setThumbnail(`${icon}`)
      .setTitle("🏓Pong.")
      .setDescription(`Your ping is ${ping} ms\nLatency is ${bot.ws.ping} ms`)
      message.channel.send({embeds:[embed]})
    },
    slash: new SlashCommandBuilder()
	    .setName('ping')
	    .setDescription('Pong!!'),
    async slashExecute(interaction) {
      const cnt = new Date().getTime();
      const ping = cnt - interaction.createdAt;
      var icon = interaction.client.user.displayAvatarURL(); 
      const embed = new Discord.MessageEmbed()
      .setColor("#FFC0CB")
      .setThumbnail(`${icon}`)
      .setTitle("🏓Pong.")
      .setDescription(`Your ping is ${ping} ms\nLatency is ${interaction.client.ws.ping} ms`)
      interaction.reply({embeds: [embed]});
    }
}
