module.exports = {
    name: 'vote',
    usage: '&{prefix}vote',
    description: 'support the bot by voting for the bot.',
    aliases: [],
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
        
       const emb = new Discord.MessageEmbed()
        .setColor("PURPLE")
        .setTitle("Vote for GARUDA")
        .setDescription("Thank you for using this command. You can [vote for Garuda on Discord Bot List](https://discordbotlist.com/bots/garuda/upvote).\nYou can vote for the bot every 12 hours!.")
        .setThumbnail(message.author.displayAvatarURL())
        .setTimestamp()
        .setFooter("Thank You!");
       message.channel.send(emb);
    }
}
