module.exports = {
    name: 'server-avatar',
    type: 'fun',
    usage: `&{prefix}server-avatar <user's mention (optional)>`,
    description: 'shows the user\'s avatar',
    aliases: ["sa", "serveravatar", "guildavatar"],
    permissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
    async execute(message, args, bot, Discord, prefix) {
        return message.channel.send("in development")
        await message.guild.members.fetch();
        const mentionUser = message.mentions.members.first()&&message.mentions.members.filter(m=>args[0]&&args[0].includes(m.user.id)).size>=1?message.mentions.members.filter(m=>args[0]&&args[0].includes(m.user.id)).first():false|| message.guild.members.cache.get(args[0])|| message.guild.members.cache.find(m => m.user.username.toLowerCase().includes(args.length>0?args.join(" ").toLowerCase():null))||message.member;
        const fetch = require("node-fetch");
        let res = await fetch(`https://discord.com/api/guilds/${message.guild.id}/members/${mentionUser.user.id}`, {
           headers: {
              Authorization: `Bot ${bot.token}`
           }
        })
console.log(res)
        if (!res.data.avatar) {
           const emb = new Discord.MessageEmbed()
           .setColor("#ffe6b3")
           .setTitle("No Server Avatar")
           .setAuthor(`${message.author.username}`,`${message.author.displayAvatarURL({dynamic: true})}`)
           .setDescription(`The above mentioned user, ${mentionUser}, does not have a server avatar.`)
           .setTimestamp()
           .setFooter(`Requested by ${message.author.tag}`)
           return message.channel.send({embeds: [emb]});
        }
        const avataremb = new Discord.MessageEmbed()
        .setColor("#ffe6b3")
        .setAuthor(`${message.author.username}`,`${message.author.displayAvatarURL({dynamic: true})}`)
        .setImage(`https://cdn.discordapp.com/guilds/${message.guild.id}/users/${mentionUser.user.id}/avatars/${res.data.avatar}.webp?size=4096`)
        .setTitle(`${mentionUser.user.tag}'s Server Avatar`)
        .setTimestamp()
        .setFooter(`Requested by ${message.author.tag}`);
        message.channel.send({embeds:[avataremb]});
    }
}
