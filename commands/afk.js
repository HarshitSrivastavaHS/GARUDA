let bot.afk = new Map();
module.exports = {
    name: 'afk',
    usage: '&{prefix}afk',
    description: 'sets AFK.',
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
        let afkmsg = args.length<1?"AFK":args.join(" ");
        bot.afk.set(message.author.id, afkmsg);
        message.reply(`AFK successfully set, msg: ${afkmsg}`);
    }
}
