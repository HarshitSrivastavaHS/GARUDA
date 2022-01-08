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
      .setAuthor(`${message.author.tag}`, `${message.author.displayAvatarURL({dynamic: true})}`)
      .setTitle("Our Partners")
      .setFooter("Bot by TechAllByHarshit#1503")
      .setTimestamp();
      for (let partner of partners) {
        partnershipEmbed.addField(`${partner.name}`, `[${partner.linkName}](${partner.link})`);
      }
      message.reply({embeds:[partnershipEmbed]});
    }
}
