module.exports = {
    name: 'info',
    description: 'Gives the details of the bot',
   permissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
    async execute(message, args, bot, Discord, prefix) {
        let botPerms = [];
        let missingPerms = [];
        this.permissions.forEach(p=>{
            botPerms.push(message.channel.permissionsFor(bot.user).has(p));
            if (!(message.channel.permissionsFor(bot.user).has(p)))
                missingPerms.push(p);
        })
        missingPerms = missingPerms.join("\n");
        if (botPerms.includes(false)) return message.channel.send(`The Following permissions which are missing are needed by the bot for this command:\n\n\`\`\`\n${missingPerms.replace("_"," ")}\`\`\``).catch(err=>console.log(`Missing send message permission in a server.`));
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
