module.exports = {
    name: 'simleave',
    type: 'admin',
    description: 'simulates leave for testing',
    usage: "&{prefix}simleave", 
    permissions: ['SEND_MESSAGES'],
    async execute(message, args, bot, Discord, prefix) {
        let botPerms = [];
        let missingPerms = [];
        this.permissions.forEach(p=>{
            botPerms.push(message.channel.permissionsFor(bot.user).has(p));
            if (!(message.channel.permissionsFor(bot.user).has(p)))
                missingPerms.push(p);
        })
        missingPerms = missingPerms.join("\n");
        if (botPerms.includes(false)) return message.channel.send(`The Following permissions which are missing are needed by the bot for this command:\n\n\`\`\`\n${missingPerms.replace("_"," ")}\`\`\``).catch(err=>console.log(`Missing send message permission in a server.`));
        if (!message.member.permissions.has("ADMINISTRATION")) return message.reply("Only an administrator can use this.");
        let wc = bot.serverConfig.get(message.guild.id)!=undefined?bot.serverConfig.get(message.guild.id).leave:undefined;
        if (!wc) return message.channel.send("NO leave channel set");
        bot.emit("guildMemberRemove", message.member);
    }
}
