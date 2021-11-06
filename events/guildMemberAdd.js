const welcomeJS = require(`../util/welcome`);
const Discord = require("discord.js")
module.exports = {
	name: 'guildMemberAdd',
  async execute(member) {
    let bot = member.client;
		if (bot.freezer.has(`${member.guild.id}-${member.user.id}`)) {
      member.setNickname(bot.freezer.get(`${member.guild.id}-${member.user.id}`)).catch((err)=>{
        console.log(err);
      });
    }
    let wc = bot.serverConfig.get(member.guild.id)!=undefined?bot.serverConfig.get(member.guild.id).welcome:undefined;
    if (wc) {
	    const welcomeCH = await bot.channels.fetch(wc);
	    if (member.user.bot) {
		    welcomeCH.send(`${member} was just invited to the server.`);
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
			    member.roles.add(autorole);
		    }
	    }
    }
  },
};