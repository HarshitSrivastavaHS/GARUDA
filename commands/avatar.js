module.exports = {
    name: 'avatar',
    description: 'shows the user\'s avatar',
    execute(message, args, bot, Discord) {
        const mentionUser = message.mentions.members.first();
        const avataremb = new Discord.MessageEmbed()
        .setColor("#D441EE")
        .setTitle('Avatar')
        .setAuthor(`${message.author.username}`,`${message.author.displayAvatarURL()}`)
        .setFooter('Avatar Command');
        if (mentionUser)
          avataremb.setImage(`${mentionUser.displayAvatarURL()}`);
        else
          avataremb.setImage(`${message.author.displayAvatarURL()}`);
        message.channel.send(avataremb);
    }
}
