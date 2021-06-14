module.exports = {
    name: 'userinfo',
    type: 'info',
    usage: '&{prefix}userinfo <optional @user>',
    description: 'shows information about that server',
    aliases: ["ui"],
    permissions: ['SEND_MESSAGES'],
    async execute(message, args, bot, Discord, prefix) {
        let user = message.mentions.members.first() || message.member;
        let emb = new Discord.MessageEmbed()
        .setTitle(`${user.user.tag}'s Account Information`)
        .setColor("#FFA500")
        .setDescription(`**Username:** \`${user.user.tag}\`\n\
**Nickname:** \`${user.nickname?user.nickname: "None"}\`\n\
**Id:** \`${user.user.id}\`\n\n\
**Badges:** ${Object.entries(user.user.flags).length?user.user.flags.toArray().join(" "):"`None`"}
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
