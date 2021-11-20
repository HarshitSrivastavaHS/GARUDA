const welcomeJS = require(`../util/welcome`);
const Discord = require("discord.js");
const mongo = require(`../mongo`);
const freezerConfig = require('../Schemas/freezenick');
const messageCreate = require("./messageCreate");
module.exports = {
	name: 'guildMemberAdd',
  async execute(member) {
    let bot = member.client;
		if (bot.freezer.has(`${member.guild.id}-${member.user.id}`)) {
      member.setNickname(bot.freezer.get(`${member.guild.id}-${member.user.id}`)).catch(async (err)=>{
        bot.freezer.delete(`${member.guild.id}-${member.user.id}`);
        await mongo().then(async (mongoose)=>{
            await freezerConfig.findOneAndRemove({
                    _id: `${message.guild.id}-${message.mentions.users.first().id}`
                })
             })
      });
    }
    let wc = bot.serverConfig.get(member.guild.id)!=undefined?bot.serverConfig.get(member.guild.id).welcome:undefined;
    if (wc) {
	    const welcomeCH = await bot.channels.fetch(wc).catch((err)=>{
			console.log("guildMemberAdd.js wc error")
		})
	    if (member.user.bot) {
		    welcomeCH.send(`${member} was just invited to the server.`).catch(e=>{});
	    }
  	  else {
  		  welcomeJS.execute(member, welcomeCH, Discord);
	    }
    }
    let ar = bot.serverConfig.get(member.guild.id)!=undefined?bot.serverConfig.get(member.guild.id).autoRole:undefined;
    if (ar){
  	  let autorole = member.guild.roles.cache.get(ar);
	    if (autorole) {
		    if (!member.user.bot){
				if (member.guild.me.permissions.has("MANAGE_GUILD")) {
					
					member.roles.add(autorole).catch(()=>{
						
					});
				}
				else {
					if(!bot.autoroleMissingPermissions.includes(member.guild.id)) {
						(member.guild.systemChannelId
							&&
						await member.guild.fetch(member.guild.systemChannelId)
							&&
						member.guild.systemChannel.permissionsFor(bot.user).has("VIEW_CHANNEL")
							&&
						member.guild.systemChannel.permissionsFor(bot.user).has("SEND_MESSAGES")
							&&
						member.guild.systemChannel.send("I cannot give role automatically to new members joining since i don't have permission. I need ManageServer permission for this."))
							||
						await member.guild.fetchOwner().then(o=>{
							o.send(`**I don't have permission in your server (${member.guild.name}) to give roles automatically to new members joining. Please give me Manage Server permission so that I can give roles automatically.**`).catch(e=>{});
						});
						bot.autoroleMissingPermissions.push(member.guild.id);
					}
				}
			    
		    }
	    }
    }
  },
};
