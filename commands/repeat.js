module.exports = {
    name: 'repeat',
    description: 'repeats whatever the user wants it to repeat',
    usage: "&{prefix}repeat <text>",
    permissions: ['SEND_MESSAGES'],
    aliases: ["say"],
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
        
        if (message.content.indexOf(' ') === -1) {
            message.reply("Invalid Syntax! ```\n%repeat <Text to be repeated by the bot>\n```");
            return;
        }
        
        let x = Discord.Util.cleanContent(args.join(" "), message);
        x = Discord.Util.removeMentions(x);
        message.channel.send(x);
        if (message.deletable)
            message.delete();

    }
}
