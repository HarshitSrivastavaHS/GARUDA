const figlet = require("util").promisify(require("figlet"));
module.exports = {
    name: 'banner',
    type: 'fun',
    usage: '&{prefix}banner <text>',
    description: 'types that text in banner form',
    permissions: ['SEND_MESSAGES'],
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
      if (args.length==0) return message.channel.send("Please enter the text.");
      const banner = await figlet(args.join("\n"));
      if (banner.length>2000) {
        message.channel.send("The banner is greater than discord message limit :(")
        return;
      }
      message.channel.send(banner, {code : true})
    }
}
