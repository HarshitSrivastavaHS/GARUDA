module.exports = {
    name: 'editsnipe',
    type: 'utility',
    description: 'shows last edited message in that channel',
    execute(message, args, bot, Discord) {
        let msg = bot.editSnipes.get(message.channel.id);
        if (!msg) return message.channel.send("There is no edited message in this channel.");
        let editSnipEMbed = new Discord.MessageEmbed()
        .setColor("RANDOM")
        .setAuthor(msg.author, msg.avatar)
        .addFields(
        {name: "Old Message" ,value: msg.oldContent},
        {name: "New Message" ,value: msg.newContent}
        )
        .setThumbnail(msg.image?msg.image:null)
        .setTimestamp();
        message.channel.send(editSnipEMbed);
    }
}
