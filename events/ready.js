const Discord = require("discord.js")
module.exports = {
	name: 'ready',
	once: true,
	async execute(bot) {
		//statcord.autopost();
	  console.log(`Ready! Logged in as ${bot.user.tag}`);
	  bot.user.setPresence({
      activities: [{ name: `Ping me for help!`, type: 'WATCHING' }],
    });
	  require("../functions/ghostping")(bot, Discord);
    require("../functions/modLog")(bot, Discord);
	},
};