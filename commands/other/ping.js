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
    async slashExecute(interaction) {
      const cnt = new Date().getTime();
      const ping = cnt - interaction.createdAt;
      interaction.reply(`Your Ping: ${ping} ms\nMy Latency: ${interaction.client.ws.ping} ms`);
    }
}
