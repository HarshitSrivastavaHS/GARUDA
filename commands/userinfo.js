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
        .addField("Created on", `${user.user.createdAt}`)
        .addField("Joined on", `${user.joinedAt}`)
        .addField("Roles", user.roles.cache.size>1?user.roles.cache.map(r=>r).filter(r=>r!=user.guild.roles.everyone).join(" "):"None")
        .setThumbnail(user.user.displayAvatarURL({dynamic: true}))
        .setFooter(`Requested by ${message.author.tag}`)
        .setTimestamp();
        message.channel.send(emb);
    }
}
