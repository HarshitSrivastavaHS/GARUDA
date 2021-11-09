module.exports = {
    name: 'partners',
    type: 'info',
    usage: '&{prefix}partners',
    description: 'Shows all the partners.',
    aliases: ["partner", "partnership"],
    permissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
    async execute(message, args, bot, Discord, prefix) {
      const partners = [
        {
          name: "Luminous",
          linkName: "Bot Invite (Admin)",
          link: "https://discord.com/oauth2/authorize?client_id=776079305675374642&permissions=8&scope=bot"
        },
        {
          name: "Dumbot",
          linkName: "Bot Invite",
          link: "https://discord.com/oauth2/authorize?client_id=870239976690970625&permissions=0&scope=bot"
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
