module.exports = {
    name: 'snipe',
    
    description: 'shows last deleted message in that channel',
    aliases: [],
    permissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
    async execute(message, args, bot, Discord, prefix) {
        
        let msg = bot.snipes.get(message.channel.id);
        if (!msg) return message.channel.send("There is no deleted message in this channel.");
        let snipEMbed = new Discord.MessageEmbed()
        .setColor("#ff2052")
        .setAuthor(msg.author, msg.avatar)
        .setDescription(msg.content)
        .setImage(msg.image?msg.image:null)
        //addField("Message Deleted on", `<t:${Math.floor(msg.time/1000)}:f>`)
        .setFooter("Message Deleted")
        .setTimestamp(msg.time)
        message.channel.send({embeds:[snipEMbed]});
    }
}
