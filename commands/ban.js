module.exports = {
    name: 'ban',
    type: 'moderation',
    usage: '&{prefix}ban <user\'s @>',
    description: 'kicks and bans a user out of the server',
    aliases: [],
    permissions: ['SEND_MESSAGES', 'BAN_MEMBERS'],
    async execute(message, args, bot, Discord, prefix) {
        if(!message.member.permissions.has("BAN_MEMBERS")) {
            message.channel.send("You don't have the required permissions.");
            return;
        }
        const mentionMember = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(member => member.user.username.toLowerCase() == args.join(" ").toLowerCase());

        if (args.length === 0 || mentionMember === undefined) {
            message.reply(`Invalid Syntax! \`\`\`%ban @mention\`\`\``)
            return;
        }
        const srole = message.member.roles.highest.position;
        const rrole = mentionMember.roles.highest.position;
        
        if (srole>rrole) {
            if (mentionMember.bannable) {
                mentionMember.ban();
                message.channel.send(`${mentionMember} was banned by ${message.member}.`);
            }
            else {
                message.reply("I cannot ban that user.");
            }
        }
        else {
            message.reply("You cannot ban someone with a higher or equal role as your.");
        }
    }
}
