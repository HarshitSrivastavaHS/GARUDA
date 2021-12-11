module.exports = {
    name: 'kick',
    type: 'moderation',
    description: 'Kicks a user out of the server',
    aliases: [],
    usage:"&{prefix}kick @user",
    permissions: ['SEND_MESSAGES', 'KICK_MEMBERS'],
    async execute(message, args, bot, Discord, prefix) {
        
        if(!message.member.permissions.has("KICK_MEMBERS")) {
            message.channel.send("You don't have the required permissions.");
            return;
        }
        const mentionMember = message.mentions.members.first()&&message.mentions.members.filter(m=>args[0]&&args[0].includes(m.user.id)).size>=1?message.mentions.members.filter(m=>args[0]&&args[0].includes(m.user.id)).first(): undefined;

        if (args.length == 0 || mentionMember === undefined) {
            message.reply(`Invalid Syntax! \`%kick <user>\``)
            return;
        }
        const srole = message.member.roles.highest.position;
        const rrole = mentionMember.roles.highest.position;
        const brole = message.guild.me.roles.highest.position;
        let owner = await message.guild.fetchOwner();
        if (srole>rrole || owner.id == message.author.id) {
            if (brole>rrole) {
                mentionMember.kick();
                message.channel.send(`${mentionMember} was kicked by ${message.member}.`);
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
