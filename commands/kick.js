module.exports = {
    name: 'kick',
    desccription: 'Kicks a user out of the server',
    execute(message, args) {
        if(!message.member.permissions.has("KICK_MEMBERS")) {
            message.channel.send("You don't have the required permissions.");
            return;
        }
        const mentionMember = message.mentions.members.first();

        if (args.length === 0 || mentionMember === undefined) {
            message.channel.send("Ooof, how can i kick if you don't even mention the user?")
            return;
        }
        const srole = message.member.roles.highest.position;
        const rrole = mentionMember.roles.highest.position;
        const brole = message.guild.me.roles.highest.position;
        
        if (srole>rrole) {
            if (brole>rrole) {
            
            }
            else {
                message.reply(":cry: I cannot kick that user.");
            }
        }
        else {
            message.reply(":broken_heart: You cannot kick someone with a higher or equal role as your.");
        }
    }
}
