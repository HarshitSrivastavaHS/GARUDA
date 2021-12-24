const Discord = require("discord.js");
const ms = require("ms");
module.exports = {
    name: 'unmute',
    description: 'unmute a member.',
    usage: '&{prefix}unmute <@user>',
    aliases: ["timeout-remove"],
    permissions: ['SEND_MESSAGES', "READ_MESSAGE_HISTORY","MODERATE_MEMBERS" ],
    async execute(message, args, bot, Discord, prefix) {
        //if (message.author.id != "451693463742840842") return message.reply("In development");
        if (!message.member.permissions.has("MODERATE_MEMBERS")) return message.reply("You don't have the permission to mute others.")
    
        const mentionMember = message.mentions.members.first()&&message.mentions.members.filter(m=>args[0]&&args[0].includes(m.user.id)).size>=1?message.mentions.members.filter(m=>args[0]&&args[0].includes(m.user.id)).first(): undefined;
        if (!mentionMember) return message.reply("Please mention the member to be muted.");
        if (mentionMember.user.id == message.author.id) return message.reply("You are not muted.");
        if (mentionMember.user.id == bot.user.id) return message.reply("I am not muted");
        if (mentionMember.communicationDisabledUntilTimestamp < message.createdTimestamp) return message.reply("The person is not muted.");

        const srole = message.member.roles.highest.position;
        const rrole = mentionMember.roles.highest.position;
        const brole = message.guild.me.roles.highest.position;
        let owner = await message.guild.fetchOwner();
        if (srole>rrole || owner.id == message.author.id) {
            if (brole>rrole) {
                mentionMember.timeout(null);
                message.channel.send(`${mentionMember} was unmuted by ${message.member}`);
            }
            else {
                message.reply("My role is not high enough to unmute them. Please move my role higher than their highest role..");
            }
        }
        else {
            message.reply("You cannot unmute someone who has a higer role than you.");
        }

    }
}
