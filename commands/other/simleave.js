module.exports = {
    name: 'simleave',
    type: 'admin',
    description: 'simulates leave for testing',
    usage: "&{prefix}simleave", 
    aliases: [],
    permissions: ['SEND_MESSAGES'],
    async execute(message, args, bot, Discord, prefix) {
        
        if (!message.member.permissions.has("ADMINISTRATOR")) return message.reply("Only an administrator can use this.");
        let wc = bot.serverConfig.get(message.guild.id)!=undefined?bot.serverConfig.get(message.guild.id).leave:undefined;
        if (!wc) return message.channel.send("NO leave channel set");
        bot.emit("guildMemberRemove", message.member);
    }
}
