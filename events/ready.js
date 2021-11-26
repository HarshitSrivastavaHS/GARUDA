const Discord = require("discord.js")
module.exports = {
	name: 'ready',
	once: true,
	async execute(bot) {
		//statcord.autopost();
	  console.log(`Ready! Logged in as ${bot.user.tag}`);
	  bot.user.setPresence({
      activities: [{ name: `Ping for help on ${bot.guilds.cache.size} servers!`, type: 'WATCHING' }],
    });
	  require("../functions/ghostping")(bot, Discord);
    require("../functions/modLog")(bot, Discord);
	},
};
