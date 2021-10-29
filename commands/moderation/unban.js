module.exports = {
    name: 'unban',
    type: 'moderation',
    usage: '&{prefix}unban <user id>',
    description: 'unbans a banned person',
    aliases: [],
    permissions: ['SEND_MESSAGES', 'BAN_MEMBERS'],
    async execute(message, args, bot, Discord, prefix) {
        
        if (!message.member.permissions.has("BAN_MEMBERS")) return message.channel.send("You don't have the required permissions.");
            
            if (!args) return message.channel.send("Please also mention the id of the person who is to be unbanned");
            
            let bans = await message.guild.bans.fetch();

            if (!bans) return message.channel.send("I don't have the required permission");

            if (bans.size == 0) return message.channel.send("Nobody is banned");

            let ban = bans.filter(b=>b.user.id == args[0]);

            if (!ban) return message.channel.send("That user is not banned");
            
            message.guild.members.unban(args[0]).then((u)=>{
                message.channel.send(`Successfully unbanned ${u.tag}`);
            }).catch(()=>{
                message.channel.send("I could not unban that person");
            })
        
    }
}



