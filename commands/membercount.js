module.exports = {
    name: 'membercount',
    type: 'info',
    usage: '&{prefix}membercount',
    description: 'shows the total member of people in the server',
    aliases: ["members"],
    permissions: ['SEND_MESSAGES'],
    async execute(message, args, bot, Discord, prefix) {
        let emb = new Discord.MessageEmbed()
        .setTitle(`Member Count`)
        .setColor("#FFA500")
        .setThumbnail(message.guild.icon?message.guild.iconURL({dynamic: true}):undefined)
        .setDescription(`Total members: ${message.guild.memberCount}`)
        .setTimestamp();
        message.channel.send(emb);
    }
}
