module.exports = {
    name: 'userinfo',
    type: 'info',
    usage: '&{prefix}userinfo <optional @user>',
    description: 'shows information about that server',
    aliases: ["ui", "whois"],
    permissions: ['SEND_MESSAGES'],
    async execute(message, args, bot, Discord, prefix) {
        let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
        let badges = user.user.flags.toArray();
        for (let b in badges) {
            switch(badges[b]){
                case "HOUSE_BRAVERY": badges[b]= "<:bravery:853996728684773397>"; break;
                case "HOUSE_BRILLIANCE": badges[b]= "<:brilliance:853996692369309734>"; break;
                case "HOUSE_BALANCE": badges[b]= "<:balance:853996774473990145>"; break;
                case "VERIFIED_BOT": badges[b]= "<:verified:853996934682116148>"; break;
                case "EARLY_VERIFIED_DEVELOPER": badges[b]= "<:discord_bot_dev:853997524946518016>"; break;
                case "DISCORD_EMPLOYEE": badges[b]= "<:staff:854023757454114848>"; break;
                case "PARTNERED_SERVER_OWNER": badges[b]= "<:partner:854024145821368330>"; break;
                case "HYPESQUAD_EVENTS": badges[b]= "<:hypesquad_events:854024504740806657>"; break;
                case "BUGHUNTER_LEVEL_1": badges[b]= "<:bughunter:854024242956599337>"; break;
                case "BUGHUNTER_LEVEL_2": badges[b]= "<:goldbughunter:854024280323784735>"; break;
                case "EARLY_SUPPORTER": badges[b]= "<:supporter:854023957187788830>"; break;
                default: badges.splice(b,1);
            }
        }
        let emb = new Discord.MessageEmbed()
        .setTitle(`${user.user.tag}'s Account Information`)
        .setColor("#FFA500")
        .setDescription(`**Username:** \`${user.user.tag}\`\n\
**Nickname:** \`${user.nickname?user.nickname: "None"}\`\n\
**Id:** \`${user.user.id}\`\n\n\
**Badges:** ${badges.length!=0?badges.join(" "):"`None`"}\n\
**Bot:** \`${user.user.bot?"Yes":"No"}\`\n\n\
**Last Message:** \`${user.lastMessage?(user.lastMessage.content.length<31?user.lastMessage.content:user.lastMessage.content.substr(0,31).replaceAll("`", "\`")+"..."):"None"}\`\n\
**Highest Role:** \`${user.roles.cache.size>0?user.roles.highest.name:"None"}\` ${user.roles.cache.size==0?"":`(${user.roles.highest})`}\n\n\
**Account Created on:** \`${user.user.createdAt.toLocaleString("en-IN",{dateStyle: "long"})}\`\n\
**Server Joined on:** \`${user.joinedAt.toLocaleString("en-IN",{dateStyle: "long"})}\``)
        .setThumbnail(user.user.displayAvatarURL({dynamic: true}))
        .setFooter(`Requested by ${message.author.tag}`)
        .setTimestamp();
        message.channel.send(emb);
    }
}
