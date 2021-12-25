const Discord = require("discord.js");
const ms = require("ms");
module.exports = {
    name: 'stats',
    description: 'shows basic bot statistics.',
    usage: '&{prefix}statistics',
    aliases: ["statistics"],
    permissions: ['SEND_MESSAGES', "READ_MESSAGE_HISTORY","EMBED_LINKS" ],
    async execute(message, args, bot, Discord, prefix) {
        let members = 0;
        bot.guilds.cache.map(g=>members+=g.memberCount)
        let embed = new Discord.MessageEmbed()
        .setTitle(`${bot.user.username}'s Statistics`)
        .setColor("RED")
        .setDescription(`📊 General Stats\n\`• Servers: ${bot.guilds.cache.size}\`\n\`• Members: ${members}\`\n\`• Discord.js: ${Discord.version}\`\n\`• Nodejs: ${process.version}\`\n\`• Platform: ${process.platform}\`\
\n\`• Uptime: ${ms(bot.uptime)}\``)
        .setTimestamp()
        .setFooter(`Requested by ${message.author.tag}`);
        message.channel.send({embeds:[embed]});
    }
}
