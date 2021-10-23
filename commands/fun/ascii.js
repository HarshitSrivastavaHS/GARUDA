const figlet = require("util").promisify(require("figlet"));
module.exports = {
    name: 'ascii',
    type: 'fun',
    usage: '&{prefix}banner <text>',
    description: 'types that text in banner form',
    aliases: [],
    permissions: ['SEND_MESSAGES'],
    async execute(message, args, bot, Discord, prefix) {
      if (args.length==0) return message.channel.send("Please enter the text.");
      let banner = await figlet(args.join("\n"));
      if (banner.length>2000) {
        message.channel.send("The banner is greater than discord message limit :(")
        return;
      }
      banner = Discord.Formatters.codeBlock("md", banner)
      message.channel.send(banner, {code : true})
    }
}
