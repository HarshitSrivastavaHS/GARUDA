module.exports = {
    name: 'partners',
    
    usage: '&{prefix}partners',
    description: 'Shows all the partners.',
    aliases: ["partner", "partnership"],
    permissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
    async execute(message, args, bot, Discord, prefix) {
      const partners = [
        {
          name: "Aeona",
          linkName: "Bot Invite (Admin)",
          link: "https://discord.com/api/oauth2/authorize?client_id=919244474029334548&permissions=8&scope=applications.commands%20bot"
        }
      ];
      const partnershipEmbed = new Discord.MessageEmbed()
      .setColor("#e52165")
      .setThumbnail(bot.user.displayAvatarURL({dynamic: true, size: 4096})
      .setAuthor({name: message.author.tag, iconURL: message.author.displayAvatarURL({dynamic: true, size: 4096})})
      .setTitle("Our Partners")
      .setTimestamp();
      for (let partner of partners) {
        partnershipEmbed.addField(`${partner.name}`, `[${partner.linkName}](${partner.link})`);
      }
      message.channel.send({embeds:[partnershipEmbed]});
    }
}
