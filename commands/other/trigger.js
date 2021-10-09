const Canvacord = require("canvacord");
module.exports = {
    name: 'trigger',
    type: 'fun',
    usage: '&{prefix}trigger <@mention>',
    description: 'triggers that person',
    aliases: [],
    permissions: ['SEND_MESSAGES', 'ATTACH_FILES'],
    async execute(message, args, bot, Discord, prefix) {
        
        
      const user = message.mentions.members.first()&&message.mentions.members.filter(m=>args[0]&&args[0].includes(m.user.id)).size>=1?message.mentions.members.filter(m=>args[0]&&args[0].includes(m.user.id)).first():false || bot.users.cache.get(args[0]) ||message.author;
      message.channel.sendTyping();
      const img = await Canvacord.Canvas.trigger(user.displayAvatarURL({dynamic: false, format: "png"}));
      const attachment = new Discord.MessageAttachment(img, "triggered.gif");
      message.channel.send({files:[attachment]});
    }
}
