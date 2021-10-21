module.exports = {
    name: 'editsnipe',
    type: 'utility',
    usage: '&{prefix}editsnipe',
    description: 'shows last edited message in that channel',
    aliases: [],
    permissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
    async execute(message, args, bot, Discord, prefix) {
       let msg = bot.editSnipes.get(message.channel.id);
        if (!msg) return message.channel.send("There is no edited message in this channel.");
        let editSnipEMbed = new Discord.MessageEmbed()
        .setColor("#00dfad")
        .setAuthor(msg.author, msg.avatar)
        .addFields(
        {name: "Old Message" ,value: msg.oldContent!=""?msg.oldContent:"[NA]"},
        {name: "New Message" ,value: msg.newContent!=""?msg.newContent:"[NA]"}
        )
        //.setDescription(`Message Edited on: <t:${Math.floor(msg.time/1000)}:f>`)
        .setFooter(`Message Edited`)
        .setTimestamp(msg.time);
        message.channel.send({embeds: [editSnipEMbed]});
    }
}
