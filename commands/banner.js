const figlet = require("util").promisify(require("figlet"));
module.exports = {
    name: 'banner',
    type: 'fun',
    usage: '&{prefix}banner <text>',
    description: 'types that text in banner form',
    async execute(message, args, bot, Discord, prefix) {
      if (args.length==0) return message.channel.send("Please enter the text.");
      message.channel.send(await figlet(args.join("\n")), {code : true})
    }
}
