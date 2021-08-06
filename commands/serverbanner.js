module.exports = {
    name: 'server-banner',
    description: 'shows the server icon',
    usage: "&{prefix}server-banner",
    permissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
    aliases: ["serverbanner", "sb"],
    async execute(message, args, bot, Discord, prefix) {
        const embed = new Discord.MessageEmbed()
        .setColor("#D441EE")
        .setAuthor(`${message.author.username}`,`${message.author.displayAvatarURL({dynamic: true})}`)
        .setImage(`${message.guild.bannerURL({size: 4096, dynamic: true})}`)
        .setTitle(`${message.guild.name}'s Banner`);
        message.channel.send(embed);
    }
}
