module.exports = {
    name: 'serverinfo',
    type: 'info'.{prefix}serverinfo',
    description: 'shows information about that server',
    aliases: ["si"],
    permissions: ['SEND_MESSAGES'],
    async execute(message, args, bot, Discord, prefix) {
        await message.guild.members.fetch();
        let emb = new Discord.MessageEmbed()
        .setTitle(`${message.guild.name}'s Server Information`)
        .setColor("#FFA500")
        .addField("General", `✹ Owner: ${message.guild.owner} (${message.guild.owner.user.tag})\n\
✹ Created on: ${message.guild.createdAt.toLocaleString("en-IN",{dateStyle: "long"})}\n\
✹ Server Region: ${message.guild.region}\n\
✹ Verified Server: ${message.guild.verified?"Yes":"No"}\n\
✹ Verification Level: ${message.guild.verificationLevel}`)
        .addField("Categories & Channels", `✹ Categories: ${message.guild.channels.cache.filter(c=>c.type=="category").size}\n\
✹ Text: ${message.guild.channels.cache.filter(c=>c.type=="text").size}\n\
✹ Voice Channels: ${message.guild.channels.cache.filter(c=>c.type=="voice").size}\n\
✹ Announcement Channels: ${message.guild.channels.cache.filter(c=>c.type=="news").size}`)
        .addField("Others", `✹ Total Members: ${message.guild.memberCount}\n\
✹ Humans: ${message.guild.members.cache.filter(m=>!m.user.bot).size}\n\
✹ Bots: ${message.guild.members.cache.filter(m=>m.user.bot).size}\n\
✹ Custom Emojis: ${message.guild.emojis.cache.size}\n\
✹ Roles: ${message.guild.roles.cache.size}`)
        .setThumbnail(message.guild.icon?message.guild.iconURL():undefined)
        .setFooter(`Requested by ${message.author.tag}`)
        .setTimestamp();
        message.channel.send(emb);
    }
}
