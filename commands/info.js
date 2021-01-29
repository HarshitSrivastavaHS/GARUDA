module.exports = {
    name: 'info',
    description: 'Gives the details of the bot',
    async execute(message, args, bot, Discord, prefix) {
        const detembed = new Discord.MessageEmbed()
        .setColor("#D441EE")
        .setTitle("GARUDA")
        .setThumbnail(message.author.displayAvatarURL({dynamic: true}))
        .addFields(
            { name: "Invite the bot", value: "https://bit.ly/GARUDA-BOT" },
            { name: "Join the support Server" , value: "https://discord.gg/sBe3jNSdqN"}
        )
        .setTimestamp()
        .setDescription("GARUDA is an multipurpose discord bot created by <@451693463742840842>")
        .setImage(bot.user.displayAvatarURL({size: 4096}))
        .setFooter(`Requested by ${message.author.username}`);
        message.channel.send(detembed);
    }
}
