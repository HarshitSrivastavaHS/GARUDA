const Discord = require("discord.js");
const ms = require("ms");
module.exports = {
    name: 'mute',
    description: 'mute a member.',
    usage: '&{prefix}mute <@user> <time> (reason)',
    aliases: ["timeout"],
    permissions: ['SEND_MESSAGES', "READ_MESSAGE_HISTORY","MODERATE_MEMBERS" ],
    async execute(message, args, bot, Discord, prefix) {
        //if (message.author.id != "451693463742840842") return message.reply("In development");
        if (!message.member.permissions.has("MODERATE_MEMBERS")) return message.reply("You don't have the permission to mute others.")
    
        const mentionMember = message.mentions.members.first()&&message.mentions.members.filter(m=>args[0]&&args[0].includes(m.user.id)).size>=1?message.mentions.members.filter(m=>args[0]&&args[0].includes(m.user.id)).first(): undefined;
        if (!mentionMember) return message.reply("Please mention the member to be muted.");
        if (mentionMember.user.id == message.author.id) return message.reply("You cannot mute yourself.");
        if (mentionMember.user.id == bot.user.id) return message.reply("I cannot mute myself");
        if (mentionMember.communicationDisabledUntilTimestamp > message.createdTimestamp) return message.reply("The person is already muted.");

        let time = undefined;
        if (args[1]) 
            time = ms(args[1])
        if (!time) return message.reply("Please mention the duration of the mute.");
        if (time >= ms("4w")||time<=ms("5s")) return message.reply(`Minimum Mute Limit: 5 seconds\nMaximum Mute Limit: 27 days\nProvided time: ${ms(time, {long: true})}`);
        args.splice(0,2);
        let reason = args.join(" ");

        const srole = message.member.roles.highest.position;
        const rrole = mentionMember.roles.highest.position;
        const brole = message.guild.me.roles.highest.position;
        let owner = await message.guild.fetchOwner();
        if (srole>rrole || owner.id == message.author.id) {
            if (brole>rrole) {
                mentionMember.timeout(time, reason);
                message.channel.send(`${mentionMember} was muted by ${message.member} for ${ms(time, { long: true })}.`);
            }
            else {
                message.reply("My role is not high enough to mute them. Please move my role higher than their highest role..");
            }
        }
        else {
            message.reply("You cannot mute someone who has a higher role than you.");
        }

    }
}
