module.exports = {
    name: 'snipe',
    type: 'utility',
    description: 'shows last deleted message in that channel',
    permissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
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
        let msg = bot.snipes.get(message.channel.id);
        if (!msg) return message.channel.send("There is no deleted message in this channel.");
        let snipEMbed = new Discord.MessageEmbed()
        .setColor("RANDOM")
        .setAuthor(msg.author, msg.avatar)
        .setDescription(msg.content)
        .setImage(msg.image?msg.image:null)
        .setTimestamp();
        message.channel.send(snipEMbed);
    }
}
