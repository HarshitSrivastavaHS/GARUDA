const Discord = require("discord.js")
module.exports = {
	name: 'guildDelete',
	async execute(guild) {
           if (!guild) return;
           const bot = guild.client;
           bot.user.setPresence({
              activities: [{ name: `Ping for help on ${bot.guilds.cache.size} servers!`, type: 'WATCHING' }],
           });
	},
};
