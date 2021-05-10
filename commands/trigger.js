const Canvacord = require("canvacord");
module.exports = {
    name: 'trigger',
    type: 'fun',
    usage: '&{prefix}trigger <@mention>',
    description: 'triggers that person',
    aliases: [],
    permissions: ['SEND_MESSAGES', 'ATTACH_FILES'],
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
        
      const user = message.mentions.users.first() || bot.users.cache.get(args[0]) ||message.author;
      message.channel.startTyping();
      const img = await Canvacord.Canvas.trigger(user.displayAvatarURL({dynamic: false, format: "png"}));
      const attachment = new Discord.MessageAttachment(img, "triggered.gif");
      message.channel.send( attachment);
      message.channel.stopTyping();
    }
}
