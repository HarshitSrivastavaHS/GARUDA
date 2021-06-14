module.exports = {
    name: 'userinfo',
    type: 'info',
    usage: '&{prefix}userinfo <optional @user>',
    description: 'shows information about that server',
    aliases: ["ui"],
    permissions: ['SEND_MESSAGES'],
    async execute(message, args, bot, Discord, prefix) {
        let user = message.mentions.members.first() || message.member;
        let badges = user.user.flags.toArray();
        for (let b in badges) {
            switch(badges[b]){
                case "HOUSE_BRAVERY": badges[b]= "<:bravery:853996728684773397>"; break;
                case "HOUSE_BRILLIANCE": badges[b]= "<:brilliance:853996692369309734>"; break;
                case "HOUSE_BALANCE": badges[b]= "<:balance:853996774473990145>"; break;
                case "VERIFIED_BOT": badges[b]= "<:verified:853996934682116148>"; break;
                case "EARLY_VERIFIED_BOT_DEVELOPER": badges[b]= "<:discord_bot_dev:853997524946518016>"; break;
            }
        }
        let emb = new Discord.MessageEmbed()
        .setTitle(`${user.user.tag}'s Account Information`)
        .setColor("#FFA500")
        .setDescription(`**Username:** \`${user.user.tag}\`\n\
**Nickname:** \`${user.nickname?user.nickname: "None"}\`\n\
**Id:** \`${user.user.id}\`\n\n\
**Badges:** ${badges.length!=0?badges.join(", "):"`None`"}\n\
**Bot:** \`${user.user.bot?"Yes":"No"}\`\n\n\
**Last Message:** \`${user.user.lastMessage?(user.user.lastMessage.content.length<31?user.user.lastMessage.content:user.user.lastMessage.content.substr(0,31)+"..."):"None"}\`\n\
**Highest Role:** \`${user.roles.cache.size>0?user.roles.highest.name:"None"}\` ${user.roles.cache.size==0?"":`(${user.roles.highest})`}\n\n\
**Account Created on:** \`${user.user.createdAt.toLocaleString("en-IN",{dateStyle: "long"})}\`\n\
**Server Joined on:** \`${user.joinedAt.toLocaleString("en-IN",{dateStyle: "long"})}\``)
        .setThumbnail(user.user.displayAvatarURL({dynamic: true}))
        .setFooter(`Requested by ${message.author.tag}`)
        .setTimestamp();
        message.channel.send(emb);
    }
}
