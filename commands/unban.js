module.exports = {
    name: 'unban',
    type: 'moderation',
    usage: '&{prefix}unban <user id>',
    description: 'unbans a banned person',
    aliases: [],
    permissions: ['SEND_MESSAGES', 'BAN_MEMBERS'],
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
        if (!message.member.permissions.has("BAN_MEMBERS")) return message.channel.send("You don't have the required permissions.");
            
            if (!args) return message.channel.send("Please also mention the id of the person who is to be unbanned");
       
            message.guild.fetchBans().then((bans)=>{
                if (bans.size==0) {
                    return message.channel.send("Nobody is banned from this server.");
                }
                let user = bans.filter(b=>b.user.id==args[0])
                if (!user) {
                    return message.channel.send("That user isn't banned.");
                }
            }).catch(()=>{
                return message.channel.send("I don't have the required permissions.");
            })
            
            message.guild.members.unban(args[0]).then((u)=>{
                message.channel.send(`Successfully unbanned ${u.tag}`);
            }).catch(()=>{
                message.channel.send("I could not unban that person");
            })
    }
}



