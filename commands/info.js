module.exports = {
    name: 'info',
    description: 'Gives the details of the bot',
    execute(message, args, Discord, bot) {
        const detembed = new Discord.MessageEmbed()
        .setColor("#D441EE")
        .setTitle("TheTronBot")
        .setThumbnail(message.author.displayAvatarURL())
        .addFields(
            { name: "Invite the bot", value: "https://discord.com/oauth2/authorize?client_id=777840690515279872&scope=bot&permissions=8" },
            { name: "Join the support Server" , value: "NA"}
        )
        .setDescription("TheTronBot is an multipurpose discord bot created by TechAllByHarshit#3473 (<@451693463742840842>)")
        .setImage(bot.user.displayAvatarURL())
        .setFooter(`Requested by ${message.author.username}`);
        message.channel.send(":tada: TheTronBot :tada:",detembed);
    }
}
