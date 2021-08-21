module.exports = {
    name: 'serverinfo',
    type: 'info',
    usage: '&{prefix}serverinfo',
    description: 'shows information about that server',
    aliases: ["si"],
    permissions: ['SEND_MESSAGES'],
    async execute(message, args, bot, Discord, prefix) {
        await message.guild.members.fetch();
        let veri = message.guild.verificationLevel;
        let emb = new Discord.MessageEmbed()
        .setTitle(`${message.guild.name}'s Server Information`)
        .setColor("#FFA500")
        .addField("General", `✹ Owner: ${await message.guild.fetchOwner()} (${await message.guild.fetchOwner().then(o=>o.user.tag)})\n\
✹ Created on: ${message.guild.createdAt.toLocaleString("en-IN",{dateStyle: "long"})}\n\
✹ Verified Server: ${message.guild.verified?"Yes":"No"}\n\
✹ Verification Level: ${veri[0].toUpperCase()+veri.substr(1).toLowerCase().replace("_"," ")}`)
        .addField("Categories & Channels", `✹ Categories: ${message.guild.channels.cache.filter(c=>c.type=="GUILD_CATEGORY").size}\n\
✹ Text: ${message.guild.channels.cache.filter(c=>c.type=="GUILD_TEXT").size}\n\
✹ Voice Channels: ${message.guild.channels.cache.filter(c=>c.type=="GUILD_VOICE").size}\n\
✹ Announcement Channels: ${message.guild.channels.cache.filter(c=>c.type=="GUILD_NEWS").size}`)
        .addField("Others", `✹ Total Members: ${message.guild.memberCount}\n\
✹ Humans: ${message.guild.members.cache.filter(m=>!m.user.bot).size}\n\
✹ Bots: ${message.guild.members.cache.filter(m=>m.user.bot).size}\n\
✹ Custom Emojis: ${message.guild.emojis.cache.size}\n\
✹ Roles: ${message.guild.roles.cache.size}`)
        .setThumbnail(message.guild.icon?message.guild.iconURL():undefined)
        .setFooter(`Requested by ${message.author.tag}`)
        .setTimestamp();
        message.channel.send({embeds:[emb]});
    }
}
