module.exports = {
    name: 'serverinfo',
    type: 'info',
    description: 'shows details of that server.',
    execute(message, args, bot, Discord) {
        let embed = new Discord.MessageEmbed()
        .setColor("YELLOW")
        .setTitle(`${message.guild.name`)
        .setThumbnail(message.guild.iconURL())
        .addFields(
           {name: 'Owner', value: message.guild.owner.user.tag},
           {name: 'Region', value: message.guild.region},
           {name: 'Total Members', value: message.guild.memberCount},
           {name: 'Total Bots', value: message.guild.members.cache.filter(m=>m.user.bot).size},
         
        )
        message.channel.send(embed);
    }
}
