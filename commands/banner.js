const figlet = require("util").promisify(require("figlet"));
module.exports = {
    name: 'banner',
    type: 'fun',
    usage: '&{prefix}banner <text>',
    description: 'types that text in banner form',
    async execute(message, args, bot, Discord, prefix) {
      if (args.length==0) return message.channel.send("Please enter the text.");
      const banner = await figlet(args.join("\n"));
      if (banner.length>2000) {
        message.channel.send("The banner is greater than discord message limit :(")
        return;
      }
      message.channel.send(banner, {code : true})
    }
}
