const Canvacord = require("canvacord");
module.exports = {
    name: 'trigger',
    type: 'fun',
    usage: '&{prefix}trigger <@mention>',
    description: 'triggers that person',
    async execute(message, args, bot, Discord, prefix) {
      const user = message.mentions.users.first() || bot.users.cache.get(args[0]) ||message.author;
      message.channel.startTyping();
      const img = await Canvacord.Canvas.trigger(user.displayAvatarURL({dynamic: false, format: "png"}));
      const attachment = new Discord.MessageAttachment(img, "triggered.gif");
      message.channel.send( attachment);
      message.channel.stopTyping();
    }
}
