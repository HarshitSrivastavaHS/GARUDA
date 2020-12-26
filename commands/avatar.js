module.exports = {
    name: 'avatar',
    type: 'fun',
    description: 'shows the user\'s avatar',
    async execute(message, args, bot, Discord, prefix) {
        const mentionUser = message.mentions.users.first();
        const avataremb = new Discord.MessageEmbed()
        .setColor("#D441EE")
        .setAuthor(`${message.author.username}`,`${message.author.displayAvatarURL()}`)
        .setFooter('Avatar Command');
        if (mentionUser){
          avataremb.setImage(`${mentionUser.displayAvatarURL({size: 4096, dynamic: true})}`)
          .setTitle(`${mentionUser.tag}'s Avatar`);
        }
        else {
          avataremb.setImage(`${message.author.displayAvatarURL({size: 4096, dynamic: true})}`)
          .setTitle('Your Avatar');
        }  
        message.channel.send(avataremb);
    }
}
