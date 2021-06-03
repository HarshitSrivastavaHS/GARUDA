 module.exports = async (bot, Discord) => {

  bot.on("messageDelete", (message)=>{
    let ml = bot.serverConfig.get(message.guild.id)?bot.serverConfig.get(message.guild.id).ml:undefined;
	  if (!ml) return; 
		let modChannel = message.guild.channels.cache.get(ml);
		if (!ml) return;
		let ModEmbed = new Discord.MessageEmbed()
      .setColor("RED")
      .setTimestamp()
      .setAuthor(message.author.tag, message.author.displayAvatarURL())
      .setDescription(`${message.content}`)
      .setTitle("MESSAGE DELETED")
      .setFooter(`USER ID: ${message.author.id}`)
      .setImage(message.attachments.first()?message.attachments.map(a=>a.proxyURL).join("\n"):null);
    modChannel.send(ModEmbed);
  })
}
