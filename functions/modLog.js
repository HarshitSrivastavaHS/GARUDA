 module.exports = async (bot, Discord) => {

  bot.on("messageDelete", (message)=>{
    if (message.author.bot) return;
    let ml = bot.serverConfig.get(message.guild.id)?bot.serverConfig.get(message.guild.id).modLog:undefined;
	  if (!ml) return; 
		let modChannel = message.guild.channels.cache.get(ml);
		if (!ml) return;
		let ModEmbed = new Discord.MessageEmbed()
      .setColor("RED")
      .setTimestamp()
      .setAuthor(message.author.tag, message.author.displayAvatarURL())
      .setDescription(`${message.content}`)
      .setTitle(`Message Deleted in ${message.channel.name}`)
      .setFooter(`User ID: ${message.author.id}`)
      .setImage(message.attachments.first()?message.attachments.first().proxyURL:null);
    if (message.attachments.first())
      ModEmbed.addField("Attachments", message.attachments.map(a=>`[Attachment](${a.proxyURL})`).join(", "))
    modChannel.send(ModEmbed);
  })
}
