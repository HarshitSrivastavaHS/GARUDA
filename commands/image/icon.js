module.exports = {
    name: 'server-icon',
    description: 'shows the server Icon',
    usage: "&{prefix}server-icon",
    permissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
    aliases: ["servericon", "icon"],
    async execute(message, args, bot, Discord, prefix) {
        if (!message.guild.icon) 
           return message.channel.send("This server has no icon.");
        const embed = new Discord.MessageEmbed()
        .setColor("#D441EE")
        .setAuthor(`${message.author.username}`,`${message.author.displayAvatarURL({dynamic: true})}`)
        .setImage(`${message.guild.iconURL({size: 4096, dynamic: true})}`)
        .setTitle(`${message.guild.name}'s Icon`);
        message.channel.send({embeds:[embed]});
    }
}
