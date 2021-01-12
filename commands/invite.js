module.exports = {
    name: 'invite',
    usage: '&{prefix}invite',
    description: 'gives bot\'s invite link',
    async execute(message, args, bot, Discord, prefix) {
      const em = new Discord.MessageEmbed()
      .setTitle("Want to add me to your server? Use the link below!")
      .setColor("BLUE")
      .addFields({
        name: "Invite me", value: "https://www.bit.ly/GARUDA-BOT"
      })
      .setThumbnail(bot.user.displayAvatarURL({size: 4096}));
      message.channel.send(em);
    }
}
