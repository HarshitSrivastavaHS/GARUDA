module.exports = {
    name: 'invite',
    usage: '&{prefix}invite',
    description: 'gives bot\'s invite link',
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
      const em = new Discord.MessageEmbed()
      .setTitle("Want to add me to your server? Use the link below!")
      .setColor("BLUE")
      .addFields({
        name: "Invite me", value: "https://www.bit.ly/GARUDA-BOT"
      },
      { 
        name: "Join the support Server" , value: "https://discord.gg/sBe3jNSdqN"
      })
      .setThumbnail(bot.user.displayAvatarURL({size: 4096}));
      message.channel.send(em);
    }
}
