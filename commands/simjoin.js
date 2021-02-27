module.exports = {
    name: 'simjoin',
    type: 'admin',
    description: 'simulates join for testing',
    usage: "&{prefix}simjoin", 
    async execute(message, args, bot, Discord, prefix) {
        if (!message.member.permissions.has("ADMINISTRATION")) return message.reply("Only an administrator can use this.");
        let wc = bot.serverConfig.get(message.guild.id)!=undefined?bot.serverConfig.get(message.guild.id).welcome:undefined;
        if (!wc) return message.channel.send("NO welcome channel set");
        bot.emit("guildMemberAdd", message.member);
    }
}
