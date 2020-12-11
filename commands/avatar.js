module.exports = {
    name: 'avatar',
    description: 'shows the user\'s avatar',
    execute(message, args, bot, Discord) {
        const mentionUser = message.mentions.users.first();
        const avataremb = new Discord.MessageEmbed()
        .setColor("#D441EE")
        .setAuthor(`${message.author.username}`,`${message.author.displayAvatarURL()}`)
        .setFooter('Avatar Command');
        if (mentionUser){
          avataremb.setImage(`${mentionUser.displayAvatarURL()}`)
          .setTitle(`${mentionUser.tag}'s Avatar`);
        }
        else {
          avataremb.setImage(`${message.author.displayAvatarURL()}`)
          .setTitle('Your Avatar');
        }  
        message.channel.send(avataremb);
    }
}
