module.exports = {
    name: 'simleave',
    type: 'admin',
    description: 'simulates leave for testing',
    usage: "&{prefix}simleave", 
    async execute(message, args, bot, Discord, prefix) {
        if (!message.member.permissions.has("ADMINISTRATION")) return message.reply("Only an administrator can use this.");
        let wc = bot.leaves.get(message.guild.id);
        if (!wc) return message.channel.send("NO leave channel set");
        bot.emit("guildMemberRemove", message.member);
    }
}
