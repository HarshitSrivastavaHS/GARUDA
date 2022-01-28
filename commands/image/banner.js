module.exports = {
    name: 'banner',
    usage: `&{prefix}banner [user]`,
    description: 'shows the user\'s banner',
    aliases: ["bn"],
    permissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
    async execute(message, args, bot, Discord, prefix) {
        await message.guild.members.fetch();
      let mentionUser = message.mentions.members.first()&&message.mentions.members.filter(m=>args[0]&&args[0].includes(m.user.id)).size>=1?message.mentions.members.filter(m=>args[0]&&args[0].includes(m.user.id)).first():false|| message.guild.members.cache.get(args[0])|| args.length > 0 && message.guild.members.cache.find(m => m.user.username.toLowerCase().includes(args.join(" ").toLowerCase()))||message.member;
      mentionUser = await mentionUser.user.fetch(true);
      if (!mentionUser.banner){
        const emb = new Discord.MessageEmbed()            
  .setColor("#5ADBFF")            
          .setTitle("No User Banner")            
          .setAuthor(`${message.author.username}`,`${message.author.displayAvatarURL({dynamic: true})}`)            .setDescription(`The above mentioned user, ${mentionUser}, does not have a banner.`)            
          .setTimestamp()            
          .setFooter(`Requested by ${message.author.tag}`)            
          return message.channel.send({embeds: [emb]});
      }
        const banneremb = new Discord.MessageEmbed()
        .setColor("#5ADBFF")
        .setAuthor(`${message.author.username}`,`${message.author.displayAvatarURL({dynamic: true})}`)
        .setImage(`${mentionUser.bannerURL({size: 4096, dynamic: true})}`)
        .setTitle(`${mentionUser.tag}'s Banner`);
        message.channel.send({embeds:[banneremb]});
    }
}
