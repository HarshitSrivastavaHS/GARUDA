 module.exports = async (bot, Discord) => {

  /* WHEN MESSAGE IS DELETED */
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

  /* WHEN MESSAGE IS EDITED */
  bot.on("messageUpdate", (oldMessage, message)=>{
    if (message.author.bot) return;
    if (oldMessage.content == message.content) return;
    let ml = bot.serverConfig.get(message.guild.id)?bot.serverConfig.get(message.guild.id).modLog:undefined;
	  if (!ml) return; 
		let modChannel = message.guild.channels.cache.get(ml);
		if (!ml) return;
    let desc = split(`Old Message: ${oldMessage.content}\n+New Message: ${message.content}`);
		let ModEmbed = new Discord.MessageEmbed()
      .setColor("YELLOW")
      .setTimestamp()
      .setAuthor(message.author.tag, message.author.displayAvatarURL())
      .setTitle(`Message Edited in ${message.channel.name}`)
      .setFooter(`User ID: ${message.author.id}`)

    if(Array.isArray(desc)) {
        if (desc.length > 1) {
          ModEmbed.setDescription(desc[0])
          .addField('\u200b', desc[1].substr(0,1024));
          if (desc[1].length>1024) 
          ModEmbed.addField('\u200b', desc[1].substr(1025, desc[1].length));
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

  /* WHEN MESSAGES ARE DELETED IN BULK */
  bot.on("messageDeleteBulk", (messages)=>{
    console.log([Object.keys(messages)[0]])
    return;
    let channel = messages[Object.keys(messages)[0]].channel;
    let ml = bot.serverConfig.get(channel.guild.id)?bot.serverConfig.get(channel.guild.id).modLog:undefined;
	  if (!ml) return; 
		let modChannel = channel.guild.channels.cache.get(ml);
		if (!ml) return;
    console.log(messages.size);
    let users = [];
    messages.map(m=>users.push(m.author.tag))
    users = new Set(users)
    console.log(users)
		let ModEmbed = new Discord.MessageEmbed()
      .setColor("RED")
      .setTimestamp()
      .setDescription(`Total Messages Deleted: ${messages.size}\nMessages were sent by: ${Array(users).join("\n")}`)
      .setTitle(`Message Bulk Deleted in ${channel.name}`)
      .setFooter(`Mod Log`)
    modChannel.send(ModEmbed);
  })

}
