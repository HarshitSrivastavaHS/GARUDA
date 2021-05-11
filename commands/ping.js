const Discord = require('discord.js')
module.exports = {
    name: 'ping',
    description: 'This is the ping command',
    permissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
    aliases: [],
    async execute(message, args, bot, Discord, prefix) {
        let botPerms = [];
        let missingPerms = [];
        this.permissions.forEach(p=>{
            botPerms.push(message.channel.permissionsFor(bot.user).has(p));
            if (!(message.channel.permissionsFor(bot.user).has(p)))
                missingPerms.push(p);
        })
        missingPerms = missingPerms.join("\n");
        if (botPerms.includes(false)) return message.channel.send(`The Following permissions which are missing are needed by the bot for this command:\n\n\`\`\`\n${missingPerms.replace("_"," ")}\`\`\``).catch(err=>console.log(`Missing send message permission in a server.`));
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
