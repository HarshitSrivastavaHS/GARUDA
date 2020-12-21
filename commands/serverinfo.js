module.exports = {
    name: 'serverinfo',
    type: 'info',
    description: 'shows details of that server.',
    execute(message, args, mybot, Discord) {
        let embed = new Discord.MessageEmbed()
        .setColor("YELLOW")
        .setAuthor(`${message.guild.name}`, message.guild.iconURL())
        .setThumbnail(message.guild.iconURL())
        .addFields(
           {name: 'Owner', value: message.guild.owner.user.tag},
           {name: 'Region', value: message.guild.region},
           {name: 'Total Members', value: message.guild.memberCount},
           {name: 'Total Bots', value: message.guild.members.cache.filter(m=>m.user.bot).size},
           {name: 'Creation Date', value: message.guild.createdAt.toLocaleDateString(locales: "en-en")},
        )
        message.channel.send(embed);
    }
}
