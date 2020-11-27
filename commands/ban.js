module.exports = {
    name: 'ban',
    desccription: 'kicks and bans a user out of the server',
    execute(message, args) {
        if(!message.member.permissions.has("BAN_MEMBERS")) {
            message.channel.send("You don't have the required permissions.");
            return;
        }
        const mentionMember = message.mentions.members.first();

        if (args.length === 0 || mentionMember === undefined) {
            message.reply(`Correct Syntax\n\`%kick @mention\``)
            return;
        }
        const srole = message.member.roles.highest.position;
        const rrole = mentionMember.roles.highest.position;
        const brole = message.guild.me.roles.highest.position;
        
        if (srole>rrole) {
            if (brole>rrole) {
                mentionMember.ban();
                message.channel.send(`${mentionMember} was banned by ${message.member}.`);
            }
            else {
                message.reply(":cry: I cannot ban that user.");
            }
        }
        else {
            message.reply(":broken_heart: You cannot ban someone with a higher or equal role as your.");
        }
    }
}
