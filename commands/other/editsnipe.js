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
        {name: "Old Message" ,value: msg.oldContent},
        {name: "New Message" ,value: msg.newContent}
        )
        .setDescription(`Message Edited at: <t:${Math.floor(msg.time/100)}:f>`)
        .setFooter(`Bot by TechAllByHarshit#1503`);
        message.channel.send({embeds: [editSnipEMbed]});
    }
}
