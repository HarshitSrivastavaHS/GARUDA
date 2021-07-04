const Discord = require('discord.js')
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
      message.channel.send(embed)
    }
}
