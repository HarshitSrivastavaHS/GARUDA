module.exports = {
    name: 'repeat',
    description: 'repeats whatever the user wants it to repeat',
    usage: "&{prefix}repeat <text>",
    permissions: ['SEND_MESSAGES', 'MANAGE_MESSAGES'],
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
        message.delete();
        const EVERYONE_PATTERN = /@(everyone)/g;
        const HERE_PATTERN = /@(here)/g;
        let x = message.content;
        if (!message.member.permissions.has("MENTION_EVERYONE")) {
            x = x.replace(EVERYONE_PATTERN, "everyone");
            x = x.replace(HERE_PATTERN, "here");
        }
        const reptext = x.substr(x.indexOf(' ')+1);
        message.channel.send(reptext);
    }
}
