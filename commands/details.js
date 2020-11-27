module.exports = {
    name: 'details',
    description: 'Gives the details of the bot',
    execute(message, args, Discord, bot) {
        const detembed = new Discord.MessageEmbed()
        .setColor("#D441EE")
        .setTitle("A-Bot")
        .setAuthor("Harshit Srivastava")
        .addFields(
            { name: "Invite the bot", value: "https://discord.com/oauth2/authorize?client_id=777840690515279872&scope=bot&permissions=8" },
            { name: "Join the support Server" , value: "NA"}
        )
        .setDescription("A-Bot is an advance yet simple bot made by TechAllByHarshit#3473 (<@451693463742840842>)")
        .setImage(bot.user.displayAvatarURL());
        message.channel.send(detembed);
    }
}
