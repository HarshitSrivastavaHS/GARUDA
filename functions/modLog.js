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
      ModEmbed.addField("Attachments", message.attachments.map(a=>`[${a.name}](${a.url})`).join(", "))
    modChannel.send(ModEmbed);
  })

  bot.on("messageUpdate", (oldMessage, message)=>{
    if (message.author.bot) return;
    let ml = bot.serverConfig.get(message.guild.id)?bot.serverConfig.get(message.guild.id).modLog:undefined;
	  if (!ml) return; 
		let modChannel = message.guild.channels.cache.get(ml);
		if (!ml) return;
    let desc = split(`Old Message: ${oldMessage.content}\n+New Message: ${message.content}`);
		let ModEmbed = new Discord.MessageEmbed()
      .setColor("RED")
      .setTimestamp()
      .setAuthor(message.author.tag, message.author.displayAvatarURL())
      .setTitle(`Message Edited in ${message.channel.name}`)
      .setFooter(`User ID: ${message.author.id}`)

    if(Array.isArray(desc)) {
        if (desc.length > 1) {
          ModEmbed.setDescription(desc[0])
          .addField('\u200b', desc[1].substring(0,1024));
          if (desc[1].length>1024) 
          ModEmbed.addField('\u200b', desc[1].substring(1025, desc.length));
        }
        else {
          ModEmbed.setDescription(desc[0])
        }
      }
      
    return modChannel.send(ModEmbed);
    
    function split(content) {
        return Discord.Util.splitMessage(content, {
          maxLength : 2048
        });
      }
  })
}
