module.exports = {
    name: 'simjoin',
    type: 'admin',
    description: 'simulates join for testing',
    usage: "&{prefix}simjoin", 
    aliases: [],
    permissions: ['SEND_MESSAGES'],
    async execute(message, args, bot, Discord, prefix) {
        
        if (!message.member.permissions.has("ADMINISTRATOR")) return message.reply("Only an administrator can use this.");
        let wc = bot.serverConfig.get(message.guild.id)&&bot.serverConfig.get(message.guild.id).welcomer?bot.serverConfig.get(message.guild.id).welcomer.channel:undefined;
        if (!wc) return message.channel.send("NO welcome channel set");
        bot.emit("guildMemberAdd", message.member);
    }
}
