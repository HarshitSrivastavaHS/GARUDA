const Discord = require('discord.js')
module.exports = {
    name: 'ping',
    description: 'This is the ping command',
    async execute(message, args, bot, Discord, prefix) {
      const cnt = new Date().getTime();
      const ping = cnt - message.createdAt;
     var icon = message.guild.iconURL() 
      const embed = new Discord.MessageEmbed()
      .setColor("#FFC0CB")
      .setThumbnail(`${icon}`)
      .setTitle("🏓Pong.")
      .setDescription(`Your ping is ${ping} ms\n Latency is ${bot.ws.ping} ms`)
      message.channel.send(embed)
    }
}
