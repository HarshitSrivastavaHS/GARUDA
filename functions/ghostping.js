 module.exports = async (bot, Discord) => {
    bot.on("messageDelete", async (message) => {
        
        let ghost = bot.serverConfig.get(message.guild.id)?bot.serverConfig.get(message.guild.id).ghost:undefined;
	    if (!ghost) return; 
		let mention = message.mentions.members.first() || message.mentions.everyone;
		if (!mention) return;
		let tarch = message.guild.channels.cache.get(ghost);
		if (!tarch) return;
        if (Date.now()>message.createdTimestamp+10000) return;
		let ghostEM = new Discord.MessageEmbed()
		    .setColor("RED")
		    .setTitle("Possible Ghost Ping Detected")
		    .setFooter("Bot By TechAllByHarshit")
		    .setDescription(`Message:\n\n${message.content}`)
		    .addField("Channel", message.channel)
		    .addField("Message Author", message.author);
		tarch.send(ghostEM);
	})
}
 