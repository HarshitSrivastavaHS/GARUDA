module.exports = {
    name: 'serverinfo',
    type: 'info',
    description: 'shows details of that server.',
    async execute(message, args, mybot, Discord) {
        let embed = new Discord.MessageEmbed()
        .setColor("YELLOW")
        .setAuthor(`${message.guild.name}`, message.guild.iconURL())
        .setThumbnail(message.guild.iconURL())
        .addFields(
           {name: 'Owner', value: await message.guild.owner.user.tag},
           {name: 'Region', value: await message.guild.region},
           {name: 'Total Members', value: await message.guild.memberCount},
           {name: 'Total Bots', value: await message.guild.members.cache.filter(m=>m.user.bot).size},
           {name: 'Creation Date', value: message.guild.createdAt.toLocaleDateString({locales: "en-en"})},
        )
        message.channel.send(embed);
    }
}
