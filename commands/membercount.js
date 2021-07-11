module.exports = {
    name: 'membercount',
    type: 'info',
    usage: '&{prefix}membercount',
    description: 'shows the total member of people in the server with member goals',
    aliases: ["members"],
    permissions: ['SEND_MESSAGES'],
    async execute(message, args, bot, Discord, prefix) {
        message.guild.members.fetch();
        let emb = new Discord.MessageEmbed()
        .setTitle(`Member Count`)
        .setColor("#FFA500")
        .setThumbnail(message.guild.icon?message.guild.iconURL({dynamic: true}):undefined)
        .setDescription(`Total members: ${message.guild.members.cache.size}\nTotal Humans: ${message.guild.members.cache.filter(m=>!m.user.bot).size}\nTotal bots: ${message.guild.members.cache.filter(m=>m.user.bot).size}`)
        .setTimestamp();
        message.guild.members.cache.delete();
        message.channel.send(emb);
    }
}
