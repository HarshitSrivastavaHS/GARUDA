 module.exports = async (bot, Discord) => {
    bot.on("messageDelete", async (message) => {
        if (message.author.bot) return;
        let ghost = bot.serverConfig.get(message.guild.id)?bot.serverConfig.get(message.guild.id).ghost:undefined;
	    if (!ghost) return; 
		let mention = message.mentions.members.first() || message.mentions.roles.first() || message.mentions.everyone;
		if (!mention) return;
		let mentions = [];
		function insert(arr, ...items) {
			if (items.size==0) return;
			items.forEach((i)=>{
				arr.push(i);
			})
		}
		insert(mentions, message.mentions.members.filter(m=>!m.user.bot&&m.user.id!=message.author.id))
		insert(mentions, message.mentions.roles)
		if (message.mentions.everyone)
			mentions.push("@everyone")
		if (mentions.length==0) return;
		let msg = ""
		mentions.forEach((e)=>msg=`${msg} ${e.map((i)=>i).join(" ")}`)
		let tarch = message.guild.channels.cache.get(ghost);
		if (!tarch) return;
        if (Date.now()>message.createdTimestamp+15000) return;
		let ghostEM = new Discord.MessageEmbed()
		    .setColor("RED")
		    .setTitle("Possible Ghost Ping Detected")
		    .setFooter("Bot By TechAllByHarshit")
		    .setDescription(`Message:\n\n${message.content}`)
			.addField("Ghost Pinged", `${msg}`)
		    .addField("Channel", message.channel)
		    .addField("Message Author", message.author);
		tarch.send(ghostEM);
		
		ghostEM = new Discord.MessageEmbed()
		    .setColor("RED")
		    .setTitle("Ghost ping detected")
			.setTimestamp()
		    .setDescription(`${message.member} ghost pinged${msg}`);
		message.channel.send(ghostEM).catch(()=>{
			return;
		})
	})
}
 